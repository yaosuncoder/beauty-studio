
import { Trash2 } from "lucide-react";
import type { EditorLayer } from "../../../types/editor";

type PropertiesPanelProps = {
  selectedLayer: EditorLayer | undefined;
  onChange: (layer: EditorLayer) => void;
  onDelete: (layerId: string) => void;
};

export default function PropertiesPanel({
  selectedLayer,
  onChange,
  onDelete,
}: PropertiesPanelProps) {
  if (!selectedLayer) {
    return (
      <section className="space-y-4 p-4">
        <h2 className="text-sm font-semibold">Properties</h2>
        <p className="text-sm text-slate-500">
          Select a layer to edit its properties.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 p-4">
      <h2 className="text-sm font-semibold">Properties</h2>

      <p className="text-sm text-slate-500">
        Selected: {selectedLayer.type === "text" ? "Text" : "Image"}
      </p>

      <label className="block text-sm">
        X position
        <input
          type="number"
          value={Math.round(selectedLayer.x)}
          onChange={(event) =>
            onChange({
              ...selectedLayer,
              x: Number(event.target.value),
            })
          }
          className="mt-1 w-full rounded-lg border border-slate-200 p-2"
        />
      </label>

      <label className="block text-sm">
        Y position
        <input
          type="number"
          value={Math.round(selectedLayer.y)}
          onChange={(event) =>
            onChange({
              ...selectedLayer,
              y: Number(event.target.value),
            })
          }
          className="mt-1 w-full rounded-lg border border-slate-200 p-2"
        />
      </label>

      <label className="block text-sm">
        Opacity · {Math.round(selectedLayer.opacity * 100)}%
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(selectedLayer.opacity * 100)}
          onChange={(event) =>
            onChange({
              ...selectedLayer,
              opacity: Number(event.target.value) / 100,
            })
          }
          className="mt-2 w-full accent-blue-600"
        />
      </label>

      {selectedLayer.type === "text" && (
        <label className="block text-sm">
          Text content
          <input
            value={selectedLayer.text}
            onChange={(event) =>
              onChange({
                ...selectedLayer,
                text: event.target.value,
              })
            }
            className="mt-1 w-full rounded-lg border border-slate-200 p-2"
          />
        </label>
      )}

      {selectedLayer.type === "image" && (
        <>
          <label className="block text-sm">
            Width
            <input
              type="number"
              min="20"
              value={Math.round(selectedLayer.width)}
              onChange={(event) =>
                onChange({
                  ...selectedLayer,
                  width: Math.max(20, Number(event.target.value)),
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 p-2"
            />
          </label>
          <label className="block text-sm">
            Height
            <input
              type="number"
              min="20"
              value={Math.round(selectedLayer.height)}
              onChange={(event) =>
                onChange({
                  ...selectedLayer,
                  height: Math.max(20, Number(event.target.value)),
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 p-2"
            />
          </label>
        </>
      )}

      <button
        type="button"
        onClick={() => onDelete(selectedLayer.id)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 size={16} />
        Delete {selectedLayer.type}
      </button>
    </section>
  );
}
