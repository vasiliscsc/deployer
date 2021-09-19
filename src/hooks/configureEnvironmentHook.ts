import fs from 'fs'
import yaml from 'js-yaml'
import { Command } from 'commander'
import { defaultDeployerConfig, deployerConfigFilePath, deployerDirectory } from '../config'
import { Logger } from '../logger'
import { DeployerConfig } from '../config/type'

/**
 * Loads the global configuration file. If one does not exist or is incomplete, the file is created.
 *
 * @remarks
 * The global configuration file is stored at `$HOME/.deployer/config.yml`. If the directory or file do not exist,
 * they are created at runtime.
 *
 * @see {@link DeployerConfig}
 *
 * @returns A JSON object containing the values of the global configuration file.
 */
function loadDeployerConfig (): DeployerConfig {
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
    // Warn but don't abort job, return default config instead
    Logger.error(
      `Error: Failed to access config file: "${deployerConfigFilePath}". Using default values.`
    )
    Logger.debug(e)
    return defaultDeployerConfig
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

    return deployerConfig
  } catch (e) {
    // Warn but don't abort job, return default config instead
    Logger.error('Error: Failed to parse deployer config. Using default values.')
    Logger.debug(e)
    return defaultDeployerConfig
  }
}

/**
 * Sets the environment variables that configure deployer.
 *
 * @remarks
 * The environment variables used by deployer are all prefixed with 'DEPLOYER_'.
 * The configuration is loaded with the priority of: `~./deployer/config.yml < cwd .env < CLI options`.
 * The global configuration file is guaranteed to exist.
 *
 * @param thisCommand - Parent commander Command.
 * @param actionCommand - Child commander subcommand Command.
 */
export function configureEnvironmentHook (thisCommand: Command, actionCommand: Command): void {
  const deployerConfig: DeployerConfig = loadDeployerConfig()
  const opts = thisCommand.opts()
  Object.keys(opts).forEach((key) => {
    deployerConfig[key] = opts[key]
  })
  const env: any = {}
  Object.keys(deployerConfig).forEach((key) => {
    return (env[`DEPLOYER_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`] = deployerConfig[key])
  })
  Object.keys(env).forEach((key) => {
    process.env[key] = env[key]
  })
  Logger.debug('Compiled environment:', env)
}
