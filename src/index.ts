#!/usr/bin/env node

import { Command, Option } from 'commander'
import { setLogLevelHook } from './hooks'
import { Logger, InputParsing } from './utils'
import packageJson from '../package.json'

const logLevelOption = new Option(
  '-l, --log-level <logLevel>',
  'The log level for the deployer command. Accepts numerical value between 0-6 or one of the choices.'
)
  .choices(['OFF', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'])
  .argParser(InputParsing.parseInputToLogLevel)
const quietOption = new Option('-q, --quiet', 'Run the command with only critical logs.')
const options: Option[] = new Array<Option>(logLevelOption, quietOption)

const program = new Command('deployer')
options.forEach((option: Option) => program.addOption(option))

program
  .version(packageJson.version, '-v, --version', 'Display version installed.')
  .helpOption('-h, --help', 'Display command help.')

program.hook('preAction', setLogLevelHook)

program.action(() => {
  Logger.fatal('This must be seen if loglevel is FATAL or higher.')
  Logger.error('This must be seen if loglevel is ERROR or higher.')
  Logger.warn('This must be seen if loglevel is WARN or higher.')
  Logger.info('This must be seen if loglevel is INFO or higher.')
  Logger.debug('This must be seen if loglevel is DEBUG or higher.')
  Logger.trace('This must be seen if loglevel is TRACE or higher.')
  throw new Error('Test error')
})

program.parseAsync(process.argv).catch((e: Error) => {
  Logger.fatal(e.message)
  Logger.debug(e.stack)
})
