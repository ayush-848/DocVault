import { franc } from 'franc';

function detectLanguage(text) {
  const langCode = franc(text);
  return langCode === 'und' ? 'unknown' : langCode;
}

export default detectLanguage;
