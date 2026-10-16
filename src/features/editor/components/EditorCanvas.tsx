import { useEffect, useRef, useState } from 'react'
import { Image as KonvaImage, Layer, Rect, Stage, Text, Transformer } from 'react-konva'
import type Konva from 'konva'
import type { EditorLayer, ImageLayer } from '../../../types/editor'

type EditorCanvasProps = {
  layers: EditorLayer[]
  selectedLayerId: string | undefined
  onSelectLayer: (layerId: string) => void
  onChangeLayer: (layer: EditorLayer) => void
}

type CanvasImageProps = {
  layer: ImageLayer
  isSelected: boolean
  onSelect: () => void
  onChange: (layer: ImageLayer) => void
}

function CanvasImage({
  layer,
  isSelected,
  onSelect,
  onChange,
}: CanvasImageProps) {
  const [image, setImage] = useState<HTMLImageElement>()
  const imageRef = useRef<Konva.Image>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    const loadedImage = new window.Image()
    const handleLoad = () => setImage(loadedImage)

    loadedImage.addEventListener('load', handleLoad)
    loadedImage.src = layer.src

    return () => loadedImage.removeEventListener('load', handleLoad)
  }, [layer.src])

  useEffect(() => {
    const transformer = transformerRef.current
    if (!transformer) return

    transformer.nodes(
      isSelected && imageRef.current ? [imageRef.current] : [],
    )
    transformer.getLayer()?.batchDraw()
  }, [isSelected, image])

  if (!image) return null

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={image}
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        rotation={layer.rotation}
        opacity={layer.opacity}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={onSelect}
        onDragEnd={(event) =>
          onChange({
            ...layer,
            x: event.target.x(),
            y: event.target.y(),
          })
        }
        onTransformEnd={(event) => {
          const node = event.target
          const width = Math.max(20, node.width() * node.scaleX())
          const height = Math.max(20, node.height() * node.scaleY())
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            ...layer,
            x: node.x(),
            y: node.y(),
            width,
            height,
          })
        }}
        shadowColor={isSelected ? '#3b82f6' : undefined}
        shadowBlur={isSelected ? 8 : 0}
      />
      {isSelected && (
        <Transformer
          ref={transformerRef}
          keepRatio
          flipEnabled={false}
          rotateEnabled={false}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
          }
          anchorSize={8}
          anchorStroke="#3b82f6"
          borderStroke="#3b82f6"
        />
      )}
    </>
  )
}

export default function EditorCanvas({
  layers,
  selectedLayerId,
  onSelectLayer,
  onChangeLayer,
}: EditorCanvasProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <Stage width={720} height={480}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={720}
            height={480}
            fill="#ffffff"
            listening={false}
          />

          <Rect
            x={40}
            y={40}
            width={640}
            height={400}
            stroke="#e2e8f0"
            strokeWidth={2}
            listening={false}
          />

          {layers.map((layer) => {
            if (layer.type === 'image') {
              return (
                <CanvasImage
                  key={layer.id}
                  layer={layer}
                  isSelected={selectedLayerId === layer.id}
                  onSelect={() => onSelectLayer(layer.id)}
                  onChange={onChangeLayer}
                />
              )
            }

            return (
              <Text
                key={layer.id}
                x={layer.x}
                y={layer.y}
                rotation={layer.rotation}
                text={layer.text}
                fontSize={layer.fontSize}
                fill={layer.fill}
                opacity={layer.opacity}
                draggable
                onClick={() => onSelectLayer(layer.id)}
                onTap={() => onSelectLayer(layer.id)}
                onDragStart={() => onSelectLayer(layer.id)}
                onDragEnd={(event) =>
                  onChangeLayer({
                    ...layer,
                    x: event.target.x(),
                    y: event.target.y(),
                  })
                }
                shadowColor={selectedLayerId === layer.id ? '#3b82f6' : undefined}
                shadowBlur={selectedLayerId === layer.id ? 4 : 0}
              />
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}
