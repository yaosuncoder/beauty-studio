
import type { EditorLayer } from "../../types/editor";

export function updateLayer(
  layers: EditorLayer[],
  updatedLayer: EditorLayer,
): EditorLayer[] {
  return layers.map((layer) =>
    layer.id === updatedLayer.id ? updatedLayer : layer,
  );
}
