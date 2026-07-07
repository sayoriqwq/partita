type SkillFamily = 'expression' | 'link' | 'maintenance' | 'orientation' | 'primitive'

interface SkillIdentityForm {
  readonly family: SkillFamily
  readonly slug: string
  readonly title: string
}

export interface InvocationSelectorForm {
  readonly doNotUseWhen: ReadonlyArray<string>
  readonly useWhen: ReadonlyArray<string>
}

interface InvocationPolicyForm {
  readonly allowImplicitInvocation: boolean
}

export interface SkillForm {
  readonly identity: SkillIdentityForm
  readonly invocation: {
    readonly policy: InvocationPolicyForm
    readonly selector: InvocationSelectorForm
  }
}

export interface SkillProjection {
  readonly identity: IdentityProjection
  readonly openAiMetadata: OpenAiMetadataProjection
  readonly skillBody: SkillBodyProjection
  readonly skillFrontmatter: SkillFrontmatterProjection
}

interface IdentityProjection {
  readonly acceptedMarkers: ReadonlyArray<string>
  readonly displayName: string
  readonly family: SkillFamily
  readonly handle: string
  readonly marker: string
  readonly slug: string
  readonly sourcePath: string
  readonly title: string
}

interface SkillFrontmatterProjection {
  readonly description: string
}

interface SkillBodyProjection {
  readonly pattern: InvocationSelectorForm
}

export interface OpenAiMetadataProjection {
  readonly interface: {
    readonly defaultPrompt: string
    readonly displayName: string
    readonly shortDescription: string
  }
  readonly policy: {
    readonly allowImplicitInvocation: boolean
  }
}

const familyHandles: Record<SkillFamily, string> = {
  expression: 'ex',
  link: 'lk',
  maintenance: 'mt',
  orientation: 'og',
  primitive: 'pm',
}

const familyMarkers: Record<SkillFamily, string> = {
  expression: '💬',
  link: '🔗',
  maintenance: '🧹',
  orientation: '🧭',
  primitive: '🎼',
}

const nonEnglishSelectorPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u

export function projectSkillForm(form: SkillForm): SkillProjection {
  const identity = projectIdentity(form.identity)
  return {
    identity,
    openAiMetadata: projectOpenAiMetadata(identity, form.invocation),
    skillBody: {
      pattern: form.invocation.selector,
    },
    skillFrontmatter: {
      description: projectDescription(form.invocation.selector),
    },
  }
}

export function validateInvocationSelectorEnglish(selector: InvocationSelectorForm): ReadonlyArray<string> {
  const issues: Array<string> = []
  for (const [index, value] of selector.useWhen.entries()) {
    if (nonEnglishSelectorPattern.test(value)) {
      issues.push(`use_when[${index}] must be English selector text`)
    }
  }
  for (const [index, value] of selector.doNotUseWhen.entries()) {
    if (nonEnglishSelectorPattern.test(value)) {
      issues.push(`do_not_use_when[${index}] must be English selector text`)
    }
  }
  return issues
}

function projectIdentity(identity: SkillIdentityForm): IdentityProjection {
  const baseMarker = familyMarkers[identity.family]
  const marker = identity.family === 'primitive'
    ? `${baseMarker} ${identity.slug}`
    : baseMarker
  const acceptedMarkers = identity.family === 'primitive'
    ? [marker]
    : [baseMarker, `${baseMarker} ${identity.slug}`]

  return {
    acceptedMarkers,
    displayName: identity.title,
    family: identity.family,
    handle: `${familyHandles[identity.family]}:${identity.slug}`,
    marker,
    slug: identity.slug,
    sourcePath: `skills/${identity.family}/${identity.slug}/`,
    title: identity.title,
  }
}

function projectOpenAiMetadata(
  identity: IdentityProjection,
  invocation: SkillForm['invocation'],
): OpenAiMetadataProjection {
  const primaryUseWhen = firstSelector(invocation.selector.useWhen)
  return {
    interface: {
      defaultPrompt: `Use ${identity.handle} when ${normalizeSelectorFragment(primaryUseWhen)}.`,
      displayName: identity.title,
      shortDescription: sentenceCase(normalizeSelectorFragment(primaryUseWhen)),
    },
    policy: {
      allowImplicitInvocation: invocation.policy.allowImplicitInvocation,
    },
  }
}

function projectDescription(selector: InvocationSelectorForm): string {
  const primaryUseWhen = normalizeSelectorFragment(firstSelector(selector.useWhen))
  const exclusions = selector.doNotUseWhen.map(normalizeSelectorFragment).join('; ')
  return `Use when ${primaryUseWhen}. Not for ${exclusions}.`
}

function firstSelector(values: ReadonlyArray<string>): string {
  const value = values[0]
  if (value === undefined || value.trim() === '') {
    throw new Error('invocation selector must include at least one use_when entry')
  }
  return value
}

function normalizeSelectorFragment(value: string): string {
  return value.trim().replace(/[.。]+$/u, '')
}

function sentenceCase(value: string): string {
  const normalized = normalizeSelectorFragment(value)
  return `${normalized.slice(0, 1).toUpperCase()}${normalized.slice(1)}`
}
