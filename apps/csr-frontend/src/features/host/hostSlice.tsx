import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface HostState {
    targetName: string;
    targetId: number;
    currentAction: string;
    hostModal: string;
}

const initialState = {
    targetName: '',
    targetId: 0,
    currentAction: '',
    hostModal: ''
}

const hostSlice = createSlice({
    name: 'host',
    initialState,
    reducers: {
        clearHost: () => {
            return initialState
        },
        clearTarget: (state) => {
            state.targetId = 0;
            state.targetName = ''
        },
        setTarget: (state, action) => {
            const { targetId, targetName } = action.payload;
            state.targetId = targetId
            state.targetName = targetName
        },
        setHostModal: (state, action) => {
            state.hostModal = action.payload
        }
    }
})

// actions
export const { clearHost, clearTarget, setTarget, setHostModal } = hostSlice.actions;

// selectors
export const selectHostModal = (state: RootState) => state.host.hostModal;
export const selectTargetName = (state: RootState) => state.host.targetName;
export const selectTargetId = (state: RootState) => state.host.targetId;
export const selectCurrentAction = (state: RootState) => state.host.currentAction;

export default hostSlice.reducer;