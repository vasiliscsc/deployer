import { checkForUpdatesHook } from './checkForUpdatesHook'
import { configureEnvironmentHook } from './configureEnvironmentHook'

const DeployerPreActionHooks = [configureEnvironmentHook, checkForUpdatesHook]

export { DeployerPreActionHooks }
