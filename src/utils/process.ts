import { ChildProcess } from 'child_process'
import spawn from 'cross-spawn'
import { Logger, LogLevel } from '../logger'

/**
 * Spawns a worker process with the given command and args. LogLevel is used to allocate.
 *
 * @remarks
 * This function uses {@link spawn} to create child process instead of child_process library.
 * This is to gain the benefit of shebangs and PATHEXT.
 *
 * @param command - The command to be executed by the spawned child.
 * @param args - An array of strings as the arguments for the command.
 * @param logLevel - Used to determine whether the process output should be piped to the console.
 * @returns The worker process and a Promise for the exit code.
 */
export function spawnWorker (
  command: string,
  args: string[],
  logLevel: LogLevel = LogLevel.OFF
): {
    worker: ChildProcess
    exitCodePromise: Promise<number>
  } {
  const logState = Logger.isLogLevelSilent(logLevel) ? 'pipe' : 'inherit'
  const worker = spawn(command, args, {
    stdio: ['ignore', logState, logState]
  })
  const exitCodePromise = new Promise<number>((resolve, reject) => {
    worker.on('exit', function (code) {
      code !== null ? resolve(code) : reject(code)
    })
  })
  return { worker, exitCodePromise }
}

/**
 * This command spawns a worker process and awaits its exit before returning.
 *
 * @param command - The command to be executed by the spawned child.
 * @param args - An array of strings as the arguments for the command.
 * @returns `output` from stdout, `error` from stderr and exit code.
 */
export async function exec (
  command: string,
  args: string[]
): Promise<{ output: string, error: string, exitCode: number }> {
  const { worker, exitCodePromise } = spawnWorker(command, args, LogLevel.ALL)
  let output = ''
  let error = ''
  worker.stdout?.on('data', function (data: Buffer) {
    output = output + data.toString().trim()
  })
  worker.stderr?.on('data', function (data: Buffer) {
    error = error + data.toString().trim()
  })
  const exitCode = await exitCodePromise
  return { output, error, exitCode }
}
