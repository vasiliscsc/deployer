import { Command } from 'commander'
import { readDeployerConfig } from '../../../../config'
import { Logger } from '../../../../logger'
import { DeployerCommand } from '../../../types'

const command = new Command('inspect')
command.description('Display the contents of the deployer config.')

command.action((options, commandMeta: Command) => {
  Logger.output(readDeployerConfig())
})

const deployerCommand: DeployerCommand = { command }

export default deployerCommand
