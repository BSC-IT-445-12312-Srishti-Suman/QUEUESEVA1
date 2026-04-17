// Utility to format date to YYYY-MM-DD in local time
export const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Utility to generate days for the horizontal picker
export const generateDays = (numDays: number) => {
  const days = [];
  for (let i = 0; i < numDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: formatDateLocal(d),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' })
    });
  }
  return days;
};

// Utility to format 24h time to 12h AM/PM
export const formatTime = (time24: string) => {
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minStr} ${ampm}`;
};

// Utility to generate time slots (09:00 to 17:00)
export const generateTimeSlots = (duration: number) => {
  const slots = [];
  let currentTime = 9 * 60; // 9:00 AM in minutes
  const endTime = 17 * 60; // 5:00 PM

  while (currentTime < endTime) {
    const hours = Math.floor(currentTime / 60);
    const mins = currentTime % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    slots.push(timeStr);
    currentTime += duration;
  }
  return slots;
};

// Utility to generate a meaningful token number
export const generateTokenNumber = (uid: string, shopId: string, slotId: string) => {
  const combined = `${uid}-${shopId}-${slotId}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Generate a 4-digit number (1000-9999)
  return Math.abs(hash % 9000) + 1000;
};
