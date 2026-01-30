import {useState} from "react";
import {useTimerSettings} from "../hooks/useTimerSettings";
import EditableListItem from "../components/common/EditableListItem";

function TimerConfigPage() {
    const {
        availableOptions,
        addCustomOption,
        removeOption
    } = useTimerSettings();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [newTime, setNewTime] = useState<string>("");

    const handleAddTimer = () => {
        const minutes = parseInt(newTime, 10);

        if (isNaN(minutes) || minutes <= 0) {
            alert("Please enter a valid positive number for minutes.");
            return;
        }

        addCustomOption(minutes);
        setNewTime("");
    };

    const handleDeleteTimer = (id: number) => {
        if (availableOptions.length <= 1) {
            alert("You must have at least one timer option.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this timer option?")) {
            removeOption(id);
        }
    };

    const handleStartEdit = (id: number, currentValue: number) => {
        setEditingId(id);
        setEditValue(currentValue.toString());
    };

    const handleSaveEdit = (id: number) => {
        const minutes = parseInt(editValue, 10);

        if (isNaN(minutes) || minutes <= 0) {
            alert("Please enter a valid positive number.");
            return;
        }

        // Since the hook doesn't expose a direct 'update' method,
        // we simulate an edit by removing the old one and adding the new one.
        // Note: This generates a new ID.
        removeOption(id);
        addCustomOption(minutes);

        handleCancelEdit();
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full text-white">
            <h2 className="text-xl font-bold">Timer Configuration</h2>

            <div className="flex gap-2 w-full max-w-md">
                <input
                    type="number"
                    min="1"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="Enter minutes (e.g. 25)..."
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTimer()}
                />
                <button onClick={handleAddTimer}>
                    Add Timer
                </button>
            </div>

            <ul className="w-full max-w-md space-y-2">
                {availableOptions.map((option) => {
                    const isEditing = editingId === option.id;

                    return (
                        <EditableListItem
                            key={option.id}
                            isEditing={isEditing}
                            onEdit={() => handleStartEdit(option.id, option.value)}
                            onDelete={() => handleDeleteTimer(option.id)}
                            onSave={() => handleSaveEdit(option.id)}
                            onCancel={handleCancelEdit}
                        >
                            {isEditing ? (
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="number"
                                        min="1"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full px-2 py-1 text-sm text-white bg-transparent rounded border border-white/30 focus:border-white focus:outline-none"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSaveEdit(option.id);
                                            if (e.key === "Escape") handleCancelEdit();
                                        }}
                                    />
                                    <span className="text-xs text-white/50">min</span>
                                </div>
                            ) : (
                                <span className="font-bold text-lg text-white">
                                    {option.value} Min
                                </span>
                            )}
                        </EditableListItem>
                    );
                })}
            </ul>
        </div>
    );
}

export default TimerConfigPage;
