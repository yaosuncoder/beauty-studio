
import { useCallback, useEffect, useRef, useState } from "react";
import type { LocalImageAsset } from "../../../types/files";

export function useFiles() {
  const [files, setFiles] = useState<LocalImageAsset[]>([]);
  const filesRef = useRef(new Set<string>());

  const addFile = useCallback((asset: LocalImageAsset) => {
    filesRef.current.add(asset.src);
    setFiles((current) => [...current, asset]);
  }, []);

  const removeFile = useCallback(
    (fileId: string, isInUse: (fileId: string) => boolean) => {
      if (isInUse(fileId)) return;

      const file = files.find((item) => item.id === fileId);
      if (!file) return;

      URL.revokeObjectURL(file.src);
      filesRef.current.delete(file.src);
      setFiles((current) =>
        current.filter((item) => item.id !== fileId),
      );
    },
    [files],
  );

  useEffect(() => {
    return () => {
      filesRef.current.forEach((src) => URL.revokeObjectURL(src));
      filesRef.current.clear();
    };
  }, []);

  return { files, addFile, removeFile };
}
