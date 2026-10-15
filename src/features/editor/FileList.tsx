
import { ImagePlus, Trash2 } from "lucide-react";
import type { LocalImageAsset } from "../../types/files";

type FileListProps = {
  files: LocalImageAsset[];
  onAddToCanvas: (file: LocalImageAsset) => void;
  onRemove: (fileId: string) => void;
  isFileInUse: (fileId: string) => boolean;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({
  files,
  onAddToCanvas,
  onRemove,
  isFileInUse,
}: FileListProps) {
  return (
    <section className="mt-6 border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Assets
        </h2>
        <span className="text-xs text-slate-400">
          {files.length} files
        </span>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-slate-400">
          Your uploaded images will appear here.
        </p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => {
            const inUse = isFileInUse(file.id);

            return (
              <li
                key={file.id}
                className="rounded-lg border border-slate-200 p-2"
              >
                <div className="flex gap-2">
                  <img
                    src={file.src}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-md bg-slate-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-medium"
                      title={file.fileName}
                    >
                      {file.fileName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatFileSize(file.sizeBytes)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Local preview</p>
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onAddToCanvas(file)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md bg-slate-900 px-2 py-1.5 text-xs text-white"
                  >
                    <ImagePlus size={14} />
                    Add to canvas
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
                    className="rounded-md border p-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {inUse && (
                  <p className="mt-2 text-xs text-slate-400">
                    In use on canvas
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
