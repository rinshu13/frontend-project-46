#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import parse from '../src/parsers.js';
import pkg from '../package.json' with { type: 'json' };

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version(pkg.version, '-V, --version', 'output the version number')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    // Приводим пути к абсолютным относительно текущей рабочей директории
    const absolutePath1 = path.resolve(process.cwd(), filepath1);
    const absolutePath2 = path.resolve(process.cwd(), filepath2);

    // Проверяем существование файлов
    if (!fs.existsSync(absolutePath1)) {
      console.error(`Error: File not found: ${absolutePath1}`);
      process.exit(1);
    }
    if (!fs.existsSync(absolutePath2)) {
      console.error(`Error: File not found: ${absolutePath2}`);
      process.exit(1);
    }

    // Парсим оба файла
    const data1 = parse(absolutePath1);
    const data2 = parse(absolutePath2);

    // Пока просто выводим объекты (на следующих шагах будет сравнение)
    console.log('File 1:', data1);
    console.log('File 2:', data2);
  })
  .helpOption('-h, --help', 'display help for command');

program.parse();
