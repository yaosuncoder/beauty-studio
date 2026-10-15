import { useState } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva'

type Position = {
  x: number
  y: number
}

export default function EditorCanvas() {
  const [titlePosition, setTitlePosition] = useState<Position>({
    x: 200,
    y: 100,
  })

  const [subtitlePosition, setSubtitlePosition] =
    useState<Position>({
      x: 100,
      y: 150,
    })

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

          <Text
            x={titlePosition.x}
            y={titlePosition.y}
            text="Beauty Studio"
            fontSize={32}
            fill="#0f172a"
            draggable
            onDragEnd={(event) => {
              setTitlePosition({
                x: event.target.x(),
                y: event.target.y(),
              })
            }}
          />

          <Text
            x={subtitlePosition.x}
            y={subtitlePosition.y}
            text="Create something beautiful."
            fontSize={18}
            fill="#64748b"
            draggable
            onDragEnd={(event) => {
              setSubtitlePosition({
                x: event.target.x(),
                y: event.target.y(),
              })
            }}
          />
        </Layer>
      </Stage>

      <div className="mt-3 border-t pt-3 text-xs text-slate-500">
        <p>
          Title position: X {Math.round(titlePosition.x)}, Y{' '}
          {Math.round(titlePosition.y)}
        </p>
        <p>
          Subtitle position: X{' '}
          {Math.round(subtitlePosition.x)}, Y{' '}
          {Math.round(subtitlePosition.y)}
        </p>
      </div>
    </div>
  )
}