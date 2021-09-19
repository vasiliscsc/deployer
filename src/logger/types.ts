export enum LogLevel {
  OFF = 0,
  OUTPUT = 1,
  FATAL = 1,
  ERROR,
  WARN,
  INFO,
  DEBUG,
  TRACE,
  ALL = 1000,
}
export type LogLevelString = keyof typeof LogLevel

/**
 * Function for narrowing a string literal into a {@link LogLevelString}.
 *
 * @param logLevel - String to assert whether it is a valid LogLevelString.
 * @returns True if `logLevel` is a valid LogLevelString.
 */
export function isLogLevelString (logLevel: string): logLevel is LogLevelString {
  return logLevel in LogLevel && isNaN(parseInt(logLevel))
}

/**
 * Returns the `logLevel` casted into a {@link LogLevelString}.
 *
 * @throws Will throw if `logLevel` cannot be casted into a LogLevelString.
 *
 * @param logLevel - String literal to narrow into a {@link LogLevelString}.
 * @returns The same string but casted into a LogLevelString type.
 */
export function castStringToLogLevelString (logLevel: string): LogLevelString {
  if (isLogLevelString(logLevel)) {
    return logLevel
  }
  throw new Error(`Cannot convert string ${logLevel} to LogLevelString.`)
}
