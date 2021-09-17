#!/usr/bin/env node

import { Command, Option } from 'commander'
import { DeployerPreActionHooks } from './hooks'
import DeployerCommands from './commands'
import { InputParsing } from './utils'
import { version } from '../package.json'
import { Logger } from './logger'

const logLevelOption = new Option(
  '-l, --log-level <logLevel>',
  'The log level for the deployer command. Accepts 0-6 or choice:'
)
  .choices(['OFF', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'])
  .argParser(InputParsing.parseInputToLogLevel)
const quietOption = new Option('-q, --quiet', 'Run the command with only critical logs.')
const DeployerOptions: Option[] = new Array<Option>(logLevelOption, quietOption)

const program = new Command('deployer')
program.description(
  'CLI entrypoint for deployer. For the full documentation visit https://github.com/vasiliscsc/deployer#readme.'
)
DeployerOptions.forEach((deployerOption: Option) => program.addOption(deployerOption))
DeployerPreActionHooks.forEach((preActionHook) => program.hook('preAction', preActionHook))
DeployerCommands.forEach((deployerCommand) =>
  program.addCommand(deployerCommand.command, deployerCommand.commandOptions)
)
program
  .version(version, '-v, --version', 'Display version installed.')
  .helpOption('-h, --help', 'Display command help.')

program.action(() => {
  program.help()
})

program.parseAsync(process.argv).catch((e: Error) => {
  Logger.fatal(e.message)
  Logger.debug(e.stack)
  process.exit(1)
})
