
import React from "react";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface CarFormLoadingStateProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const CarFormLoadingState: React.FC<CarFormLoadingStateProps> = ({
  loading,
  error,
  onRetry
}) => {
  if (loading) {
    return <LoadingState count={3} />;
  }

  if (error) {
    return (
      <ErrorState 
        message="Не удалось загрузить данные автомобиля" 
        onRetry={onRetry}
      />
    );
  }

  return null;
};

export default CarFormLoadingState;
