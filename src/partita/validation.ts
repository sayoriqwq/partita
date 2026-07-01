export interface ValidationIssue {
  readonly code: string
  readonly message: string
  readonly path?: string
}

export interface ValidationReport {
  readonly ok: boolean
  readonly issues: ReadonlyArray<ValidationIssue>
}

export function reportFromIssues(issues: ReadonlyArray<ValidationIssue>): ValidationReport {
  return {
    issues,
    ok: issues.length === 0,
  }
}

export function issue(code: string, message: string, path?: string): ValidationIssue {
  return path ? { code, message, path } : { code, message }
}
