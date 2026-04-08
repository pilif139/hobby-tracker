export type DateFilterError =
  | 'invalid-format'
  | 'before-min-date'
  | 'after-max-date';

interface ParseDateFilterOptions {
  minDate?: Date;
  maxDate?: Date;
}

interface ParseDateFilterResult {
  date: Date | null;
  error: DateFilterError | null;
}

export const parseDateFilter = (
  dateString?: string,
  options?: ParseDateFilterOptions,
): ParseDateFilterResult => {
  if (!dateString) {
    return {
      date: null,
      error: null,
    };
  }

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return {
      date: null,
      error: 'invalid-format',
    };
  }

  if (options?.minDate && parsedDate.getTime() < options.minDate.getTime()) {
    return {
      date: null,
      error: 'before-min-date',
    };
  }

  if (options?.maxDate && parsedDate.getTime() > options.maxDate.getTime()) {
    return {
      date: null,
      error: 'after-max-date',
    };
  }

  return {
    date: parsedDate,
    error: null,
  };
};

export const FILTER_MIN_DATE = new Date('2000-01-01T00:00:00.000Z');

export const getDateErrorMessage = (
  fieldName: 'from' | 'to',
  error: 'invalid-format' | 'before-min-date' | 'after-max-date',
) => {
  if (error === 'invalid-format') {
    return `Invalid ${fieldName} date format`;
  }

  if (error === 'before-min-date') {
    return `${fieldName} must be on or after ${FILTER_MIN_DATE.toISOString()}`;
  }

  return `${fieldName} cannot be in the future`;
};
