import { useContext } from 'react';
import { EducationContext } from '../contexts/EducationContext';
import { EducationContextType } from '../types';

export const useEducation = (): EducationContextType => {
  const context = useContext(EducationContext);
  if (!context) {
    throw new Error('useEducation must be used within an EducationProvider');
  }
  return context;
};
