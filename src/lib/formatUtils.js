export const formatTimeLabel = (index) => {
  const hour12 = index % 12 || 12;
  const ampm = index < 12 ? 'AM' : 'PM';
  return `${hour12}:00 ${ampm}`;
};
