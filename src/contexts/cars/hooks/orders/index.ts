
import { useRef } from "react";
import { OrdersState, OrdersActions, UseOrdersReturn } from "./types";
import { useOrdersState } from "./useOrdersState";
import { useOrdersActions } from "./useOrdersActions";
import { useOrdersInit } from "./useOrdersInit";

export const useOrders = (): UseOrdersReturn => {
  // Get state from useOrdersState
  const state = useOrdersState();
  
  // Initialize orders
  useOrdersInit(state);
  
  // Get actions from useOrdersActions
  const actions = useOrdersActions(state);
  
  // Combine state and actions
  return {
    ...state,
    ...actions
  };
};
