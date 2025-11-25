#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import parse from '../src/parsers.js';
import genDiff from '../src/index.js';

// Путь к текущему файлу
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Загрузка package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version(pkg.version, '-V, --version', 'output the version number')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish') // 'stylish' по умолчанию
  .action((filepath1, filepath2, options) => {
    // Приводим пути к абсолютным относительно текущей рабочей директории
    const absolutePath1 = path.resolve(process.cwd(), filepath1);
    const absolutePath2 = path.resolve(process.cwd(), filepath2);

    // Проверка существования файлов
    if (!fs.existsSync(absolutePath1)) {
      console.error(`Error: File not found: ${absolutePath1}`);
      process.exit(1);
    }
    if (!fs.existsSync(absolutePath2)) {
      console.error(`Error: File not found: ${absolutePath2}`);
      process.exit(1);
    }

    // Парсинг файлов
    const data1 = parse(absolutePath1);
    const data2 = parse(absolutePath2);

    // Генерация diff с выбранным форматом
    const result = genDiff(data1, data2, options.format);

    console.log(result);
  })
  .helpOption('-h, --help', 'display help for command');

program.parse();