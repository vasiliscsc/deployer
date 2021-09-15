import { Command } from 'commander'
import { LogLevel } from '../utils'

/**
 * Commander lifecycle hook for setting the log level in the environment.
 *
 * @remarks
 * The log level is stored in `process.env.DEPLOYER_LOG_LEVEL`. It is therefore stored as a string with a numerical value
 * i.e. `process.env.DEPLOYER_LOG_LEVEL = "4"`.
 * If nothing in the environment sets the log level, it defaults to `"4"`.
 *
 * @param thisCommand Parent commander Command.
 * @param actionCommand Child commander subcommand Command.
 */
export function setLogLevelHook (thisCommand: Command, actionCommand: Command): void {
  const deployerOptions = thisCommand.opts()
  if (deployerOptions.logLevel !== undefined) {
    process.env.DEPLOYER_LOG_LEVEL = LogLevel[deployerOptions.logLevel]
    return
  }
  if (deployerOptions.quiet !== undefined) {
    process.env.DEPLOYER_LOG_LEVEL = LogLevel.FATAL.toString()
    return
  }
  process.env.DEPLOYER_LOG_LEVEL = LogLevel.INFO.toString()
}
