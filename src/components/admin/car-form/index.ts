
import CarFormBasicInfo from './CarFormBasicInfo';
import CarFormImage from './CarFormImage';
import CarFormTechnical from './CarFormTechnical';
import CarFormEngine from './CarFormEngine';
import CarFormTransmission from './CarFormTransmission';
import CarForm from './CarForm';
import CarFormContainer from './CarFormContainer';
import CarUrlFetcher from './CarUrlFetcher';
import CarDeleteDialog from './CarDeleteDialog';

// New hooks and utilities
import { useCarFormData } from './hooks/useCarFormData';
import { useImageHandling } from './hooks/useImageHandling';
import { useCarSave } from './hooks/useCarSave';
import { useExternalCarData } from './hooks/useExternalCarData';
import { createCarFromImportData } from './utils/carUrlFetcher';

export {
  CarFormBasicInfo,
  CarFormImage,
  CarFormTechnical,
  CarFormEngine,
  CarFormTransmission,
  CarForm,
  CarFormContainer,
  CarUrlFetcher,
  CarDeleteDialog,
  // Export hooks and utilities
  useCarFormData,
  useImageHandling,
  useCarSave,
  useExternalCarData,
  createCarFromImportData
};
