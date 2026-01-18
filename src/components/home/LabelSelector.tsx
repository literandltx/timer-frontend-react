import { Select } from '@headlessui/react'
import {LABEL_ACTIONS} from "../../types/labels.ts";

interface LabelSelectorProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}

function LabelSelector({value, onChange, options}: LabelSelectorProps) {
    return (
        <div>
            <Select
                name="status"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Label"
                className="rounded-md bg-black/15 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}

                <option disabled>──────────</option>

                <option value={LABEL_ACTIONS.ADD_NEW}>
                    Create new label
                </option>

                {value && (
                    <option value={LABEL_ACTIONS.DELETE_CURRENT}>
                        Delete: {value}
                    </option>
                )}
            </Select>
        </div>
    )
}

export default LabelSelector;