import { InvalidArgumentError } from 'commander'
import path from 'path'
import { defaultDeployerConfig } from '../config'
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

/**
 * Parses `input` into a deployer config key.
 *
 * @throws {@link InvalidArgumentError}
 * This exception is thrown when the `input` cannot be parsed into a deployer config key.
 *
 * @param input - Input from the CLI by the user for a deployer config key.
 * @returns Matching config key as present in default config.
 */
export function parseInputToDeployerConfigKey (input: string): string {
  const sanitizedInput = input.replace(/-/g, '')
  const key = Object.keys(defaultDeployerConfig).find(
    (element) => element.toLowerCase() === sanitizedInput.toLowerCase()
  )
  if (key === undefined) {
    throw new InvalidArgumentError(
      `Key ${input} is not supported. Accepted keys are:\n${Object.keys(defaultDeployerConfig).join(
        ', '
      )}`
    )
  }
  return key
}

/**
 * Parses `input` into a valid name.
 *
 * @remarks
 * Name is used as a tag for the images deployed using deployer. As a result the same constaints as docker tag must be used.
 *
 * _A tag name must be valid ASCII and may contain lowercase and uppercase letters, digits, underscores, periods and dashes.
 * A tag name may not start with a period or a dash and may contain a maximum of 128 characters._
 *
 * @see {@link https://docs.docker.com/engine/reference/commandline/tag/#extended-description}:
 *
 * @throws {@link InvalidArgumentError}
 * This exception is thrown when the `input` contains characters not accepted by docker tags.
 *
 * @param input - Input from the CLI by the user for the name config value.
 * @returns Sanitized name that is accepted as a docker tag.
 */
export function parseInputToName (input: string): string {
  const rx = /^(?![-.])[a-zA-Z0-9-_.]+$/
  if (!rx.test(input) || input.length > 128) {
    throw new InvalidArgumentError(
      'Name can only contain alphanumeric characters, "-", "_" and ".". It may not start with "." or "-" and may contain a maximum of 128 characters.'
    )
  }
  return input.toLowerCase()
}

/**
 * Parses `input` into a boolean.
 *
 * @throws {@link InvalidArgumentError}
 * This exception is thrown when the `input` cannot be parsed into a boolean.
 *
 * @param input - Input from the CLI by the user for a boolean value.
 * @returns Parsed boolean from string.
 */
export function parseInputToBoolean (input: string): boolean {
  if (['true', 'false'].includes(input.toLowerCase())) {
    return input.toLowerCase() === 'true'
  }
  throw new InvalidArgumentError('Input is not a boolean. Boolean expected.')
}
