// Date and Time Conversion Utilities for Django Backend

export const convertDateToDjangoFormat = (dateInput: string): string => {
  if (!dateInput) return '';
  
  // Handle different input formats
  let date: Date;
  
  // Check if it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  
  // Handle formats like "18 sep 2020", "18 Sep 2020", "Sep 18, 2020", etc.
  if (dateInput.includes(' ')) {
    // Parse natural language dates
    date = new Date(dateInput);
  } else if (dateInput.includes('/')) {
    // Handle MM/DD/YYYY or DD/MM/YYYY formats
    date = new Date(dateInput);
  } else {
    // Try to parse as-is
    date = new Date(dateInput);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateInput}`);
  }
  
  // Convert to YYYY-MM-DD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Convert user-friendly time formats to Django-expected HH:MM:SS format
 */
export const convertTimeToDjangoFormat = (timeInput: string): string => {
  if (!timeInput) return '';
  
  // Remove extra spaces
  let time = timeInput.trim().toLowerCase();
  
  // Check if it's already in HH:MM:SS format
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time;
  }
  
  // Handle 12-hour format (e.g., "7:10 AM", "10:00 PM")
  if (time.includes('am') || time.includes('pm')) {
    const isPM = time.includes('pm');
    time = time.replace(/\s*(am|pm)/g, '');
    
    const [hours, minutes = '00'] = time.split(':');
    let hour24 = parseInt(hours, 10);
    
    // Convert to 24-hour format
    if (isPM && hour24 !== 12) {
      hour24 += 12;
    } else if (!isPM && hour24 === 12) {
      hour24 = 0;
    }
    
    const formattedHour = String(hour24).padStart(2, '0');
    const formattedMinutes = String(parseInt(minutes, 10)).padStart(2, '0');
    
    return `${formattedHour}:${formattedMinutes}:00`;
  }
  
  // Handle 24-hour format without seconds (e.g., "10:00", "14:30")
  if (/^\d{1,2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(':');
    const formattedHour = String(parseInt(hours, 10)).padStart(2, '0');
    const formattedMinutes = String(parseInt(minutes, 10)).padStart(2, '0');
    
    return `${formattedHour}:${formattedMinutes}:00`;
  }
  
  throw new Error(`Invalid time format: ${timeInput}`);
};

/**
 * Convert Django formats back to user-friendly formats for display
 */
export const convertDjangoDateToDisplay = (djangoDate: string): string => {
  if (!djangoDate) return '';
  
  const date = new Date(djangoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const convertDjangoTimeToDisplay = (djangoTime: string): string => {
  if (!djangoTime) return '';
  
  const [hours, minutes] = djangoTime.split(':');
  const hour24 = parseInt(hours, 10);
  const isAM = hour24 < 12;
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  
  return `${hour12}:${minutes} ${isAM ? 'AM' : 'PM'}`;
};
