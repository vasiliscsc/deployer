import { DeployerCommand } from '../../types'
import inspect from './inspect'
import reset from './reset'
import set from './set'
import unset from './unset'

const DeployerCommands: DeployerCommand[] = [inspect, reset, set, unset]

export default DeployerCommands
