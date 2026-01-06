import {Select} from '@headlessui/react'

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
                className="absolute bottom-[2%] right-[4%] rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt} className="text-black">
                        {opt}
                    </option>
                ))}

                <option disabled>──────────</option>

                <option value="ADD_NEW" className="text-blue-600 font-bold">
                    + Create New Label
                </option>
            </Select>
        </div>
    )
}

export default LabelSelector;
