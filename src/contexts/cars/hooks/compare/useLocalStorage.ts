
import { useEffect } from "react";
import { saveCompareToLocalStorage } from "../../utils";

export const useLocalStorage = (
  compareCars: string[],
) => {
  // Save to localStorage whenever compareCars changes
  useEffect(() => {
    try {
      saveCompareToLocalStorage(compareCars);
    } catch (error) {
      console.error("Error saving comparison list to localStorage:", error);
    }
  }, [compareCars]);
};
