import chalk from 'chalk'
import { Command } from 'commander'
import fs from 'fs'
import yaml from 'js-yaml'
import { Logger } from '../../../../logger'
import { DeployerCommand } from '../../../types'
import { defaultDeployerConfig, deployerConfigFilePath } from '../../../../config'

const command = new Command('reset')
command.description('Reverts all config keys to default values.')

command.action((options, commandMeta: Command) => {
  fs.writeFileSync(deployerConfigFilePath, yaml.dump(defaultDeployerConfig))
  Logger.output(chalk.greenBright('The Deployer config has been reset to the default values.'))
})

const deployerCommand: DeployerCommand = { command }

export default deployerCommand
