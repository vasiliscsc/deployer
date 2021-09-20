import chalk from 'chalk'
import { Argument, Command } from 'commander'
import fs from 'fs'
import yaml from 'js-yaml'
import {
  defaultDeployerConfig,
  deployerConfigFilePath,
  readDeployerConfig
} from '../../../../config'
import { castStringToLogLevelString, Logger } from '../../../../logger'
import { InputParsing } from '../../../../utils'
import { DeployerCommand } from '../../../types'

const keyArgument = new Argument('key', 'The key of the deployer config to be updated.')
  .choices(Object.keys(defaultDeployerConfig))
  .argParser(InputParsing.parseInputToDeployerConfigKey)
const valueArgument = new Argument('value', 'The value to store in the deployer config key.')
const args: Argument[] = new Array<Argument>(keyArgument, valueArgument)

const command = new Command('set')
args.forEach((arg) => {
  command.addArgument(arg)
})
command.description('Sets the key and value pair in the config.')

command.action((key, value, options, commandMeta: Command) => {
  if (typeof key !== 'string' || typeof value !== 'string') {
    throw new Error('Invalid input type.')
  }
  const deployerConfig = readDeployerConfig()
  switch (key) {
    case 'name':
      deployerConfig.name = InputParsing.parseInputToName(value)
      break
    case 'logLevel':
      deployerConfig.logLevel = castStringToLogLevelString(InputParsing.parseInputToLogLevel(value))
      break
    case 'checkForUpdates':
      deployerConfig.checkForUpdates = InputParsing.parseInputToBoolean(value)
      break
  }

  fs.writeFileSync(deployerConfigFilePath, yaml.dump(deployerConfig))
  Logger.output(
    `Config key ${chalk.yellowBright(key)} has been successfully set to ${chalk.yellowBright(
      value
    )}.`
  )
})
const deployerCommand: DeployerCommand = { command }

export default deployerCommand
