import { Shapes, Type } from 'lucide-react'
import ImageUpload from './ImageUpload'
import type { UploadedImage } from '../../types/editor'

type EditorToolbarProps = {
  onAddText: () => void
  onUploadImage: (image: UploadedImage) => void
}

export default function EditorToolbar({
  onAddText,
  onUploadImage,
}: EditorToolbarProps) {
  return (
    <aside className="border-r bg-white p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Tools
      </h2>

      <div className="space-y-2">
        <ImageUpload onUpload={onUploadImage} />
        <button
          type="button"
          onClick={onAddText}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-100"
        >
          <Type size={18} />
          Text
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-100"
        >
          <Shapes size={18} />
          Elements
        </button>
      </div>
    </aside>
  )
}
