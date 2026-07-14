export class PartitaError extends Error {
  readonly _tag = 'PartitaError'

  constructor(message: string) {
    super(message)
    this.name = 'PartitaError'
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof PartitaError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { readonly message?: unknown }).message
    if (typeof message === 'string') {
      return message
    }
  }
  return String(error)
}
