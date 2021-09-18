import { setLogLevelHook } from './setLogLevelHook'
import { checkForUpdatesHook } from './checkForUpdatesHook'
import { loadDeployerConfigHook } from './loadDeployerConfigHook'

const DeployerPreActionHooks = [loadDeployerConfigHook, setLogLevelHook, checkForUpdatesHook]

export { DeployerPreActionHooks }
