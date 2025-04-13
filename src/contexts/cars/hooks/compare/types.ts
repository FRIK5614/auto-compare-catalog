
import { Dispatch, SetStateAction } from 'react';

export interface CompareState {
  compareCars: string[];
  setCompareCars: Dispatch<SetStateAction<string[]>>;
  loading: boolean;
  isOnline: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface CompareActions {
  addToCompare: (carId: string) => Promise<boolean> | boolean;
  removeFromCompare: (carId: string) => Promise<boolean> | boolean;
  clearCompare: () => Promise<boolean> | boolean;
  isInCompare: (carId: string) => boolean;
}

export type UseCompareReturn = CompareState & CompareActions;
