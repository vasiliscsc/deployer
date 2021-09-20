import fs from 'fs'
import yaml from 'js-yaml'
import { Argument, Command } from 'commander'
import {
  defaultDeployerConfig,
  deployerConfigFilePath,
  readDeployerConfig
} from '../../../../config'
import { Logger } from '../../../../logger'
import { InputParsing } from '../../../../utils'
import { DeployerCommand } from '../../../types'

const keyArgument = new Argument('key', 'The key of the deployer config to be updated.')
  .choices(Object.keys(defaultDeployerConfig))
  .argParser(InputParsing.parseInputToDeployerConfigKey)
const args: Argument[] = new Array<Argument>(keyArgument)

const command = new Command('unset')
args.forEach((arg) => {
  command.addArgument(arg)
})
command.description('Resets the key to its default value.')

command.action((key, options, commandMeta: Command) => {
  if (typeof key !== 'string') {
    throw new Error('Invalid input type.')
  }
  const deployerConfig = readDeployerConfig()
  deployerConfig[key] = defaultDeployerConfig[key]

  fs.writeFileSync(deployerConfigFilePath, yaml.dump(deployerConfig))
  Logger.output(
    `Config key ${key} has been successfully reset to ${defaultDeployerConfig[key].toString()}.`
  )
})
const deployerCommand: DeployerCommand = { command }

export default deployerCommand
