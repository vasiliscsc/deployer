export default class SemVer {
  private static readonly rx =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/m

  public readonly value: string
  public readonly major: number
  public readonly minor: number
  public readonly patch: number
  public readonly preRelease: string | undefined
  public readonly build: string | undefined

  /**
   * Constructor for the SemVer class. SemVer class exposes operations over
   * @param value - SemVer string value.
   *
   * @throws Will throw an error if the value does not match SemVer specification.
   *
   * @returns SemVer instance.
   */
  constructor (value: SemVer | string) {
    if (value instanceof SemVer) {
      this.value = value.value
      this.major = value.major
      this.minor = value.minor
      this.patch = value.patch
      this.preRelease = value.preRelease
      this.build = value.build
    } else {
      if (!SemVer.validator(value)) {
        throw new Error(`Provided string does not match SemVer specification: ${value}`)
      }
      const rV = SemVer.rx.exec(value)
      this.value = value
      this.major = rV !== null ? parseInt(rV[1]) : -1
      this.minor = rV !== null ? parseInt(rV[2]) : -1
      this.patch = rV !== null ? parseInt(rV[3]) : -1
      this.preRelease = rV !== null ? rV[4] : undefined
      this.build = rV !== null ? rV[5] : undefined
    }
  }

  /**
   * Function for asserting equality with another SemVer.
   *
   * @param semver - SemVer to compare against.
   * @returns True if current SemVer is equal to provided SemVer.
   */
  isEqualTo (semver: SemVer | string): boolean {
    if (typeof semver === 'string' && !SemVer.validator(semver)) return false
    return SemVer.comparator(this.value, semver) === 0
  }

  /**
   * Function for asserting whether current SemVer is greater than provided SemVer.
   *
   * @param semver - SemVer to compare against.
   * @returns True if current SemVer is greater than provided SemVer.
   */
  isGreaterThan (semver: SemVer | string): boolean {
    if (typeof semver === 'string' && !SemVer.validator(semver)) return false
    return SemVer.comparator(this.value, semver) === 1
  }

  /**
   * Function for asserting whether current SemVer is smaller than provided SemVer.
   *
   * @param semver - SemVer to compare against.
   * @returns True if current SemVer is smaller than provided SemVer.
   */
  isSmallerThan (semver: SemVer | string): boolean {
    if (typeof semver === 'string' && !SemVer.validator(semver)) return false
    return SemVer.comparator(this.value, semver) === -1
  }

  /**
   * Function for asserting whether current SemVer is equal to or greater than provided SemVer.
   *
   * @param semver - SemVer to compare against.
   * @returns True if current SemVer is equal to or greater than provided SemVer.
   */
  isEqualToOrGreaterThan (semver: SemVer | string): boolean {
    if (typeof semver === 'string' && !SemVer.validator(semver)) return false
    return SemVer.comparator(this.value, semver) >= 0
  }

  /**
   * Function for asserting whether current SemVer is equal to or smaller than provided SemVer.
   *
   * @param semver - SemVer to compare against.
   * @returns True if current SemVer is equal to or smaller than provided SemVer.
   */
  isEqualToOrSmallerThan (semver: SemVer | string): boolean {
    if (typeof semver === 'string' && !SemVer.validator(semver)) return false
    return SemVer.comparator(this.value, semver) <= 0
  }

  /**
   * A function for validating that the input is valid SemVer.
   *
   * @remarks
   * This function uses the official regex provided by SemVer.
   *
   * @see {@link https://regex101.com/r/vkijKf/1/}
   * @see {@link https://semver.org/}
   *
   * @param semverString - A string matching SemVer scheme.
   * @returns True if the provided string matches the SemVer pattern.
   */
  static validator (semverString: string): boolean {
    return SemVer.rx.test(semverString)
  }

  /**
   * Comparator for SemVer strings.
   *
   * @remarks
   * This is a complete implementation of the SemVer precedence specification.
   *
   * @see {@link https://semver.org/#spec-item-11}
   * @see {@link https://regex101.com/r/vkijKf/1/}
   *
   * @param a - First semver string.
   * @param b - Second semver string.
   *
   * @returns 1 if `a>b`, -1 if `a<b` and 0 if `a===b`
   */
  static comparator (a: SemVer | string, b: SemVer | string): 1 | 0 | -1 {
    // Precedence MUST be calculated by separating the version into major, minor, patch and pre-release identifiers in that order (Build metadata does not figure into precedence).
    const rA = SemVer.rx.exec(a instanceof SemVer ? a.value : a)
    const rB = SemVer.rx.exec(b instanceof SemVer ? b.value : b)
    if (rA === null || rB === null) {
      return 0
    }

    // Precedence is determined by the first difference when comparing each of these identifiers from left to right as follows: Major, minor, and patch versions are always compared numerically.
    for (let i = 1; i < 4; i++) {
      if (rA[i] > rB[i]) return 1
      if (rA[i] < rB[i]) return -1
    }

    // When major, minor, and patch are equal, a pre-release version has lower precedence than a normal version:
    const preReleaseA = rA[4]
    const preReleaseB = rB[4]
    if (preReleaseA === undefined && preReleaseB === undefined) return 0
    if (preReleaseA === undefined && preReleaseB !== undefined) return 1
    if (preReleaseA !== undefined && preReleaseB === undefined) return -1

    // Precedence for two pre-release versions with the same major, minor, and patch version MUST be determined by comparing each dot separated identifier from left to right until a difference is found as follows
    const identifiersA = preReleaseA.split('.')
    const identifiersB = preReleaseB.split('.')
    for (let i = 0; i < Math.max(identifiersA.length, identifiersB.length); i++) {
      // A larger set of pre-release fields has a higher precedence than a smaller set, if all of the preceding identifiers are equal.
      if (identifiersA[i] !== undefined && identifiersB[i] === undefined) return 1
      if (identifiersA[i] === undefined && identifiersB[i] !== undefined) return -1

      // Numeric identifiers always have lower precedence than non-numeric identifiers
      const numIdA = parseInt(identifiersA[i])
      const numIdB = parseInt(identifiersB[i])
      if (isNaN(numIdA) && !isNaN(numIdB)) return 1
      if (!isNaN(numIdA) && isNaN(numIdB)) return -1

      // Identifiers consisting of only digits are compared numerically
      if (!isNaN(numIdA) && !isNaN(numIdB)) {
        if (numIdA > numIdB) return 1
        if (numIdA < numIdB) return -1
      }

      // Identifiers with letters or hyphens are compared lexically in ASCII sort order.
      if (preReleaseA > preReleaseB) return 1
      if (preReleaseA < preReleaseB) return -1
    }

    return 0
  }
}
