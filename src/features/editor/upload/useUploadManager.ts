import { useCallback, useEffect, useRef, useState } from 'react'
import type { LocalImageAsset } from '../../../types/files'
import type { PreparedUpload, UploadTask } from './types'
import { uploadFile } from './uploadService'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_CONCURRENT_UPLOADS = 5
const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

type UseUploadManagerOptions = {
  onUploadSucceeded: (asset: LocalImageAsset) => void
}

function validateFile(file: File) {
  if (!ACCEPTED_TYPES.has(file.type)) {
    return 'Choose a PNG, JPEG, or WebP image.'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 10 MB or smaller.'
  }

  return undefined
}

export function useUploadManager({
  onUploadSucceeded,
}: UseUploadManagerOptions) {
  const [tasks, setTasks] = useState<UploadTask[]>([])
  const tasksRef = useRef(tasks)
  tasksRef.current = tasks

  const queueRef = useRef<PreparedUpload[]>([])
  const activeCountRef = useRef(0)
  const controllersRef = useRef(new Map<string, AbortController>())
  const filesRef = useRef(new Map<string, File>())
  const assetsRef = useRef(new Map<string, LocalImageAsset>())
  const objectUrlsRef = useRef(new Set<string>())
  const canceledIdsRef = useRef(new Set<string>())
  const mountedRef = useRef(false)
  const successCallbackRef = useRef(onUploadSucceeded)
  const pumpRef = useRef<() => void>(() => {})

  successCallbackRef.current = onUploadSucceeded

  const updateTask = useCallback(
    (taskId: string, update: (task: UploadTask) => UploadTask) => {
      if (!mountedRef.current) return
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? update(task) : task,
        ),
      )
    },
    [],
  )

  const releasePreview = useCallback((src: string | undefined) => {
    if (!src || !objectUrlsRef.current.delete(src)) return
    URL.revokeObjectURL(src)
  }, [])

  const runUpload = useCallback(
    async (upload: PreparedUpload) => {
      activeCountRef.current += 1
      const controller = new AbortController()
      controllersRef.current.set(upload.id, controller)

      updateTask(upload.id, (task) => ({
        ...task,
        status: 'uploading',
        error: undefined,
      }))

      try {
        await uploadFile(upload.file, {
          signal: controller.signal,
          attempt: upload.attempt,
          onProgress: (progress) =>
            updateTask(upload.id, (task) => ({ ...task, progress })),
        })

        if (controller.signal.aborted || !mountedRef.current) return

        successCallbackRef.current(upload.asset)
        objectUrlsRef.current.delete(upload.asset.src)
        filesRef.current.delete(upload.id)
        assetsRef.current.delete(upload.id)
        updateTask(upload.id, (task) => ({
          ...task,
          status: 'succeeded',
          progress: 100,
          canRetry: false,
        }))
      } catch (error) {
        if (controller.signal.aborted) {
          updateTask(upload.id, (task) => ({
            ...task,
            status: 'canceled',
            canRetry: false,
          }))
        } else {
          updateTask(upload.id, (task) => ({
            ...task,
            status: 'failed',
            error:
              error instanceof Error
                ? error.message
                : 'Upload failed. Please retry.',
            canRetry: true,
          }))
        }
      } finally {
        controllersRef.current.delete(upload.id)
        activeCountRef.current -= 1
        if (controller.signal.aborted) {
          releasePreview(upload.asset.src)
          filesRef.current.delete(upload.id)
          assetsRef.current.delete(upload.id)
        }
        pumpRef.current()
      }
    },
    [releasePreview, updateTask],
  )

  const pump = useCallback(() => {
    if (!mountedRef.current) return

    while (
      activeCountRef.current < MAX_CONCURRENT_UPLOADS &&
      queueRef.current.length > 0
    ) {
      const upload = queueRef.current.shift()
      if (!upload || canceledIdsRef.current.has(upload.id)) continue
      void runUpload(upload)
    }
  }, [runUpload])

  pumpRef.current = pump

  const prepareFile = useCallback(
    async (file: File) => {
      const id = crypto.randomUUID()
      filesRef.current.set(id, file)
      const validationError = validateFile(file)

      setTasks((currentTasks) => [
        ...currentTasks,
        {
          id,
          fileName: file.name,
          sizeBytes: file.size,
          status: validationError ? 'failed' : 'validating',
          progress: 0,
          attempts: 0,
          error: validationError,
          canRetry: false,
        },
      ])

      if (validationError) {
        filesRef.current.delete(id)
        return
      }

      let previewUrl: string
      try {
        previewUrl = URL.createObjectURL(file)
      } catch {
        filesRef.current.delete(id)
        updateTask(id, (task) => ({
          ...task,
          status: 'failed',
          error: 'Could not create a local image preview.',
          canRetry: false,
        }))
        return
      }

      objectUrlsRef.current.add(previewUrl)
      updateTask(id, (task) => ({ ...task, previewUrl }))

      try {
        const image = new window.Image()
        image.src = previewUrl
        await image.decode()

        if (canceledIdsRef.current.delete(id) || !mountedRef.current) return
        if (!image.naturalWidth || !image.naturalHeight) {
          throw new Error('The selected image has invalid dimensions.')
        }

        const asset: LocalImageAsset = {
          id,
          fileName: file.name,
          sizeBytes: file.size,
          src: previewUrl,
          width: image.naturalWidth,
          height: image.naturalHeight,
        }
        assetsRef.current.set(id, asset)
        updateTask(id, (task) => ({
          ...task,
          status: 'queued',
          attempts: 1,
        }))
        queueRef.current.push({ id, file, asset, attempt: 1 })
        pumpRef.current()
      } catch {
        if (canceledIdsRef.current.delete(id) || !mountedRef.current) return
        releasePreview(previewUrl)
        filesRef.current.delete(id)
        updateTask(id, (task) => ({
          ...task,
          status: 'failed',
          error: 'Could not open this image. Please choose another file.',
          canRetry: false,
        }))
      }
    },
    [releasePreview, updateTask],
  )

  const addFiles = useCallback(
    (selectedFiles: FileList | File[]) => {
      Array.from(selectedFiles).forEach((file) => {
        void prepareFile(file)
      })
    },
    [prepareFile],
  )

  const cancelTask = useCallback(
    (taskId: string) => {
      const task = tasksRef.current.find((item) => item.id === taskId)
      if (
        !task ||
        !['validating', 'queued', 'uploading'].includes(task.status)
      ) {
        return
      }

      if (task.status === 'validating') {
        canceledIdsRef.current.add(taskId)
      }
      queueRef.current = queueRef.current.filter(
        (upload) => upload.id !== taskId,
      )
      controllersRef.current.get(taskId)?.abort()
      releasePreview(task.previewUrl)
      filesRef.current.delete(taskId)
      assetsRef.current.delete(taskId)
      updateTask(taskId, (currentTask) => ({
        ...currentTask,
        status: 'canceled',
        canRetry: false,
      }))
    },
    [releasePreview, updateTask],
  )

  const retryTask = useCallback(
    (taskId: string) => {
      const task = tasksRef.current.find((item) => item.id === taskId)
      const file = filesRef.current.get(taskId)
      const asset = assetsRef.current.get(taskId)
      if (!task || task.status !== 'failed' || !task.canRetry || !file || !asset) {
        return
      }

      updateTask(taskId, (currentTask) => ({
        ...currentTask,
        status: 'queued',
        progress: 0,
        attempts: currentTask.attempts + 1,
        error: undefined,
      }))
      queueRef.current.push({
        id: taskId,
        file,
        asset,
        attempt: task.attempts + 1,
      })
      pumpRef.current()
    },
    [updateTask],
  )

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      controllersRef.current.forEach((controller) => controller.abort())
      controllersRef.current.clear()
      objectUrlsRef.current.forEach((src) => URL.revokeObjectURL(src))
      objectUrlsRef.current.clear()
      filesRef.current.clear()
      assetsRef.current.clear()
      queueRef.current = []
    }
  }, [])

  return {
    tasks,
    addFiles,
    cancelTask,
    retryTask,
    maxConcurrentUploads: MAX_CONCURRENT_UPLOADS,
  }
}
