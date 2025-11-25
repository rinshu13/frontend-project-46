// src/formatters/index.js
import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

const getFormatter = (name) => {
  if (!formatters[name]) {
    throw new Error(`Unknown format: ${name}`);
  }
  return formatters[name];
};

export default getFormatter;