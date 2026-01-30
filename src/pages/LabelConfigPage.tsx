import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY_LABEL_OPTIONS } from "../hooks/useLabels";
import type { Label } from "../types/labels";

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

        setLabels(labels.map((l) => (l.id === id ? { ...l, name: editName.trim() } : l)));
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
                        <li
                            key={label.id}
                            className="flex justify-between items-center border transition-colors duration-200 border-neutral-700 px-1 py-1 rounded bg-neutral-800 hover:bg-sky-900/30 group"
                        >
                            <div className="flex flex-col pl-2 flex-grow">
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
                            </div>

                            <div className="flex items-center gap-1 ml-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => handleSaveEdit(label.id)}
                                            className="text-green-500 hover:bg-white/10 p-1 rounded"
                                            title="Save"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-red-400 hover:bg-white/10 p-1 rounded"
                                            title="Cancel"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleStartEdit(label.id, label.name)}
                                            className="text-neutral-500 hover:text-sky-400 transition-colors p-1 rounded hover:bg-white/10"
                                            title="Edit label"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleDeleteLabel(label.id)}
                                            className="text-neutral-500 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/10"
                                            title="Delete label"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default LabelConfigPage;
