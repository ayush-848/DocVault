import { franc } from 'franc';

export function detectLanguage(text) {
  const langCode = franc(text);
  return langCode === 'und' ? 'unknown' : langCode;
}
