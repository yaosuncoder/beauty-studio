
import { ImagePlus, Trash2, Upload } from "lucide-react";
import type { LocalImageAsset } from "../../../types/files";
import { formatFileSize } from "../../../utils/formatFileSize";

type AssetSidebarProps = {
  open: boolean;
  files: LocalImageAsset[];
  onAddToCanvas: (file: LocalImageAsset) => void;
  onRemove: (fileId: string) => void;
  isFileInUse: (fileId: string) => boolean;
  selectedFileId: string | undefined;
  onSelectFile: (fileId: string) => void;
  onUpload: () => void;
};

export default function AssetSidebar({
  open,
  files,
  onAddToCanvas,
  onRemove,
  isFileInUse,
  selectedFileId,
  onSelectFile,
  onUpload,
}: AssetSidebarProps) {
  if (!open) return null;

  const selectedFile = files.find((file) => file.id === selectedFileId);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Asset library</h2>
          <p className="mt-1 text-xs text-slate-500">{files.length} images</p>
        </div>
        <button
          type="button"
          onClick={onUpload}
          className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-2 text-xs text-white hover:bg-slate-700"
        >
          <Upload size={14} />
          Import
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {files.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center">
            <p className="text-sm text-slate-500">No images yet</p>
            <p className="mt-1 text-xs text-slate-400">
              Import images to build your library.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {files.map((file) => {
              const inUse = isFileInUse(file.id);
              const isSelected = selectedFileId === file.id;

              return (
                <li key={file.id} className="relative min-w-0">
                  <button
                    type="button"
                    onClick={() => onSelectFile(file.id)}
                    aria-pressed={isSelected}
                    className={`block w-full overflow-hidden rounded-lg border text-left ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={file.src}
                      alt={file.fileName}
                      className="aspect-square w-full bg-slate-100 object-cover"
                    />
                    <div className="p-2">
                      <p
                        className="truncate pr-1 text-sm font-medium"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatFileSize(file.sizeBytes)}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemove(file.id)}
                    disabled={inUse}
                    title={
                      inUse
                        ? "Remove this image from the canvas first."
                        : "Remove file"
                    }
                    aria-label={`Remove ${file.fileName}`}
                    className="absolute right-1 top-1 rounded-md border border-white/80 bg-white/90 p-1.5 text-slate-600 shadow-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="border-t p-3">
        <button
          type="button"
          onClick={() => selectedFile && onAddToCanvas(selectedFile)}
          disabled={!selectedFile}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ImagePlus size={16} />
          Add selected to canvas
        </button>
      </div>
    </aside>
  );
}
