import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format a date string to a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return '';
  }
}

/**
 * Format a date string to a human-readable format
 */
export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (error) {
    return '';
  }
}

/**
 * Format a date string for message timestamps (smart formatting)
 */
export function formatMessageTime(dateString: string | null): string {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;

    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  } catch (error) {
    return '';
  }
}

/**
 * Format conversation last activity time
 */
export function formatConversationTime(dateString: string | null): string {
  if (!dateString) return '';

  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;

    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d, yyyy');
    }
  } catch (error) {
    return '';
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format duration in seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
}

/**
 * Truncate text to a maximum length
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Get initials from a name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '??';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string | null): string {
  if (!phone) return '';

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  }

  return phone;
}

/**
 * Get color for status badge
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: '#FFA500',
    sent: '#2196F3',
    delivered: '#4CAF50',
    read: '#4CAF50',
    failed: '#F44336',
    active: '#4CAF50',
    resolved: '#2196F3',
    closed: '#9E9E9E',
    archived: '#9C27B0',
  };

  return statusColors[status] || '#9E9E9E';
}

/**
 * Get color for priority badge
 */
export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    low: '#9E9E9E',
    normal: '#2196F3',
    high: '#FF9800',
    urgent: '#F44336',
  };

  return priorityColors[priority] || '#2196F3';
}

