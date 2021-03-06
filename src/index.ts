#!/usr/bin/env node

import chalk from 'chalk'
import { Command, Option } from 'commander'
import dotenv from 'dotenv'
import { DeployerPreActionHooks } from './hooks'
import DeployerCommands from './commands'
import { InputParsing } from './utils'
import { version } from '../package.json'
import { Logger } from './logger'

dotenv.config()

const logLevelOption = new Option(
  '-l, --log-level <logLevel>',
  'The log level for the deployer command. Accepts 0-6 or choice:'
)
  .choices(['OFF', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'])
  .argParser(InputParsing.parseInputToLogLevel)
  .env('DEPLOYER_LOG_LEVEL')
const nameOption = new Option('--name <name>', 'The alias used when tagging deployed images.')
  .env('DEPLOYER_NAME')
  .argParser(InputParsing.parseInputToName)
  .hideHelp()
const checkForUpdatesOption = new Option(
  '--check-for-updates <checkForUpdates>',
  'Sets whether the command should check for updates before executing.'
)
  .choices(['TRUE', 'FALSE'])
  .argParser(InputParsing.parseInputToBoolean)
  .env('DEPLOYER_CHECK_FOR_UPDATES')
  .hideHelp()
const DeployerOptions: Option[] = new Array<Option>(
  logLevelOption,
  nameOption,
  checkForUpdatesOption
)

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

program.enablePositionalOptions()
program.showSuggestionAfterError(true)
program.parseAsync(process.argv).catch((e: Error) => {
  Logger.fatal(chalk.redBright(e.message))
  Logger.debug(chalk.gray(e.stack))
  process.exit(1)
})
