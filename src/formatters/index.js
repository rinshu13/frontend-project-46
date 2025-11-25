import stylish from './stylish.js'
import plain from './plain.js'
import json from './json.js'

const formatters = {
  stylish,
  plain,
  json,
}

const getFormatter = name => {
  if (!formatters[name]) {
    throw new Error(`Unknown format: ${name}`)
  }
  return formatters[name]
}

export default getFormatter
