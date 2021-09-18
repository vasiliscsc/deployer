import fs from 'fs'
import yaml from 'js-yaml'
import { Command } from 'commander'
import { defaultDeployerConfig, deployerConfigFilePath, deployerDirectory } from '../config'
import { Logger } from '../logger'

/**
 *
 * @param thisCommand - Parent commander Command.
 * @param actionCommand - Child commander subcommand Command.
 */
export function loadDeployerConfigHook (thisCommand: Command, actionCommand: Command): void {
  // If deployer directory does not exist, one is created
  if (!fs.existsSync(deployerDirectory)) {
    fs.mkdirSync(deployerDirectory)
  }

  // If config file does not exist, one is created
  const exists = fs.existsSync(deployerConfigFilePath)
  if (!exists) {
    fs.appendFileSync(deployerConfigFilePath, yaml.dump(defaultDeployerConfig))
  }

  // Check read and write access rights to config file
  try {
    fs.accessSync(deployerConfigFilePath, fs.constants.R_OK | fs.constants.W_OK)
  } catch (e) {
    // Warn but don't abort job, use default config instead
    actionCommand.processedArgs.push(defaultDeployerConfig)
    Logger.error(
      `Error: Failed to access config file: "${deployerConfigFilePath}". Using default values.`
    )
    Logger.debug(e)
  }

  // Read and parse Deployer config file
  try {
    const deployerConfigFileText = fs.readFileSync(deployerConfigFilePath, 'utf8')
    const deployerConfig: any = yaml.load(deployerConfigFileText)

    // Find missing keys and add them to config
    let configKeysMissing = false
    Object.keys(defaultDeployerConfig).forEach((key) => {
      if (!Object.keys(deployerConfig).includes(key)) {
        deployerConfig[key] = defaultDeployerConfig[key]
        configKeysMissing = true
      }
    })

    // Find extra keys in deployerConfig and remove them
    let extraConfigKeys = false
    Object.keys(deployerConfig).forEach((key) => {
      if (!Object.keys(defaultDeployerConfig).includes(key)) {
        deployerConfig[key] = undefined
        extraConfigKeys = true
      }
    })
    if (configKeysMissing || extraConfigKeys) {
      fs.writeFileSync(deployerConfigFilePath, JSON.stringify(deployerConfig))
    }

    // Update action command processed args
    actionCommand.processedArgs.push(deployerConfig)
  } catch (e) {
    // Warn but don't abort job, use default config instead
    Logger.error('Error: Failed to parse deployer config. Using default values.')
    Logger.debug(e)
    actionCommand.processedArgs.push(defaultDeployerConfig)
  }
}
