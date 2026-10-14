
import {
  ImagePlus,
  Type,
  Shapes,
  Settings2,
  Download,
} from 'lucide-react'
import EditorCanvas  from './features/editor/EditorCanvas'

const tools = [
  { label: 'Upload', icon: ImagePlus },
  { label: 'Text', icon: Type },
  { label: 'Elements', icon: Shapes },
]

export default function App() {
  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <h1 className="text-xl font-bold tracking-tight">
          Beauty Studio
        </h1>

        <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          <Download size={16} />
          Export
        </button>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_260px]">
        <aside className="border-r bg-white p-4">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tools
          </h2>

          <div className="space-y-2">
            {tools.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-100"
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-w-0 items-center justify-center overflow-auto p-6">
          <EditorCanvas />
        </section>

        <aside className="border-l bg-white p-5">
          <div className="mb-5 flex items-center gap-2">
            <Settings2 size={18} />
            <h2 className="font-semibold">Properties</h2>
          </div>

          <p className="text-sm text-slate-500">
            Select an element to edit its properties.
          </p>
        </aside>
      </main>
    </div>
  )
}