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

export function isLogLevelString (logLevel: string): logLevel is LogLevelString {
  return logLevel in LogLevel
}

export function castStringToLogLevelString (logLevel: string): LogLevelString {
  if (isLogLevelString(logLevel)) {
    return logLevel
  }
  throw new Error(`Cannot convert string ${logLevel} to LogLevelString.`)
}
