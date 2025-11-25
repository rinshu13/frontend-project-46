// src/formatters/plain.js
import _ from 'lodash';

const isComplex = (value) => _.isObject(value) && !_.isArray(value);

const stringify = (value) => {
  if (isComplex(value)) return '[complex value]';
  if (value === null) return 'null';
  if (_.isString(value)) return `'${value}'`;
  return String(value);
};

const plain = (nodes, path = []) => {
  return nodes
    .map((node) => {
      const currentPath = [...path, node.key];
      const propPath = currentPath.join('.');

      switch (node.type) {
        case 'added':
          return `Property '${propPath}' was added with value: ${stringify(node.value)}`;
        case 'removed':
          return `Property '${propPath}' was removed`;
        case 'changed':
          return `Property '${propPath}' was updated. From ${stringify(node.value1)} to ${stringify(node.value2)}`;
        case 'nested':
          return plain(node.children, currentPath);
        case 'unchanged':
          return null;
        default:
          throw new Error(`Unknown type: ${node.type}`);
      }
    })
    .filter(Boolean)
    .join('\n');
};

export default plain;