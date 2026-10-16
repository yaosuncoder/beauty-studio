import {
  ImagePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Shapes,
  Type,
} from 'lucide-react'

type EditorToolbarProps = {
  assetsOpen: boolean
  onToggleAssets: () => void
  onUpload: () => void
  onAddText: () => void
}

export default function EditorToolbar({
  assetsOpen,
  onToggleAssets,
  onUpload,
  onAddText,
}: EditorToolbarProps) {
  return (
    <aside className="z-10 flex h-full flex-col items-center gap-2 border-r bg-white p-2">
      <button
        type="button"
        onClick={onToggleAssets}
        aria-label={assetsOpen ? 'Collapse asset library' : 'Expand asset library'}
        title={assetsOpen ? 'Collapse asset library' : 'Expand asset library'}
        className="rounded-lg p-3 hover:bg-slate-100"
      >
        {assetsOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>
      <button
        type="button"
        onClick={onUpload}
        aria-label="Upload images"
        title="Upload images"
        className="rounded-lg p-3 hover:bg-slate-100"
      >
        <ImagePlus size={20} />
      </button>
      <button
        type="button"
        onClick={onAddText}
        aria-label="Add text"
        title="Add text"
        className="rounded-lg p-3 hover:bg-slate-100"
      >
        <Type size={20} />
      </button>
      <button
        type="button"
        aria-label="Elements"
        title="Elements"
        className="rounded-lg p-3 hover:bg-slate-100"
      >
        <Shapes size={20} />
      </button>
    </aside>
  )
}
