
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
  ...favoriteProvider
};
