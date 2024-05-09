#!/usr/bin/env node
import { binYapiToCode } from '../main'
const { program } = require('commander')

program.option('-i, --ids <char...>', 'Pass in the ID of the interface that needs to generate code, which will be concatenated into the ids of all projects in the configuration file projectList.')
program.option('-p, --config-path <char...>', 'The path to the configuration file defaults to ./yapi-to-code.config.js.')
program.option('-w, --write-mode <char...>', 'The write mode of the generated file will overwrite the same fields in the configuration file, cover: overwrite the original file; append: append to the end of the original file; skip: skip existing files directly.')

program.parse();

const opts = program.opts()

binYapiToCode(opts)