import type { LocalImageAsset } from '../../../types/files'

export type UploadStatus =
  | 'validating'
  | 'queued'
  | 'uploading'
  | 'succeeded'
  | 'failed'
  | 'canceled'

export type UploadTask = {
  id: string
  fileName: string
  sizeBytes: number
  status: UploadStatus
  progress: number
  attempts: number
  previewUrl?: string
  error?: string
  canRetry: boolean
}

export type PreparedUpload = {
  id: string
  file: File
  asset: LocalImageAsset
  attempt: number
}
