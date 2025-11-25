import path from 'path'
import genDiff from '../src/index.js'
import parse from '../src/parsers.js'

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename)

test('compares nested JSON structures', () => {
  const filepath1 = getFixturePath('file1.json')
  const filepath2 = getFixturePath('file2.json')

  const data1 = parse(filepath1)
  const data2 = parse(filepath2)
  const result = genDiff(data1, data2)

  const expected = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`

  expect(result).toBe(expected)
})
