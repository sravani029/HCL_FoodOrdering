package com.foodordering.service;

import com.foodordering.entity.EmailLog;
import com.foodordering.entity.FoodOrder;
import com.foodordering.entity.User;
import com.foodordering.enums.EmailType;
import com.foodordering.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;

    @Async
    public void sendRegistrationEmail(User user) {
        String subject = "Welcome to FoodHub!";
        String body = "Hello " + user.getName() + ",\n\nYour account has been registered successfully as "
                + user.getRole() + ".\n\nThank you for joining FoodHub!";
        sendEmail(user.getEmail(), subject, body, EmailType.REGISTRATION);
    }

    @Async
    public void sendOrderConfirmationEmail(FoodOrder order) {
        String subject = "Order Confirmed - #" + order.getId();
        String body = "Hello " + order.getCustomer().getName() + ",\n\nYour order #" + order.getId()
                + " from " + order.getRestaurant().getName()
                + " has been placed.\nTotal: $" + order.getTotalAmount()
                + "\nPayment: COD\n\nThank you!";
        sendEmail(order.getCustomer().getEmail(), subject, body, EmailType.ORDER_CONFIRMATION);
    }

    @Async
    public void sendOrderCancellationEmail(FoodOrder order) {
        String subject = "Order Cancelled - #" + order.getId();
        String body = "Hello " + order.getCustomer().getName() + ",\n\nYour order #" + order.getId()
                + " has been cancelled successfully.";
        sendEmail(order.getCustomer().getEmail(), subject, body, EmailType.ORDER_CANCELLATION);
    }

    private void sendEmail(String recipient, String subject, String body, EmailType type) {
        EmailLog emailLog = EmailLog.builder()
                .recipient(recipient)
                .subject(subject)
                .type(type)
                .success(false)
                .build();
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            emailLog.setSuccess(true);
            log.info("Email sent to {} - type: {}", recipient, type);
        } catch (Exception e) {
            emailLog.setSuccess(false);
            emailLog.setErrorMessage(e.getMessage());
            log.error("Failed to send email to {}: {}", recipient, e.getMessage());
        }
        emailLogRepository.save(emailLog);
    }
}
