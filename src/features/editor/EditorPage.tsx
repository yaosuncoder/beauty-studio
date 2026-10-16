import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Download } from 'lucide-react'
import { useEditor } from './useEditor'
import { useFiles } from './hooks/useFiles'
import { useUploadManager } from './upload/useUploadManager'
import AssetSidebar from './components/AssetSidebar'
import EditorCanvas from './components/EditorCanvas'
import EditorToolbar from './components/EditorToolbar'
import LayersPanel from './components/LayersPanel'
import PropertiesPanel from './components/PropertiesPanel'
import UploadManagerPanel from './components/UploadManagerPanel'
import UploadStatusBar from './components/UploadStatusBar'

export default function EditorPage() {
  const editor = useEditor()
  const files = useFiles()
  const uploads = useUploadManager({ onUploadSucceeded: files.addFile })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [assetsOpen, setAssetsOpen] = useState(true)
  const [selectedFileId, setSelectedFileId] = useState<string>()
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false)

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      uploads.addFiles(event.target.files)
    }
    event.target.value = ''
  }

  function removeFile(fileId: string) {
    if (editor.isFileInUse(fileId)) return
    files.removeFile(fileId, editor.isFileInUse)
    setSelectedFileId((currentId) =>
      currentId === fileId ? undefined : currentId,
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={handleFileSelection}
        className="sr-only"
        aria-label="Choose images to upload"
      />
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-5">
        <h1 className="text-lg font-bold tracking-tight">Beauty Studio</h1>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <Download size={16} />
          Export
        </button>
      </header>

      <main
        className="grid min-h-0 flex-1"
        style={{
          gridTemplateColumns: `56px ${assetsOpen ? '260px' : '0px'} minmax(0, 1fr) 280px`,
        }}
      >
        <div className="min-h-0" style={{ gridColumn: 1 }}>
          <EditorToolbar
            assetsOpen={assetsOpen}
            onToggleAssets={() => setAssetsOpen((open) => !open)}
            onUpload={() => fileInputRef.current?.click()}
            onAddText={editor.addText}
          />
        </div>

        <div className="min-h-0" style={{ gridColumn: 2 }}>
          <AssetSidebar
            open={assetsOpen}
            files={files.files}
            selectedFileId={selectedFileId}
            onSelectFile={setSelectedFileId}
            onAddToCanvas={editor.addImage}
            onRemove={removeFile}
            isFileInUse={editor.isFileInUse}
            onUpload={() => fileInputRef.current?.click()}
          />
        </div>

        <section
          className="relative flex min-w-0 items-center justify-center overflow-auto p-6"
          style={{ gridColumn: 3 }}
        >
          <EditorCanvas
            layers={editor.layers}
            selectedLayerId={editor.selectedLayerId}
            onSelectLayer={editor.selectLayer}
            onChangeLayer={editor.changeLayer}
          />
        </section>

        <aside
          className="min-h-0 min-w-0 overflow-y-auto border-l bg-white"
          style={{ gridColumn: 4 }}
        >
          <LayersPanel
            layers={editor.layers}
            selectedLayerId={editor.selectedLayerId}
            onSelectLayer={editor.selectLayer}
          />
          <PropertiesPanel
            selectedLayer={editor.selectedLayer}
            onChange={editor.changeLayer}
            onDelete={editor.deleteLayer}
          />
        </aside>
      </main>

      <div
        className="relative z-30 shrink-0"
        style={{
          marginLeft: assetsOpen ? 316 : 56,
          marginRight: 280,
        }}
      >
        {uploadPanelOpen && (
          <div className="absolute bottom-full left-0 right-0">
            <UploadManagerPanel
              tasks={uploads.tasks}
              onCancel={uploads.cancelTask}
              onRetry={uploads.retryTask}
              onClose={() => setUploadPanelOpen(false)}
            />
          </div>
        )}
        <UploadStatusBar
          tasks={uploads.tasks}
          maxConcurrentUploads={uploads.maxConcurrentUploads}
          onOpen={() => setUploadPanelOpen((open) => !open)}
        />
      </div>
    </div>
  )
}
