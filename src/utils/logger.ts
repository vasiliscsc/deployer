import { Console } from 'console'
import { LogLevel, LogLevelStrings } from './types'

const deployerConsole = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: true,
  inspectOptions: { depth: null }
})

/**
 * Returns true if the provided log level is silent.
 *
 * @remarks
 * This function is mostly used internally in the Logger. Otherwise it is only used in spawned processes.
 *
 * @param logLevel - The log level to check its verbosity.
 * @returns True if provided log level is silent.
 */
export function isLogLevelSilent (logLevel: LogLevel | LogLevelStrings): boolean {
  if (typeof logLevel === 'string') {
    if (Object.keys(LogLevel).includes(logLevel)) {
      logLevel = LogLevel[logLevel]
    }
  }
  if (process.env.DEPLOYER_LOG_LEVEL === undefined) {
    return LogLevel.FATAL < logLevel
  }

  return parseInt(process.env.DEPLOYER_LOG_LEVEL) < logLevel
}

/**
 * Prints all items in the `printList` using the given `printFunc` if the environment's log level is higher or equal to given `log level`.
 *
 * @remarks
 * This function is a utility function used by the log functions exported by the logger {@link fatal}, {@link error}, {@link warn}, {@link info}, {@link debug}, {@link trace}
 *
 * @param printList - List of items to be printed to the outputstream.
 * @param logLevel - Log level used to determine whether the items should be logged.
 * @param printFunc - The function used to print given items.
 */
function print (printList: any[], logLevel: LogLevel, printFunc: (printItem: any) => void): void {
  if (!isLogLevelSilent(logLevel)) {
    printList.forEach((printItem) => {
      printFunc(printItem)
    })
  }
}

/**
 * Prints the items given in the `printList` using {@link LogLevel.FATAL}.
 *
 * @remarks
 * This print method will send its output to stderr.
 *
 * @see {@link print}
 *
 * @param printList - One or more items to print to the console.
 */
export function fatal (...printList: any[]): void {
  print(printList, LogLevel.FATAL, deployerConsole.error)
}

/**
 * Prints the items given in the `printList` using {@link LogLevel.ERROR}.
 *
 * @remarks
 * This print method will send its output to stderr.
 *
 * @see {@link print}
 *
 * @param printList - One or more items to print to the console.
 */
export function error (...printList: any[]): void {
  print(printList, LogLevel.ERROR, deployerConsole.error)
}

/**
 * Prints the items given in the `printList` using {@link LogLevel.WARN}.
 *
 * @remarks
 * This print method will send its output to stderr.
 *
 * @see {@link print}
 *
 * @param printList - One or more items to print to the console.
 */
export function warn (...printList: any[]): void {
  print(printList, LogLevel.WARN, deployerConsole.error)
}

/**
 * Prints the items given in the `printList` using {@link LogLevel.INFO}.
 *
 * @remarks
 * This print method will send its output to stdout.
 *
 * @see {@link print}
 *
 * @param printList - One or more items to print to the console.
 */
export function info (...printList: any[]): void {
  print(printList, LogLevel.INFO, deployerConsole.log)
}

/**
 * Prints the items given in the `printList` using {@link LogLevel.DEBUG}.
 *
 * @remarks
 * This print method will send its output to stdout.
 *
 * @see {@link print}
 *
 * @param printList - One or more items to print to the console.
 */
export function debug (...printList: any[]): void {
  print(printList, LogLevel.DEBUG, deployerConsole.log)
}

/**
 * Prints the items given in the `printList` using {@link LogLevel.TRACE}.
 *
 * @remarks
 * This print method will send its output to stdout.
 *
 * @see {@link print}
 *
 * @param printList - One or more items to print to the console.
 */
export function trace (...printList: any[]): void {
  print(printList, LogLevel.TRACE, deployerConsole.log)
}
