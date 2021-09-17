import { Command, CommandOptions } from 'commander'

export interface DeployerCommand {
  command: Command
  commandOptions?: CommandOptions
}
