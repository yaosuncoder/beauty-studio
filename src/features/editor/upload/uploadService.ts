type UploadOptions = {
  signal: AbortSignal
  onProgress: (progress: number) => void
  attempt: number
}

const UPLOAD_STEPS = 12
const STEP_DURATION_MS = 100

function waitForStep(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Upload canceled.', 'AbortError'))
      return
    }

    const timeout = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort)
      resolve()
    }, STEP_DURATION_MS)

    function handleAbort() {
      window.clearTimeout(timeout)
      signal.removeEventListener('abort', handleAbort)
      reject(new DOMException('Upload canceled.', 'AbortError'))
    }

    signal.addEventListener('abort', handleAbort, { once: true })
  })
}

export async function uploadFile(
  file: File,
  { signal, onProgress, attempt }: UploadOptions,
): Promise<void> {
  const shouldSimulateFailure =
    file.name.toLowerCase().includes('[fail]') && attempt === 1
  const failureStep = Math.floor(UPLOAD_STEPS / 2)

  for (let step = 1; step <= UPLOAD_STEPS; step += 1) {
    await waitForStep(signal)

    if (shouldSimulateFailure && step === failureStep) {
      throw new Error('Simulated upload failure. Retry this task to try again.')
    }

    onProgress(Math.round((step / UPLOAD_STEPS) * 100))
  }
}
