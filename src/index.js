// src/index.js
import _ from 'lodash';

const genDiff = (obj1, obj2) => {
  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

  const lines = keys.map((key) => {
    if (!(key in obj2)) {
      return `  - ${key}: ${obj1[key]}`;
    }
    if (!(key in obj1)) {
      return `  + ${key}: ${obj2[key]}`;
    }
    if (obj1[key] === obj2[key]) {
      return `    ${key}: ${obj1[key]}`;
    }
    // значения отличаются
    return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
  });

  return ['{', ...lines, '}'].join('\n');
};

export default genDiff;
