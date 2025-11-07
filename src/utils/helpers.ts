import { Contact, Message } from '../types';

/**
 * Group messages by date
 */
export function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const groups: Record<string, Message[]> = {};

  messages.forEach(message => {
    if (!message.sent_at) return;

    const date = new Date(message.sent_at);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(message);
  });

  return groups;
}

/**
 * Get display name for a contact with fallback
 */
export function getContactDisplayName(contact: Contact | null | undefined): string {
  if (!contact) return 'Unknown';

  if (contact.display_name) {
    return contact.display_name;
  }

  if (contact.first_name || contact.last_name) {
    return `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
  }

  if (contact.email) {
    return contact.email.split('@')[0];
  }

  return 'Guest';
}

/**
 * Check if a message is from the current user
 */
export function isMessageFromMe(message: Message, currentContactId: number): boolean {
  return message.from_me || message.sender_id === currentContactId;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      output[key as keyof T] = deepMerge(
        targetValue as Record<string, any>,
        sourceValue as Record<string, any>
      ) as T[keyof T];
    } else {
      output[key as keyof T] = sourceValue as T[keyof T];
    }
  });

  return output;
}

/**
 * Check if an object is empty
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Sort messages by timestamp
 */
export function sortMessagesByTime(messages: Message[], ascending: boolean = true): Message[] {
  return [...messages].sort((a, b) => {
    const timeA = a.sent_at ? new Date(a.sent_at).getTime() : 0;
    const timeB = b.sent_at ? new Date(b.sent_at).getTime() : 0;

    return ascending ? timeA - timeB : timeB - timeA;
  });
}

/**
 * Get unread message count
 */
export function getUnreadCount(messages: Message[], currentContactId: number): number {
  return messages.filter(
    message => !message.read_at && message.sender_id !== currentContactId
  ).length;
}

/**
 * Local storage wrapper with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

