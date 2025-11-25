// __tests__/genDiff.test.js
import path from 'path';
import genDiff from '../src/index.js';
import parse from '../src/parsers.js';

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename);

test('compares flat JSON files correctly', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');

  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const result = genDiff(data1, data2);

  const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  expect(result).toBe(expected);
});
