const { detect } = require('langdetect');

function detectLanguage(text) {
  const langCode = detect(text);
  return langCode === 'und' ? 'unknown' : langCode;
}

module.exports = detectLanguage;
