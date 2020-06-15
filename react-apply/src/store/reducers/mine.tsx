import { AnyAction } from 'redux';
import { MineState } from '@/typings/state';
export const initialState: MineState =  {
    
}

export default function(state: MineState = initialState, action: AnyAction) : MineState {
    return state;
}