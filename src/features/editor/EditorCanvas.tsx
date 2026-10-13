
import { Layer, Rect, Stage, Text } from 'react-konva'

export function EditorCanvas() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <Stage width={800} height={500}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={800}
            height={500}
            fill="#f8e9e9"
          />
          <Text
            x={40}
            y={40}
            text="Beauty Studio"
            fontSize={32}
            fill="#4b252b"
          />
          <Text
            x={40}
            y={90}
            text="Create your beauty campaign"
            fontSize={18}
            fill="#7b5257"
          />
        </Layer>
      </Stage>
    </div>
  )
}
