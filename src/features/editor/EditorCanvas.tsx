import { Layer, Rect, Stage, Text } from 'react-konva'
import type { EditorLayer } from '../../types/editor'

type EditorCanvasProps = {
  layers: EditorLayer[]
  selectedLayerId: string | undefined
  onSelectLayer: (layerId: string) => void
  onChangeLayer: (layer: EditorLayer) => void
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
            if (layer.type !== 'text') return null

            return (
              <Text
                key={layer.id}
                x={layer.x}
                y={layer.y}
                rotation={layer.rotation}
                text={layer.text}
                fontSize={layer.fontSize}
                fill={layer.fill}
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
