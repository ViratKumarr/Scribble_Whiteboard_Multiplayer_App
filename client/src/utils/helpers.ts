/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generate a random color
 * @returns Hex color string
 */
export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Truncate a string if it exceeds the maximum length
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

/**
 * Debounce a function to limit how often it can be called
 * @param func - Function to debounce
 * @param wait - Time in milliseconds to wait
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Check if an object is empty
 * @param obj - Object to check
 * @returns Boolean indicating if the object is empty
 */
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Convert a file size in bytes to a human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Human-readable file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};