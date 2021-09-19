import fs from 'fs'
import yaml from 'js-yaml'
import { DeployerConfig } from './type'
import { deployerConfigFilePath } from './constants'

export function readDeployerConfig (): DeployerConfig {
  const deployerConfigFileText = fs.readFileSync(deployerConfigFilePath, 'utf8')
  const deployerConfig: any = yaml.load(deployerConfigFileText)
  return deployerConfig
}
