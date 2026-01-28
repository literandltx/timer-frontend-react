import HistoryList from "../components/history/HistoryList.tsx";
import HistoryChart from "../components/history/HistoryChart.tsx";
import {useTimerHistory} from "../hooks/useTimerHistory";
import {useLabels} from "../hooks/useLabels.ts";

function HistoryPage() {
    const {
        history,
        clearHistory,
        clearToday,
        removeEntry,
        updateEntry,
        addManualEntry,
    } = useTimerHistory();
    const {labels} = useLabels();

    return (
        <div>
            <h1 className="text-2xl font-bold text-center mt-8 mb-0">History Chart</h1>
            <div className="flex flex-col gap-2">
                <HistoryChart data={history}/>
                <HistoryList
                    history={history}
                    availableLabels={labels}
                    onClearAll={clearHistory}
                    onClearToday={clearToday}
                    onAddEntry={addManualEntry}
                    onDeleteEntry={removeEntry}
                    onEditEntry={updateEntry}
                />
            </div>
        </div>
    );
}

export default HistoryPage;

