import { Stage, Layer, Rect, Text } from 'react-konva'

export default function EditorCanvas() {
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
          />

          <Rect
            x={40}
            y={40}
            width={640}
            height={400}
            stroke="#e2e8f0"
            strokeWidth={2}
          />

          <Text
            x={100}
            y={100}
            text="Beauty Studio"
            fontSize={32}
            fill="#0f172a"
          />

          <Text
            x={100}
            y={150}
            text="Create something beautiful."
            fontSize={18}
            fill="#64748b"
          />
        </Layer>
      </Stage>
    </div>
  )
}