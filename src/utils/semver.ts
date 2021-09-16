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
export function validator (semverString: string): boolean {
  const reg =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm
  return reg.test(semverString)
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
export function comparator (a: string, b: string): 1 | 0 | -1 {
  // Precedence MUST be calculated by separating the version into major, minor, patch and pre-release identifiers in that order (Build metadata does not figure into precedence).
  const rx =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/m
  const rA = rx.exec(a)
  const rB = rx.exec(b)

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
