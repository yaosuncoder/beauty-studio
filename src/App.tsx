import EditorLayout from './features/editor/EditorLayout'
import { useEditor } from './features/editor/useEditor'

export default function App() {
  const editor = useEditor()

  return (
    <EditorLayout
      layers={editor.layers}
      selectedLayer={editor.selectedLayer}
      selectedLayerId={editor.selectedLayerId}
      onAddText={editor.addText}
      onUploadImage={editor.addImage}
      onSelectLayer={editor.selectLayer}
      onChangeLayer={editor.changeLayer}
      onDeleteLayer={editor.deleteLayer}
    />
  )
}
