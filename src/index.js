import _ from 'lodash'
import getFormatter from './formatters/index.js'
import parse from './parsers.js'

const buildDiffTree = (obj1, obj2) => {
  const keys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)))
  return keys.map((key) => {
    const has1 = _.has(obj1, key)
    const has2 = _.has(obj2, key)

    if (!has2) return { key, type: 'removed', value: obj1[key] }
    if (!has1) return { key, type: 'added', value: obj2[key] }

    const v1 = obj1[key]
    const v2 = obj2[key]

    if (_.isObject(v1) && _.isObject(v2) && !_.isArray(v1) && !_.isArray(v2)) {
      return { key, type: 'nested', children: buildDiffTree(v1, v2) }
    }

    if (_.isEqual(v1, v2)) {
      return { key, type: 'unchanged', value: v1 }
    }

    return { key, type: 'changed', value1: v1, value2: v2 }
  })
}

// ВАЖНО: принимает ПУТИ к файлам, а не объекты!
const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const obj1 = parse(filepath1)
  const obj2 = parse(filepath2)
  const tree = buildDiffTree(obj1, obj2)
  const formatter = getFormatter(formatName)
  return formatter(tree)
}

export default genDiff
