
import { setupCarImagesBucket } from '@/services/storage/setupBucket';

// Initialize Supabase resources
export const initializeSupabase = async () => {
  try {
    // Setup storage buckets
    await setupCarImagesBucket();
    
    console.log("Supabase initialization completed");
  } catch (error) {
    console.error("Error initializing Supabase:", error);
  }
};
