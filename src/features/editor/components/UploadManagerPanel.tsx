import { ChevronDown, RotateCcw, X } from 'lucide-react'
import type { UploadTask } from '../upload/types'

type UploadManagerProps = {
  tasks: UploadTask[]
  onCancel: (taskId: string) => void
  onRetry: (taskId: string) => void
  onClose: () => void
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function statusLabel(task: UploadTask) {
  switch (task.status) {
    case 'validating':
      return 'Checking image…'
    case 'queued':
      return 'Waiting to upload'
    case 'uploading':
      return `Uploading · ${task.progress}%`
    case 'succeeded':
      return 'Upload succeeded'
    case 'failed':
      return 'Upload failed'
    case 'canceled':
      return 'Canceled'
  }
}

export default function UploadManagerPanel({
  tasks,
  onCancel,
  onRetry,
  onClose,
}: UploadManagerProps) {
  return (
    <section
      aria-label="Upload tasks"
      className="flex max-h-[min(65vh,32rem)] flex-col overflow-hidden rounded-t-xl border border-slate-200 bg-white shadow-xl"
    >
      <header className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Upload tasks</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close upload tasks"
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
        >
          <ChevronDown size={18} />
        </button>
      </header>
      <ul className="space-y-2 overflow-y-auto p-3">
        {tasks.map((task) => {
          const isActive = ["validating", "queued", "uploading"].includes(
            task.status,
          );

          return (
            <li
              key={task.id}
              className="rounded-lg border border-slate-200 p-2"
            >
              <p className="truncate text-xs font-medium" title={task.fileName}>
                {task.fileName}
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs text-slate-500">{statusLabel(task)}</p>
                <p className="shrink-0 text-xs text-slate-400">
                  {formatFileSize(task.sizeBytes)}
                </p>
              </div>

              {task.status === "succeeded" && (
                <p className="mt-1 text-xs text-emerald-700">Added to assets</p>
              )}

              {task.status === "uploading" && (
                <div
                  role="progressbar"
                  aria-label={`Upload progress for ${task.fileName}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={task.progress}
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className="h-full bg-blue-600 transition-[width]"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              )}

              {task.error && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {task.error}
                </p>
              )}

              <div className="mt-2 flex justify-end">
                {isActive && (
                  <button
                    type="button"
                    onClick={() => onCancel(task.id)}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                  >
                    <X size={13} />
                    Cancel
                  </button>
                )}
                {task.status === "failed" && task.canRetry && (
                  <button
                    type="button"
                    onClick={() => onRetry(task.id)}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                  >
                    <RotateCcw size={13} />
                    Retry
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  )
}
