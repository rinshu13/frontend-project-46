// src/index.js
import _ from 'lodash';

// Вспомогательная функция: строит дерево различий
const buildDiffTree = (obj1, obj2) => {
  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

  return keys.map((key) => {
    const hasKey1 = _.has(obj1, key);
    const hasKey2 = _.has(obj2, key);

    if (!hasKey2) {
      return { key, type: 'removed', value: obj1[key] };
    }
    if (!hasKey1) {
      return { key, type: 'added', value: obj2[key] };
    }

    const val1 = obj1[key];
    const val2 = obj2[key];

    // Оба значения — объекты (и не массивы) → рекурсия
    if (_.isObject(val1) && _.isObject(val2) && !_.isArray(val1) && !_.isArray(val2)) {
      return { key, type: 'nested', children: buildDiffTree(val1, val2) };
    }

    // Значения равны
    if (_.isEqual(val1, val2)) {
      return { key, type: 'unchanged', value: val1 };
    }

    // Значения отличаются
    return { key, type: 'changed', value1: val1, value2: val2 };
  });
};

// Вспомогательная функция: приводит значение к строке для вывода
const stringify = (value) => {
  if (value === null) return 'null';
  if (value === '') return '';
  if (_.isBoolean(value)) return String(value);
  if (_.isString(value)) return value;
  return String(value);
};

// Форматер: stylish
const stylish = (diffTree, depth = 0) => {
  const indentSize = 4;
  const currentIndent = ' '.repeat(indentSize * depth);

  const lines = diffTree.map((node) => {
    const valueIndent = `${currentIndent}  `;

    switch (node.type) {
      case 'added':
        return `${valueIndent}+ ${node.key}: ${stringify(node.value)}`;
      case 'removed':
        return `${valueIndent}- ${node.key}: ${stringify(node.value)}`;
      case 'unchanged':
        return `${valueIndent}  ${node.key}: ${stringify(node.value)}`;
      case 'changed':
        return [
          `${valueIndent}- ${node.key}: ${stringify(node.value1)}`,
          `${valueIndent}+ ${node.key}: ${stringify(node.value2)}`
        ].join('\n');
      case 'nested': {
        const children = stylish(node.children, depth + 1);
        return [
          `${valueIndent}  ${node.key}: {`,
          children,
          `${valueIndent}  }`
        ].join('\n');
      }    
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });

  if (depth === 0) {
    return ['{', ...lines, '}'].join('\n');
  }

  return lines.join('\n');
};

// Основная функция — экспортируется по умолчанию
const genDiff = (obj1, obj2) => {
  const diffTree = buildDiffTree(obj1, obj2);
  return stylish(diffTree);
};

export default genDiff;
