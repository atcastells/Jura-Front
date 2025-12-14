import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for conditionally joining class names
 * @example cn('base-class', condition && 'conditional-class', 'another-class')
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
