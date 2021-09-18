import os from 'os'
import path from 'path'
import { castStringToLogLevelString } from '../logger'
import { DeployerConfig } from './type'
import config from './defaultDeployerConfig.json'

const deployerDirectory = path.resolve(os.homedir(), '.deployer')
const deployerConfigFileName = 'config.yml'
const deployerConfigFilePath = path.resolve(deployerDirectory, deployerConfigFileName)
const defaultDeployerConfig: DeployerConfig = {
  ...config,
  logLevel: castStringToLogLevelString(config.logLevel)
}

export { defaultDeployerConfig, deployerDirectory, deployerConfigFileName, deployerConfigFilePath }
