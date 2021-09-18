import { LogLevelString } from '../logger'

export interface DeployerConfig {
  [index: string]: string | LogLevelString | boolean
  name: string
  logLevel: LogLevelString
  checkForUpdates: boolean
}
