export const formatDateTimeLocal = (date: Date) => {
  const timezoneOffsetInMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffsetInMs)
    .toISOString()
    .slice(0, 16);
};
