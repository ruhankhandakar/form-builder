import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { Form } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { FormField } from './FormField';

import { validateFormData } from '@/lib/validation';

interface FormRendererProps {
  form: Form;
  onSubmit?: (data: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

export const FormRenderer = ({
  form,
  onSubmit,
  initialValues = {},
}: FormRendererProps) => {
  const [formData, setFormData] =
    useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = useCallback((questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: '' }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateFormData(form.questions, formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Please check the form for errors');
        return;
      }

      if (onSubmit) {
        onSubmit(formData);
      }

      toast.success('Form submitted successfully');
    },
    [form.questions, formData, onSubmit],
  );

  const visibleQuestions = form.questions.filter((q) => !q.hidden);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{form.title}</h1>

      {visibleQuestions.map((question) => (
        <FormField
          key={question.id}
          question={question}
          value={formData[question.id] || ''}
          error={errors[question.id]}
          onChange={(value) => handleFieldChange(question.id, value)}
        />
      ))}

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};
