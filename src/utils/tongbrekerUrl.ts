import type { Tongbreker } from '../types';
import { generateId } from './storage';

export function encodeTongbreker(text: string): string {
  try {
    return encodeURIComponent(btoa(encodeURIComponent(text)));
  } catch (error) {
    console.error('Error encoding tongbreker:', error);
    return '';
  }
}

export function decodeTongbreker(encoded: string): string | null {
  try {
    const decoded = decodeURIComponent(atob(decodeURIComponent(encoded)));
    return decoded;
  } catch (error) {
    console.error('Error decoding tongbreker:', error);
    return null;
  }
}

export function createTongbrekerShareUrl(tongbreker: Tongbreker): string {
  const baseUrl = window.location.origin + window.location.pathname;
  const encoded = encodeTongbreker(tongbreker.text);
  return `${baseUrl}?t=${encoded}`;
}

export function getTongbrekerFromUrl(): Tongbreker | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('t');

  if (!encoded) {
    return null;
  }

  const text = decodeTongbreker(encoded);
  if (!text) {
    return null;
  }

  return {
    id: generateId(),
    text,
    created_at: new Date().toISOString(),
  };
}
