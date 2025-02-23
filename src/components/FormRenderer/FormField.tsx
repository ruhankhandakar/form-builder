import { Question } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormFieldProps {
  question: Question;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const FormField = ({
  question,
  value,
  error,
  onChange,
}: FormFieldProps) => {
  const renderField = () => {
    switch (question.type) {
      case 'select':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={question.minValue}
            max={question.maxValue}
          />
        );

      default:
        return (
          <Input
            type={question.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-baseline gap-2">
        <span>{question.title}</span>
        {question.required && <span className="text-red-500">*</span>}
        {question.helperText && (
          <span className="text-sm text-muted-foreground">
            ({question.helperText})
          </span>
        )}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
