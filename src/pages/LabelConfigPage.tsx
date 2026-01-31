import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY_LABEL_OPTIONS } from "../hooks/useLabels";
import EditableListItem from "../components/common/EditableListItem";
import type { Label } from "../types/labels";

const PREDEFINED_COLORS = [
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#10b981", // Emerald
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
    "#6366f1", // Indigo
    "#a855f7", // Purple
    "#ec4899", // Pink
];

const ColorPicker = ({ selectedColor, onSelect }: { selectedColor: string, onSelect: (c: string) => void }) => (
    <div className="flex gap-2 flex-wrap mt-2">
        {PREDEFINED_COLORS.map((color) => (
            <button
                key={color}
                onClick={() => onSelect(color)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColor === color
                        ? "border-white scale-110"
                        : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                title={color}
                type="button"
            />
        ))}
    </div>
);

function LabelConfigPage() {
    const [labels, setLabels] = useLocalStorage<Label[]>(LOCAL_STORAGE_KEY_LABEL_OPTIONS, []);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>("");
    const [editColor, setEditColor] = useState<string>(PREDEFINED_COLORS[0]);
    const [newLabelName, setNewLabelName] = useState<string>("");
    const [newLabelColor, setNewLabelColor] = useState<string>(PREDEFINED_COLORS[0]);

    const handleAddLabel = () => {
        if (!newLabelName.trim()) return;

        const newLabel: Label = {
            id: crypto.randomUUID(),
            name: newLabelName.trim(),
            color: newLabelColor
        };

        setLabels([...labels, newLabel]);
        setNewLabelName("");
        setNewLabelColor(PREDEFINED_COLORS[0]);
    };

    const handleDeleteLabel = (id: string) => {
        if (window.confirm("Are you sure you want to delete this label?")) {
            setLabels(labels.filter((l) => l.id !== id));
        }
    };

    const handleStartEdit = (id: string, currentName: string, currentColor: string) => {
        setEditingId(id);
        setEditName(currentName);
        setEditColor(currentColor || PREDEFINED_COLORS[0]);
    };

    const handleSaveEdit = (id: string) => {
        if (!editName.trim()) {
            alert("Label name cannot be empty");
            return;
        }

        setLabels(labels.map((l) => (
            l.id === id
                ? { ...l, name: editName.trim(), color: editColor }
                : l
        )));
        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName("");
        setEditColor(PREDEFINED_COLORS[0]);
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full text-white">
            <h2 className="text-xl font-bold">Label Configuration</h2>

            <div className="flex flex-col w-full max-w-md bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
                <span className="text-sm text-gray-400 mb-2">Create New Label</span>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        placeholder="Label name..."
                        className="flex-1 bg-neutral-900 border border-neutral-600 rounded px-3 py-2 focus:outline-none focus:border-sky-500 transition-colors"
                        onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
                    />
                    <button
                        onClick={handleAddLabel}
                        disabled={!newLabelName.trim()}
                        className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded font-medium transition-colors"
                    >
                        Add
                    </button>
                </div>
                <ColorPicker selectedColor={newLabelColor} onSelect={setNewLabelColor} />
            </div>

            <ul className="w-full max-w-md space-y-2">
                {labels.length === 0 && (
                    <li className="text-center text-white/50 p-4">No labels defined.</li>
                )}

                {labels.map((label) => {
                    const isEditing = editingId === label.id;

                    return (
                        <EditableListItem
                            key={label.id}
                            isEditing={isEditing}
                            onEdit={() => handleStartEdit(label.id, label.name, label.color)}
                            onDelete={() => handleDeleteLabel(label.id)}
                            onSave={() => handleSaveEdit(label.id)}
                            onCancel={handleCancelEdit}
                        >
                            {isEditing ? (
                                <div className="flex flex-col w-full">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-2 py-1 text-sm bg-neutral-900 rounded border border-sky-500 focus:outline-none"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSaveEdit(label.id);
                                            if (e.key === "Escape") handleCancelEdit();
                                        }}
                                    />
                                    <ColorPicker selectedColor={editColor} onSelect={setEditColor} />
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full shadow-sm"
                                        style={{ backgroundColor: label.color || PREDEFINED_COLORS[0] }}
                                    />
                                    <span className="font-bold text-lg">
                                        {label.name}
                                    </span>
                                </div>
                            )}
                        </EditableListItem>
                    );
                })}
            </ul>
        </div>
    );
}

export default LabelConfigPage;
