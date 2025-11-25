import _ from 'lodash'

const isPlainValue = (value) => {
  return !_.isObject(value) || _.isArray(value)
}

const stringify = (value) => {
  if (value === null) return 'null'
  if (value === '') return ''
  if (_.isBoolean(value) || _.isNumber(value)) return String(value)
  if (_.isString(value)) return value
  return String(value)
}

const stylish = (nodes, depth = 0) => {
  const indentSize = 4
  const currentIndent = ' '.repeat(indentSize * depth)

  const lines = nodes.map((node) => {
    const valueIndent = `${currentIndent}  `

    switch (node.type) {
      case 'added': {
        if (isPlainValue(node.value)) {
          return `${valueIndent}+ ${node.key}: ${stringify(node.value)}`
        }
        const nested = stylish(buildFlatTree(node.value), depth + 1)
        return [
          `${valueIndent}+ ${node.key}: {`,
          nested,
          `${valueIndent}  }`,
        ].join('\n')
      }
      case 'removed': {
        if (isPlainValue(node.value)) {
          return `${valueIndent}- ${node.key}: ${stringify(node.value)}`
        }
        const nested = stylish(buildFlatTree(node.value), depth + 1)
        return [
          `${valueIndent}- ${node.key}: {`,
          nested,
          `${valueIndent}  }`,
        ].join('\n')
      }
      case 'unchanged': {
        if (isPlainValue(node.value)) {
          return `${valueIndent}  ${node.key}: ${stringify(node.value)}`
        }
        const nested = stylish(buildFlatTree(node.value), depth + 1)
        return [
          `${valueIndent}  ${node.key}: {`,
          nested,
          `${valueIndent}  }`,
        ].join('\n')
      }
      case 'changed': {
        const val1IsObj = !isPlainValue(node.value1)
        const val2IsObj = !isPlainValue(node.value2)

        const line1 = val1IsObj
          ? [
              `${valueIndent}- ${node.key}: {`,
              stylish(buildFlatTree(node.value1), depth + 1),
              `${valueIndent}  }`,
            ].join('\n')
          : `${valueIndent}- ${node.key}: ${stringify(node.value1)}`

        const line2 = val2IsObj
          ? [
              `${valueIndent}+ ${node.key}: {`,
              stylish(buildFlatTree(node.value2), depth + 1),
              `${valueIndent}  }`,
            ].join('\n')
          : `${valueIndent}+ ${node.key}: ${stringify(node.value2)}`

        return `${line1}\n${line2}`
      }
      case 'nested': {
        const children = stylish(node.children, depth + 1)
        return [
          `${valueIndent}  ${node.key}: {`,
          children,
          `${valueIndent}  }`,
        ].join('\n')
      }
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  })

  if (depth === 0) {
    return ['{', ...lines, '}'].join('\n')
  }

  return lines.join('\n')
}

const buildFlatTree = (obj) => {
  return Object.keys(obj).sort().map((key) => {
    const value = obj[key]
    if (_.isObject(value) && !_.isArray(value)) {
      return { key, type: 'nested', children: buildFlatTree(value) }
    }
    return { key, type: 'unchanged', value }
  })
}

export default stylish
