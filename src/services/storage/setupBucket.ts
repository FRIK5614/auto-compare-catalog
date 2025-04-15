
import { supabase } from '@/integrations/supabase/client';

export const setupCarImagesBucket = async (): Promise<boolean> => {
  try {
    console.log("Checking if car-images bucket exists...");
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === 'car-images');
    
    if (bucketExists) {
      console.log("car-images bucket already exists");
      
      // Make sure the bucket is public
      try {
        await supabase.storage.updateBucket('car-images', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        console.log("Updated car-images bucket to ensure it's public");
      } catch (updateError) {
        console.error("Error updating bucket:", updateError);
        // Continue even if update fails, the bucket exists
      }
      
      return true;
    }
    
    // Create bucket if it doesn't exist
    console.log("Creating car-images bucket...");
    
    const { data, error } = await supabase.storage.createBucket('car-images', {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (error) {
      console.error("Error creating car-images bucket:", error);
      return false;
    }
    
    console.log("car-images bucket created successfully:", data);
    return true;
    
  } catch (error) {
    console.error("Error setting up car-images bucket:", error);
    return false;
  }
};
