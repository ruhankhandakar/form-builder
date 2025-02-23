import { useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { ChevronUp, ChevronDown, Trash2, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import { Question, QuestionType } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { deleteQuestion, saveQuestion } from '@/lib/store';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: (id: string) => void;
}

export const QuestionCard = ({
  question,
  onUpdate,
  onDelete,
}: QuestionCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const [localQuestion, setLocalQuestion] = useState(question);
  const [isLoading, setIsLoading] = useState(false);
  const saveInProgress = useRef(false);

  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

  const debouncedSave = useCallback(
    debounce(async (updatedQuestion: Question) => {
      if (saveInProgress.current) return;

      saveInProgress.current = true;
      try {
        setIsLoading(true);
        const savedQuestion = await saveQuestion(updatedQuestion);
        onUpdate(savedQuestion);
        toast.info('Changes saved', {
          description: 'Your question has been updated',
        });
      } catch {
        toast.error('Failed to save changes');
      } finally {
        saveInProgress.current = false;
        setIsLoading(false);
      }
    }, 1000),
    [],
  );

  const handleChange = useCallback((updates: Partial<Question>) => {
    setLocalQuestion((prevQuestion) => {
      const updatedQuestion = { ...prevQuestion, ...updates };
      if (updatedQuestion.required) {
        updatedQuestion.hidden = false;
      }
      onUpdate(updatedQuestion);
      debouncedSave(updatedQuestion);
      return updatedQuestion;
    });
  }, []);

  const handleDeleteQuestion = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await deleteQuestion(id);
        onDelete(id);
        toast.success('Question deleted', {
          description: 'The question has been removed from your form',
        });
      } catch {
        toast.error('Failed to delete question');
      } finally {
        setIsLoading(false);
      }
    },
    [onDelete],
  );

  const handleAddOption = useCallback(() => {
    const newOption = `Option ${(localQuestion.options?.length || 0) + 1}`;
    handleChange({
      options: [...(localQuestion.options || []), newOption],
    });
  }, [localQuestion.options, handleChange]);

  const handleRemoveOption = useCallback(
    (indexToRemove: number) => {
      handleChange({
        options: localQuestion.options?.filter(
          (_, index) => index !== indexToRemove,
        ),
      });
    },
    [localQuestion.options, handleChange],
  );

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      const newOptions = [...(localQuestion.options || [])];
      newOptions[index] = value;
      handleChange({ options: newOptions });
    },
    [localQuestion.options, handleChange],
  );

  return (
    <Card className="p-4 mb-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-center mb-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="p-2"
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </Button>

        <div className="flex items-center gap-2">
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteQuestion(question.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Question Title</Label>
            <Input
              value={localQuestion.title}
              onChange={(e) => handleChange({ title: e.target.value })}
              placeholder="Enter your question"
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3 justify-between">
            <div className="space-y-2 flex-1 max-w-[50%]">
              <Label>Question Type</Label>
              <Select
                value={localQuestion.type}
                onValueChange={(value: QuestionType) =>
                  handleChange({ type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4 gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={localQuestion.required}
                  onCheckedChange={(checked) =>
                    handleChange({ required: checked })
                  }
                />
                <Label>Required</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={localQuestion.hidden}
                  onCheckedChange={(checked) =>
                    handleChange({ hidden: checked })
                  }
                />
                <Label>Hidden</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Helper Text</Label>
            <Input
              value={localQuestion.helperText || ''}
              onChange={(e) => handleChange({ helperText: e.target.value })}
              placeholder="Add helper text for this question"
              className="w-full"
            />
          </div>
          {localQuestion.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Value</Label>
                <Input
                  type="number"
                  value={localQuestion.minValue || ''}
                  onChange={(e) =>
                    handleChange({
                      minValue: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Minimum value"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Value</Label>
                <Input
                  type="number"
                  value={localQuestion.maxValue || ''}
                  onChange={(e) =>
                    handleChange({
                      maxValue: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Maximum value"
                />
              </div>
            </div>
          )}
          {localQuestion.type === 'select' && (
            <div className="col-span-2 space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {localQuestion.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
