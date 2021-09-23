import { exec } from './process'

/**
 * Gets the port on which a container is running.
 *
 * @param containerName - the name of the container whose port is to be returned.
 * @returns The port on which container is exposed on.
 */
export async function getContainerPort (containerName: string): Promise<number> {
  const { output, exitCode } = await exec('docker', ['port', containerName])
  if (exitCode === 0) {
    const rx = /0.0.0.0:([0-9]+)/g
    const arr = rx.exec(output)
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[1] === 'string') {
      return parseInt(arr[1])
    }
  }
  return -1
}
