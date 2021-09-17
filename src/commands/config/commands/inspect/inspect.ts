import { Command } from 'commander'
import { DeployerCommand } from '../../../types'

const command = new Command('inspect')
command.description('Display the contents of the deployer config.')

command.action((options, commandMeta: Command) => {
  throw new Error('`deployer config inspect` not implemented')
})

const deployerCommand: DeployerCommand = { command }

export default deployerCommand
