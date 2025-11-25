#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import parse from '../src/parsers.js';
import genDiff from '../src/index.js';

// Загрузка package.json
let pkg;
try {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  const pkgContent = fs.readFileSync(packagePath, 'utf8');
  pkg = JSON.parse(pkgContent);
} catch (err) {
  console.error(`Error reading package.json: ${err.message}`);
  process.exit(1);
}

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version(pkg.version, '-V, --version', 'output the version number')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    const absolutePath1 = path.resolve(process.cwd(), filepath1);
    const absolutePath2 = path.resolve(process.cwd(), filepath2);

    if (!fs.existsSync(absolutePath1)) {
      console.error(`Error: File not found: ${absolutePath1}`);
      process.exit(1);
    }
    if (!fs.existsSync(absolutePath2)) {
      console.error(`Error: File not found: ${absolutePath2}`);
      process.exit(1);
    }

    const data1 = parse(absolutePath1);
    const data2 = parse(absolutePath2);
    const result = genDiff(data1, data2, options.format);

    console.log(result);
  })
  .helpOption('-h, --help', 'display help for command');

program.parse();