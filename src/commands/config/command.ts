import { Command } from 'commander'
import { DeployerCommand } from '../types'
import DeployerCommands from './commands'

const command = new Command('config')
command.description('Manage the deployer config.')
DeployerCommands.forEach((deployerCommand) =>
  command.addCommand(deployerCommand.command, deployerCommand.commandOptions)
)

command.action((options, commandMeta: Command) => {
  command.help()
})

const deployerCommand: DeployerCommand = { command }

export default deployerCommand
