import { DeployerCommand } from '../../types'
import inspect from './inspect'
import reset from './reset'

const DeployerCommands: DeployerCommand[] = [inspect, reset]

export default DeployerCommands
