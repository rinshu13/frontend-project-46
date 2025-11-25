#!/usr/bin/env node

import { Command } from 'commander';

// Прямой импорт package.json — работает в Node.js ≥18 с "type": "module"
import pkg from '../package.json' with { type: 'json' };

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version(pkg.version, '-V, --version', 'output the version number')
  .helpOption('-h, --help', 'display help for command');

program.parse();
