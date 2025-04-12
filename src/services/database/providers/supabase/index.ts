
import { DatabaseProvider } from "../../DatabaseProvider";
import { carProvider } from "./carProvider";
import { orderProvider } from "./orderProvider";
import { brandProvider } from "./brandProvider";
import { favoriteProvider } from "./favoriteProvider";

// Combine all providers into a single supabaseProvider object
export const supabaseProvider: DatabaseProvider = {
  // Cars
  ...carProvider,
  // Orders
  ...orderProvider,
  // Brands
  ...brandProvider,
  // Favorites
  ...favoriteProvider,
  
  // Add missing submitPurchaseRequest method
  submitPurchaseRequest: async (formData: Record<string, any>) => {
    try {
      // Use orderProvider's implementation
      return await orderProvider.submitPurchaseRequest(formData);
    } catch (error) {
      console.error("Error submitting purchase request:", error);
      return { 
        success: false, 
        message: "Failed to submit purchase request. Please try again." 
      };
    }
  }
};
