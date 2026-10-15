import { useState } from 'react'
import EditorLayout from './features/editor/EditorLayout'
import { updateLayer } from './features/editor/updateLayer'
import type { EditorLayer } from './types/editor'

const initialLayers: EditorLayer[] = [
  {
    id: 'title',
    type: 'text',
    text: 'Beauty Studio',
    x: 200,
    y: 100,
    rotation: 0,
    fontSize: 32,
    fill: '#0f172a',
  },
  {
    id: 'subtitle',
    type: 'text',
    text: 'Create something beautiful.',
    x: 100,
    y: 150,
    rotation: 0,
    fontSize: 18,
    fill: '#64748b',
  },
]

export default function App() {
  const [layers, setLayers] = useState<EditorLayer[]>(initialLayers)
  const [selectedLayerId, setSelectedLayerId] = useState<string>()
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId)

  function addText() {
    const layer: EditorLayer = {
      id: crypto.randomUUID(),
      type: 'text',
      text: 'New text',
      x: 100,
      y: 100,
      rotation: 0,
      fontSize: 24,
      fill: '#0f172a',
    }

    setLayers((currentLayers) => [...currentLayers, layer])
    setSelectedLayerId(layer.id)
  }

  function changeLayer(updatedLayer: EditorLayer) {
    setLayers((currentLayers) => updateLayer(currentLayers, updatedLayer))
  }

  function deleteLayer(layerId: string) {
    setLayers((currentLayers) =>
      currentLayers.filter((layer) => layer.id !== layerId),
    )
    setSelectedLayerId(undefined)
  }

  return (
    <EditorLayout
      layers={layers}
      selectedLayer={selectedLayer}
      selectedLayerId={selectedLayerId}
      onAddText={addText}
      onSelectLayer={setSelectedLayerId}
      onChangeLayer={changeLayer}
      onDeleteLayer={deleteLayer}
    />
  )
}