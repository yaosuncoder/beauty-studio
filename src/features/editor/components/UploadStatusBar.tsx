import { AlertCircle, LoaderCircle } from 'lucide-react'
import type { UploadTask } from '../upload/types'

type UploadStatusBarProps = {
  tasks: UploadTask[]
  maxConcurrentUploads: number
  onOpen: () => void
}

export default function UploadStatusBar({
  tasks,
  maxConcurrentUploads,
  onOpen,
}: UploadStatusBarProps) {
  const pendingTasks = tasks.filter((task) =>
    ['validating', 'queued', 'uploading'].includes(task.status),
  )
  const failedCount = tasks.filter((task) => task.status === 'failed').length

  if (pendingTasks.length === 0 && failedCount === 0) return null

  const progressTasks = tasks.filter((task) => task.status !== 'canceled')
  const overallProgress = progressTasks.length
    ? Math.round(
        progressTasks.reduce((total, task) => {
          return total + (task.status === 'succeeded' ? 100 : task.progress)
        }, 0) / progressTasks.length,
      )
    : 0

  return (
    <div className="relative border-t bg-white shadow-[0_-2px_8px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Open upload task details"
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-slate-50"
      >
        {pendingTasks.length > 0 ? (
          <LoaderCircle
            size={16}
            className="shrink-0 animate-spin text-blue-600"
          />
        ) : (
          <AlertCircle size={16} className="shrink-0 text-red-600" />
        )}
        <span className="min-w-0 flex-1 truncate text-sm">
          {pendingTasks.length > 0
            ? `Uploading ${pendingTasks.length} ${pendingTasks.length === 1 ? 'file' : 'files'}`
            : `${failedCount} upload ${failedCount === 1 ? 'failure' : 'failures'}`}
          {failedCount > 0 && pendingTasks.length > 0
            ? ` · ${failedCount} failed`
            : ''}
        </span>
        {pendingTasks.length > 0 && (
          <span className="shrink-0 text-xs text-slate-400">
            {tasks.filter((task) => task.status === 'uploading').length}/
            {maxConcurrentUploads} active
          </span>
        )}
        <span className="shrink-0 text-xs text-slate-500">
          {overallProgress}%
        </span>
      </button>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-[width]"
        style={{ width: `${overallProgress}%` }}
      />
    </div>
  )
}
