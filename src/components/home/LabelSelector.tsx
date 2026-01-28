import { Select } from '@headlessui/react'
import { type Label, LABEL_ACTIONS } from "../../types/labels";

interface LabelSelectorProps {
    value: Label | undefined;
    options: Label[];
    onChange: (value: string) => void;
}

function LabelSelector({ value, onChange, options }: LabelSelectorProps) {
    return (
        <div>
            <Select
                name="status"
                value={value?.id || ''}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Label"
                className="appearance-none block w-full rounded-md bg-black/15 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
            >
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}

                <option disabled>──────────</option>

                <option value={LABEL_ACTIONS.ADD_NEW}>
                    Create new label
                </option>

                {value && (
                    <option value={LABEL_ACTIONS.DELETE_CURRENT}>
                        Delete: {value.name}
                    </option>
                )}
            </Select>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                 <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
        </div>
    )
}

export default LabelSelector;