export enum LogLevel {
  OFF = 0,
  FATAL,
  ERROR,
  WARN,
  INFO,
  DEBUG,
  TRACE,
  ALL = 1000,
}
export type LogLevelStrings = keyof typeof LogLevel
