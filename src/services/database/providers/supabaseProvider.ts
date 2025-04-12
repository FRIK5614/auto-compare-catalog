
import { DatabaseProvider } from "../DatabaseProvider";
import { supabaseProvider as provider } from "./supabase";

// Re-export the supabaseProvider from the new modular structure
export const supabaseProvider: DatabaseProvider = provider;
