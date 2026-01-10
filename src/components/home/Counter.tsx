interface CounterProps {
    count: number
}

function Counter({count}: CounterProps) {
    return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-gray-600">
            <p className="text-sm font-bold">{count}</p>
        </div>
    )
}

export default Counter;