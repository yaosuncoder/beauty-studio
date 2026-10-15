import { Download } from 'lucide-react'
import EditorCanvas from './EditorCanvas'
import EditorToolbar from './EditorToolbar'
import PropertiesPanel from './PropertiesPanel'
import type { EditorLayer, UploadedImage } from '../../types/editor'

type EditorLayoutProps = {
  layers: EditorLayer[]
  selectedLayer: EditorLayer | undefined
  selectedLayerId: string | undefined
  onAddText: () => void
  onUploadImage: (image: UploadedImage) => void
  onSelectLayer: (layerId: string) => void
  onChangeLayer: (layer: EditorLayer) => void
  onDeleteLayer: (layerId: string) => void
}

export default function EditorLayout({
  layers,
  selectedLayer,
  selectedLayerId,
  onAddText,
  onUploadImage,
  onSelectLayer,
  onChangeLayer,
  onDeleteLayer,
}: EditorLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-slate-100 text-slate-900">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <h1 className="text-xl font-bold tracking-tight">Beauty Studio</h1>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <Download size={16} />
          Export
        </button>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-[220px_minmax(0,1fr)_260px]">
        <EditorToolbar
          onAddText={onAddText}
          onUploadImage={onUploadImage}
        />

        <section className="flex min-w-0 items-center justify-center overflow-auto p-6">
          <EditorCanvas
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={onSelectLayer}
            onChangeLayer={onChangeLayer}
          />
        </section>

        <PropertiesPanel
          selectedLayer={selectedLayer}
          onChange={onChangeLayer}
          onDelete={onDeleteLayer}
        />
      </main>
    </div>
  )
}
