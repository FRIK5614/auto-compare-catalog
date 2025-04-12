
export type CompareState = {
  compareCars: string[];
  loading: boolean;
  isOnline: boolean;
  setCompareCars: (compareCars: string[]) => void;
  setLoading: (loading: boolean) => void;
};

export type CompareActions = {
  addToCompare: (carId: string) => Promise<boolean> | boolean;
  removeFromCompare: (carId: string) => Promise<boolean> | boolean;
  clearCompare: () => Promise<boolean> | boolean;
  isInCompare: (carId: string) => boolean;
};

export type UseCompareReturn = CompareState & CompareActions;
