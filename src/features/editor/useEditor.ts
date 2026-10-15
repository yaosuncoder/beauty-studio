import { useCallback, useEffect, useState } from 'react'
import { updateLayer } from './updateLayer'
import type { EditorLayer } from '../../types/editor'
import type { LocalImageAsset } from '../../types/files'

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

export function useEditor() {
  const [layers, setLayers] = useState<EditorLayer[]>(initialLayers)
  const [selectedLayerId, setSelectedLayerId] = useState<string>()
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId)

  const addText = useCallback(() => {
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
  }, [])

  const addImage = useCallback((file: LocalImageAsset) => {
    const scale = Math.min(1, 320 / file.width, 320 / file.height)
    const layer: EditorLayer = {
      assetId: file.id,
      src: file.src,
      id: crypto.randomUUID(),
      type: 'image',
      x: 80,
      y: 80,
      rotation: 0,
      width: file.width * scale,
      height: file.height * scale,
    }

    setLayers((currentLayers) => [...currentLayers, layer])
    setSelectedLayerId(layer.id)
  }, [])

  const changeLayer = useCallback((updatedLayer: EditorLayer) => {
    setLayers((currentLayers) => updateLayer(currentLayers, updatedLayer))
  }, [])

  const deleteLayer = useCallback(
    (layerId: string) => {
      setLayers((currentLayers) =>
        currentLayers.filter((currentLayer) => currentLayer.id !== layerId),
      )
      setSelectedLayerId((currentId) =>
        currentId === layerId ? undefined : currentId,
      )
    },
    [],
  )

  const isFileInUse = useCallback(
    (fileId: string) =>
      layers.some(
        (layer) => layer.type === 'image' && layer.assetId === fileId,
      ),
    [layers],
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        !selectedLayerId ||
        (event.key !== 'Delete' && event.key !== 'Backspace') ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return
      }

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return
      }

      event.preventDefault()
      deleteLayer(selectedLayerId)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedLayerId, deleteLayer])

  return {
    layers,
    selectedLayer,
    selectedLayerId,
    addText,
    addImage,
    selectLayer: setSelectedLayerId,
    changeLayer,
    deleteLayer,
    isFileInUse,
  }
}
