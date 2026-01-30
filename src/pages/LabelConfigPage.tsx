import {useState} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {LOCAL_STORAGE_KEY_LABEL_OPTIONS} from "../hooks/useLabels";
import EditableListItem from "../components/common/EditableListItem";
import type {Label} from "../types/labels";

function LabelConfigPage() {
    const [labels, setLabels] = useLocalStorage<Label[]>(LOCAL_STORAGE_KEY_LABEL_OPTIONS, []);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>("");
    const [newLabelName, setNewLabelName] = useState<string>("");

    const handleAddLabel = () => {
        if (!newLabelName.trim()) return;

        const newLabel: Label = {
            id: crypto.randomUUID(),
            name: newLabelName.trim()
        };

        setLabels([...labels, newLabel]);
        setNewLabelName("");
    };

    const handleDeleteLabel = (id: string) => {
        if (window.confirm("Are you sure you want to delete this label?")) {
            setLabels(labels.filter((l) => l.id !== id));
        }
    };

    const handleStartEdit = (id: string, currentName: string) => {
        setEditingId(id);
        setEditName(currentName);
    };

    const handleSaveEdit = (id: string) => {
        if (!editName.trim()) {
            alert("Label name cannot be empty");
            return;
        }

        setLabels(labels.map((l) => (l.id === id ? {...l, name: editName.trim()} : l)));
        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName("");
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full text-white">
            <h2 className="text-xl font-bold">Label Configuration</h2>

            <div className="flex gap-2 w-full max-w-md">
                <input
                    type="text"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="Enter new label name..."
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
                />
                <button onClick={handleAddLabel}>
                    Add Label
                </button>
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
                            onEdit={() => handleStartEdit(label.id, label.name)}
                            onDelete={() => handleDeleteLabel(label.id)}
                            onSave={() => handleSaveEdit(label.id)}
                            onCancel={handleCancelEdit}
                        >
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-2 py-1 text-sm text-white bg-transparent rounded border border-white/30 focus:border-white focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSaveEdit(label.id);
                                        if (e.key === "Escape") handleCancelEdit();
                                    }}
                                />
                            ) : (
                                <span className="font-bold text-lg text-white">
                                    {label.name}
                                </span>
                            )}
                        </EditableListItem>
                    );
                })}
            </ul>
        </div>
    );
}

export default LabelConfigPage;
