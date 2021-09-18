import { Command, Option } from 'commander'
import { DeployerCommand } from '../types'
import DeployerCommands from './commands'

const options: Option[] = Array<Option>()

const command = new Command('config')
command.description('Manage the deployer config.')
options.forEach((option: Option) => command.addOption(option))
DeployerCommands.forEach((deployerCommand) =>
  command.addCommand(deployerCommand.command, deployerCommand.commandOptions)
)

command.action((options, commandMeta: Command) => {
  command.help()
})

const deployerCommand: DeployerCommand = { command }

export default deployerCommand
