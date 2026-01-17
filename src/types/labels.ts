export interface Label {
    id: string;
    name: string;
}

export const LABEL_ACTIONS = {
    ADD_NEW: 'ACTION_ADD_NEW',
    DELETE_CURRENT: 'ACTION_DELETE_CURRENT',
} as const;
