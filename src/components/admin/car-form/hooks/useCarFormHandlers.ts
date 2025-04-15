
import { useNavigate } from 'react-router-dom';

export interface UseCarFormHandlersResult {
  handleCancel: () => void;
}

export const useCarFormHandlers = (navigate: ReturnType<typeof useNavigate>): UseCarFormHandlersResult => {
  // Handle cancelling the form
  const handleCancel = () => {
    navigate('/admin/cars');
  };

  return {
    handleCancel
  };
};
