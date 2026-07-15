import * as Data from 'effect/Data'

export class PartitaError extends Data.Error<{
  readonly message: string
}> {
  readonly _tag = 'PartitaError'

  constructor(message: string) {
    super({ message })
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
