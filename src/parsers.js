// src/parsers.js
import fs from 'fs';
import path from 'path';

const parse = (filepath) => {
  const ext = path.extname(filepath).toLowerCase();
  const content = fs.readFileSync(filepath, 'utf-8');

  switch (ext) {
    case '.json':
      return JSON.parse(content);
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
};

export default parse;
