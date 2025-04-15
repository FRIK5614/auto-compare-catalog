
import { useState } from "react";
import { Car } from "@/types/car";
import { useCars } from "@/contexts/cars/CarsProvider";
import { useToast } from "@/hooks/use-toast";
import { transformVehicleForSupabase } from "@/services/api/transformers";
import { supabase } from "@/integrations/supabase/client";

export const useCarSave = () => {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { updateCar, addCar, deleteCar: deleteCarFromDb, reloadCars } = useCars();
  const { toast } = useToast();

  const saveCar = async (car: Car, isNewCar: boolean) => {
    setSaving(true);
    console.log(`Saving car with ${isNewCar ? 'CREATE' : 'UPDATE'} operation:`, car);
    
    try {
      // Make sure we're working with a proper Car object
      const carToSave: Car = {
        ...car,
        // Make sure imageUrl is consistent
        image_url: car.image_url || (car.images && car.images.length > 0 ? car.images[0].url : ''),
      };

      // Make sure images is properly formatted
      if (carToSave.images && carToSave.images.length > 0) {
        // Ensure all images have the correct format
        carToSave.images = carToSave.images.map(img => ({
          id: img.id || crypto.randomUUID(),
          url: typeof img.url === 'string' ? img.url : '',
          alt: img.alt || ''
        }));
      }
      
      // Directly use Supabase for more reliable results
      const vehicle = transformVehicleForSupabase(carToSave);
      console.log("Transformed vehicle for Supabase:", vehicle);
      
      let result;
      
      if (isNewCar) {
        console.log("Directly inserting new car with ID:", vehicle.id);
        const { data, error } = await supabase
          .from('vehicles')
          .insert(vehicle);
          
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        console.log("Insert result:", data);
        result = carToSave;
      } else {
        console.log("Directly updating car with ID:", vehicle.id);
        const { data, error } = await supabase
          .from('vehicles')
          .update(vehicle)
          .eq('id', carToSave.id);
          
        if (error) {
          console.error("Supabase update error:", error);
          throw error;
        }
        console.log("Update result:", data);
        result = carToSave;
      }
      
      if (!result) {
        console.error("No result returned from car save operation");
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось сохранить автомобиль - пустой результат операции",
        });
        return { success: false, message: "Не удалось сохранить автомобиль - пустой результат операции" };
      }
      
      // Force reload cars immediately
      await reloadCars();
      
      // Dispatch reload-cars event as a backup
      try {
        if (typeof window !== 'undefined') {
          console.log("Triggering cars reload after save");
          window.dispatchEvent(new CustomEvent('reload-cars'));
        }
      } catch (e) {
        console.error("Failed to trigger cars reload:", e);
      }
      
      return { success: true, car: result };
    } catch (error) {
      console.error("Error saving car:", error);
      const errorMessage = error instanceof Error ? error.message : "Произошла ошибка при сохранении";
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
      });
      
      return { success: false, message: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  const deleteCar = async (carId: string) => {
    setDeleting(true);
    try {
      console.log("Deleting car with ID:", carId);
      
      // Directly use Supabase for reliability
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', carId);
        
      if (error) {
        console.error("Error deleting car from Supabase:", error);
        throw error;
      }
      
      // Force reload cars immediately
      await reloadCars();
      
      // Dispatch reload-cars event as a backup
      try {
        if (typeof window !== 'undefined') {
          console.log("Triggering cars reload after delete");
          window.dispatchEvent(new CustomEvent('reload-cars'));
        }
      } catch (e) {
        console.error("Failed to trigger cars reload:", e);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting car:", error);
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при удалении",
      });
      
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { saveCar, deleteCar, isSaving: saving, isDeleting: deleting };
};
