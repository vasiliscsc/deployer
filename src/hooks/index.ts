import { setLogLevelHook } from './setLogLevelHook'
import { checkForUpdatesHook } from './checkForUpdatesHook'

const DeployerPreActionHooks = [setLogLevelHook, checkForUpdatesHook]

export { DeployerPreActionHooks }
