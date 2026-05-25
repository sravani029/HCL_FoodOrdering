export default function Loader({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-14 w-14' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-brand-200 border-t-brand-500`} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  )
}
