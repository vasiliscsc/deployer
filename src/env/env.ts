export function getLogLevel (): string {
  if (process.env.DEPLOYER_LOG_LEVEL === undefined) {
    throw new Error('DEPLOYER_LOG_LEVEL is undefined.')
  }
  return process.env.DEPLOYER_LOG_LEVEL
}
export function getName (): string {
  if (process.env.DEPLOYER_NAME === undefined) {
    throw new Error('DEPLOYER_NAME is undefined.')
  }
  return process.env.DEPLOYER_NAME
}
export function getCheckForUpdates (): boolean {
  if (process.env.DEPLOYER_CHECK_FOR_UPDATES === undefined) {
    throw new Error('DEPLOYER_CHECK_FOR_UPDATES is undefined.')
  }
  return process.env.DEPLOYER_CHECK_FOR_UPDATES.toUpperCase() === 'TRUE'
}
