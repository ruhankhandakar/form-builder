import { Question } from './types';
import { validateEmail, validatePhoneNumber } from './utils';

export const validateFormData = (
  questions: Question[],
  formData: Record<string, string>,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const question of questions) {
    if (question.hidden) continue;

    const value = formData[question.id] || '';

    if (question.required && !value) {
      errors[question.id] = 'This field is required';
      continue;
    }

    if (!value) continue;

    switch (question.type) {
      case 'email':
        if (!validateEmail(value)) {
          errors[question.id] = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!validatePhoneNumber(value)) {
          errors[question.id] = 'Please enter a valid phone number';
        }
        break;

      case 'number': {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors[question.id] = 'Please enter a valid number';
        } else {
          if (question.minValue !== undefined && numValue < question.minValue) {
            errors[question.id] = `Value must be at least ${question.minValue}`;
          }
          if (question.maxValue !== undefined && numValue > question.maxValue) {
            errors[question.id] = `Value must be at most ${question.maxValue}`;
          }
        }
        break;
      }
    }
  }

  return errors;
};
