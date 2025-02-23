import { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { getForm, saveQuestion } from '@/lib/store';
import { QuestionCard } from './QuestionCard';

import { Question } from '@/lib/types';

export const FormBuilder = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      const form = await getForm();
      setQuestions(form.questions);
    };
    loadForm();
  }, []);

  const handleAddQuestion = useCallback(async () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      title: '',
      type: 'text',
      required: false,
      hidden: false,
    };

    try {
      setIsLoading(true);
      await saveQuestion(newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
      toast.info('A new question has been added to your form');
    } catch {
      toast.error('Failed to add question');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateQuestion = useCallback((updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q,
      ),
    );
  }, []);

  const filterQuestion = useCallback((id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Builder</h1>
        <Button
          onClick={handleAddQuestion}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Question
        </Button>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onUpdate={handleUpdateQuestion}
            onDelete={filterQuestion}
          />
        ))}
      </div>
    </div>
  );
};
