
import { Settings2, Trash2 } from "lucide-react";
import type { EditorLayer } from "../../types/editor";

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
      <aside className="h-full space-y-5 border-l bg-white p-5">
        <div className="flex items-center gap-2">
          <Settings2 size={18} />
          <h2 className="font-semibold">Properties</h2>
        </div>
        <p className="text-sm text-slate-500">
          Select a layer to edit its properties.
        </p>
      </aside>
    );
  }

  return (
    <aside className="h-full space-y-5 border-l bg-white p-5">
      <div className="flex items-center gap-2">
        <Settings2 size={18} />
        <h2 className="font-semibold">Properties</h2>
      </div>

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

      <button
        type="button"
        onClick={() => onDelete(selectedLayer.id)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 size={16} />
        Delete {selectedLayer.type}
      </button>
    </aside>
  );
}
