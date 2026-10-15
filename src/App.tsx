
import EditorLayout from "./features/editor/EditorLayout";
import { useEditor } from "./features/editor/useEditor";
import { useFiles } from "./features/editor/useFiles";

export default function App() {
  const editor = useEditor();
  const files = useFiles();

  function removeFile(fileId: string) {
    files.removeFile(fileId, editor.isFileInUse);
  }

  return (
    <EditorLayout
      layers={editor.layers}
      selectedLayer={editor.selectedLayer}
      selectedLayerId={editor.selectedLayerId}
      files={files.files}
      onAddText={editor.addText}
      onUploadImage={files.addFile}
      onAddFileToCanvas={editor.addImage}
      onRemoveFile={removeFile}
      isFileInUse={editor.isFileInUse}
      onSelectLayer={editor.selectLayer}
      onChangeLayer={editor.changeLayer}
      onDeleteLayer={editor.deleteLayer}
    />
  );
}
