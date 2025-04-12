
import { useCompareState } from "./useCompareState";
import { useCompareActions } from "./useCompareActions";
import { useLocalStorage } from "./useLocalStorage";
import { UseCompareReturn } from "./types";

export const useCompare = (): UseCompareReturn => {
  // Get state
  const state = useCompareState();
  
  // Sync with localStorage
  useLocalStorage(state.compareCars);
  
  // Get actions
  const actions = useCompareActions(state);
  
  // Combine state and actions
  return {
    ...state,
    ...actions
  };
};
