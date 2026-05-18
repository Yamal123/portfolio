export function Header({ title }: { title: string }) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
    </div>
  )
}
