import { version as localVersion } from '../../package.json'
import { Command } from 'commander'
import { Logger, SemVer } from '../utils'
import fetch from 'node-fetch'

/**
 * Fetches the package.json of the master branch from Deployer's repository and parses its contents into an object.
 * It then returns the contents of `version` key.
 *
 * @remarks
 * Currently, master is assumed to contain the most up to date stable version of Deployer. In the future this function
 * may need to find and return the latest release tag.
 *
 * @returns Parsed package.json from remote.
 */
async function getRemoteVersion (): Promise<string> {
  const requestUrl = 'https://raw.githubusercontent.com/vasiliscsc/deployer/master/package.json'
  const result = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (r) => {
    const responseText = await r.text()
    return JSON.parse(responseText)
  })
  return result.version
}

/**
 * Commander lifecycle hook for checking whether deployer module is up to date with master.
 *
 * @remarks
 * This function makes an async call to github to get the version from the remote package.json on master branch.
 * It then compares the remote version with current the SemVer presedence specification.
 *
 * @see {@link https://semver.org/#spec-item-11}
 *
 * @param thisCommand - Parent commander Command.
 * @param actionCommand - Child commander subcommand Command.
 */
export async function checkForUpdatesHook (
  thisCommand: Command,
  actionCommand: Command
): Promise<void> {
  Logger.debug('Checking for updates...')
  const remoteVersion: string = await getRemoteVersion()
  Logger.debug({ localVersion, remoteVersion })
  if (SemVer.comparator(localVersion, remoteVersion) === -1) {
    Logger.info(`Update available ${localVersion} -> ${remoteVersion}`)
  }
}
