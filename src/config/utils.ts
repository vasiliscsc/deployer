import { Command } from 'commander'
import { DeployerConfig } from './type'

export function getDeployerConfigFromCommand (command: Command): DeployerConfig {
  return command.processedArgs[command.processedArgs.length - 1]
}
