const json = nodes => {
  const formatNode = node => {
    const base = { key: node.key, type: node.type }

    switch (node.type) {
      case 'added':
      case 'removed':
      case 'unchanged':
        return { ...base, value: node.value }
      case 'changed':
        return { ...base, value1: node.value1, value2: node.value2 }
      case 'nested':
        return { ...base, children: node.children.map(formatNode) }
      default:
        throw new Error(`Unknown node type: ${node.type}`)
    }
  }

  const result = nodes.map(formatNode)
  return JSON.stringify(result, null, 4)
}

export default json
