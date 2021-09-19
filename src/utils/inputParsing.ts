import { InvalidArgumentError } from 'commander'
import path from 'path'
import { isLogLevelString, LogLevel } from '../logger'

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
export function parseInputToLogLevel (input: string): string {
  const upperCasedInput: string = input.toUpperCase()
  if (isLogLevelString(upperCasedInput)) {
    return upperCasedInput
  } else {
    const intParsedInput: number = parseInt(input)
    if (isLogLevelString(LogLevel[intParsedInput])) {
      return LogLevel[intParsedInput]
    }
    throw new InvalidArgumentError('Invalid log level argument given.')
  }
}

/**
 * Parses a `filePath` the input from the user in the CLI.
 *
 * @remarks
 * This function normalizes the input file path to ensure the path works across multiple operating systems.
 *
 * @see {@link path.normalize}
 *
 * @param filePath - File path as inputted by the user in the CLI.
 * @returns Normalized file path
 */
export function parseFilePath (filePath: string): string {
  let normalizedFilePath = ''
  try {
    normalizedFilePath = path.normalize(filePath)
  } catch (e) {
    throw new InvalidArgumentError('Invalid path argument given.')
  }
  return normalizedFilePath
}
