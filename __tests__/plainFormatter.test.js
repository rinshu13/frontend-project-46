// __tests__/plainFormatter.test.js
import path from 'path';
import genDiff from '../src/index.js';
import parse from '../src/parsers.js';

const getFixturePath = (filename) => path.join(process.cwd(), '__fixtures__', filename);

test('plain formatter produces correct output', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');

  const data1 = parse(filepath1);
  const data2 = parse(filepath2);
  const result = genDiff(data1, data2, 'plain');

  const expected = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

  expect(result).toBe(expected);
});