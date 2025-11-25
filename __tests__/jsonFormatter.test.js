// __tests__/jsonFormatter.test.js
import path from 'path';
import genDiff from '../src/index.js';
import parse from '../src/parsers.js';

const getFixture = (f) => path.join(process.cwd(), '__fixtures__', f);

test('json formatter produces valid JSON', () => {
  const data1 = parse(getFixture('file1.json'));
  const data2 = parse(getFixture('file2.json'));
  const result = genDiff(data1, data2, 'json');

  // Проверяем, что результат — валидный JSON
  const parsed = JSON.parse(result);
  expect(Array.isArray(parsed)).toBe(true);
  expect(parsed.length).toBeGreaterThan(0);

  // Проверяем наличие ключевых полей
  const commonNode = parsed.find(n => n.key === 'common');
  expect(commonNode).toBeDefined();
  expect(commonNode.type).toBe('nested');
  expect(commonNode.children).toBeDefined();
});