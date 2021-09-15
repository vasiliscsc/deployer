import { InvalidArgumentError } from 'commander'
import { LogLevel } from '../utils'

/**
 * Parses log level input from the user in the CLI.
 *
 * @remarks
 * This function accepts both numeric values and their corresponding keys from the {@link LogLevel} enum.
 *
 * @throws {@link InvalidArgumentError}
 * This exception is thrown when the `input` cannot be parsed into a LogLevel.
 *
 * @param input - Input from the CLI by the user for the log level.
 * @returns A string matching one of the options in the LogLevel enum.
 */
export function parseInputToLogLevel(input: string): string {
  const intParsedInput: number = parseInt(input)
  if (isNaN(intParsedInput)) {
    if (input.toUpperCase() in LogLevel) {
      return input.toUpperCase()
    }
    throw new InvalidArgumentError('Log level argument must be one of the choices.')
  }
  const logLevel = LogLevel[intParsedInput]
  if (logLevel === undefined) {
    throw new InvalidArgumentError('Invalid log level argument given.')
  }
  return LogLevel[intParsedInput]
}
