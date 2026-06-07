import { CalendarDays, Clock3 } from 'lucide-react';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatDateTimeLocal } from '@/lib/formatDateTimeLocal';

const dateTimeLocalPattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function parseDateTimeLocal(value: string) {
  const match = dateTimeLocalPattern.exec(value);

  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

function mergeDateAndTime(date: Date, timeValue: string) {
  const [hoursString = '0', minutesString = '0'] = timeValue.split(':');
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  const nextDate = new Date(date);

  nextDate.setHours(
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0,
  );

  return nextDate;
}

interface DateTimePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  ariaInvalid?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function DateTimePicker({
  id,
  value,
  onChange,
  onBlur,
  ariaInvalid,
  placeholder = 'Pick a date and time',
  disabled,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = parseDateTimeLocal(value);
  const displayValue = selectedDate
    ? format(selectedDate, 'P HH:mm', { locale: enGB })
    : placeholder;
  const timeValue = selectedDate ? format(selectedDate, 'HH:mm') : '09:00';

  const commitDate = (nextDate: Date) => {
    onChange(formatDateTimeLocal(nextDate));
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          onBlur?.();
        }
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            onBlur={onBlur}
            aria-invalid={ariaInvalid}
            className={cn(
              'h-8 w-full justify-start gap-2 px-2.5 py-1 text-left font-normal',
              !selectedDate && 'text-muted-foreground',
              className,
            )}
          />
        }
      >
        <CalendarDays className="size-4" />
        <span className="truncate">{displayValue}</span>
      </PopoverTrigger>

      <PopoverContent className="w-auto gap-3 p-3">
        <Calendar
          locale={enGB}
          mode="single"
          selected={selectedDate ?? undefined}
          onSelect={(date) => {
            if (!date) return;
            commitDate(mergeDateAndTime(date, timeValue));
          }}
        />

        <div className="space-y-2">
          <Label
            htmlFor={`${id}-time`}
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
          >
            <Clock3 className="size-3.5" />
            Time
          </Label>
          <Input
            id={`${id}-time`}
            type="time"
            value={timeValue}
            onChange={(event) => {
              const nextDate = selectedDate ?? new Date();
              commitDate(mergeDateAndTime(nextDate, event.target.value));
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };
