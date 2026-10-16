import { Image, Type } from 'lucide-react'
import type { EditorLayer } from '../../../types/editor'

type LayersPanelProps = {
  layers: EditorLayer[]
  selectedLayerId: string | undefined
  onSelectLayer: (layerId: string) => void
}

function layerName(layer: EditorLayer) {
  if (layer.type === 'text') return layer.text.trim() || 'Empty text'
  return 'Image layer'
}

export default function LayersPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
}: LayersPanelProps) {
  return (
    <section className="border-b p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Layers</h2>
        <span className="text-xs text-slate-400">{layers.length}</span>
      </div>
      {layers.length === 0 ? (
        <p className="text-sm text-slate-500">No layers on the canvas.</p>
      ) : (
        <ul className="max-h-56 space-y-1 overflow-y-auto">
          {[...layers].reverse().map((layer) => {
            const selected = layer.id === selectedLayerId
            const Icon = layer.type === 'text' ? Type : Image

            return (
              <li key={layer.id}>
                <button
                  type="button"
                  onClick={() => onSelectLayer(layer.id)}
                  aria-pressed={selected}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${
                    selected
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="truncate">{layerName(layer)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
