import { ImagePlus, Shapes, Type } from 'lucide-react'

type EditorToolbarProps = {
  onAddText: () => void
}

export default function EditorToolbar({ onAddText }: EditorToolbarProps) {
  const tools = [
    { label: 'Upload', icon: ImagePlus },
    { label: 'Text', icon: Type, onClick: onAddText },
    { label: 'Elements', icon: Shapes },
  ]

  return (
    <aside className="border-r bg-white p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Tools
      </h2>

      <div className="space-y-2">
        {tools.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-100"
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  )
}
