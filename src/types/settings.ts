export interface TimerOption {
  id: number;
  value: number;
  label: string;
}

export interface UserSettings {
  lastUpdated: number;
  preference: TimerOption;
}

export const TIMER_OPTIONS: TimerOption[] = [
  { id: 1, value: 20, label: '20 Min' },
  { id: 2, value: 40, label: '40 Min' },
  { id: 3, value: 60, label: '60 Min' },
  { id: 4, value: 90, label: '90 Min' },
];