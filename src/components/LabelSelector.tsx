import { Select } from '@headlessui/react'

interface ExampleProps {
  value: string;
  onChange: (value: string) => void;
}

function LabelSelector({ value, onChange }: ExampleProps) {
    return (
        <div>
            <Select
                name="status"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-label="Label"
                className="absolute bottom-[2%] right-[2%] rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
            >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="delayed">Delayed</option>
                <option value="canceled">Canceled</option>
            </Select>
        </div>
    )
}

export default LabelSelector;
