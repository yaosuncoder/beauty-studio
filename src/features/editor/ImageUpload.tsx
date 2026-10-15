
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import type { LocalImageAsset } from "../../types/files";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

type ImageUploadProps = {
  onUpload: (asset: LocalImageAsset) => void;
};

export default function ImageUpload({
  onUpload,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError(undefined);

    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Choose a PNG, JPEG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 10 MB or smaller.");
      return;
    }

    const src = URL.createObjectURL(file);
    setIsLoading(true);

    try {
      const image = new window.Image();
      image.src = src;
      await image.decode();

      if (!image.naturalWidth || !image.naturalHeight) {
        throw new Error("Invalid image dimensions.");
      }

      onUpload({
        id: crypto.randomUUID(),
        fileName: file.name,
        sizeBytes: file.size,
        src,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    } catch {
      URL.revokeObjectURL(src);
      setError("Could not open this image. Please try another.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Choose an image to upload"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-slate-100 disabled:opacity-60"
      >
        <ImagePlus size={18} />
        {isLoading ? "Loading image…" : "Upload"}
      </button>

      {error && (
        <p role="alert" className="mt-2 px-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
