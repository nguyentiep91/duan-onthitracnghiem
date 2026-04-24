type ParseSuccess<T> = { success: true; data: T };
type ParseFail = { success: false; error: { issues: { path: string[]; message: string }[] } };
type ParseResult<T> = ParseSuccess<T> | ParseFail;

type Schema<T> = {
  safeParse: (value: unknown) => ParseResult<T>;
};

class ZString implements Schema<string> {
  private minLength?: number;
  private maxLength?: number;
  private mustEmail = false;

  min(length: number) {
    this.minLength = length;
    return this;
  }

  max(length: number) {
    this.maxLength = length;
    return this;
  }

  email() {
    this.mustEmail = true;
    return this;
  }

  safeParse(value: unknown): ParseResult<string> {
    if (typeof value !== 'string') {
      return { success: false, error: { issues: [{ path: [], message: 'Expected string' }] } };
    }

    const normalized = value.trim();

    if (this.minLength && normalized.length < this.minLength) {
      return { success: false, error: { issues: [{ path: [], message: `Must be at least ${this.minLength} characters` }] } };
    }

    if (this.maxLength && normalized.length > this.maxLength) {
      return { success: false, error: { issues: [{ path: [], message: `Must be at most ${this.maxLength} characters` }] } };
    }

    if (this.mustEmail && !/.+@.+\..+/.test(normalized)) {
      return { success: false, error: { issues: [{ path: [], message: 'Invalid email' }] } };
    }

    return { success: true, data: normalized };
  }
}

class ZEnum<T extends readonly string[]> implements Schema<T[number]> {
  constructor(private values: T) {}

  safeParse(value: unknown): ParseResult<T[number]> {
    if (typeof value !== 'string' || !this.values.includes(value)) {
      return { success: false, error: { issues: [{ path: [], message: `Expected one of: ${this.values.join(', ')}` }] } };
    }

    return { success: true, data: value as T[number] };
  }
}

class ZObject<T extends Record<string, Schema<unknown>>> implements Schema<{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }> {
  constructor(private shape: T) {}

  safeParse(value: unknown): ParseResult<{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }> {
    if (typeof value !== 'object' || value === null) {
      return { success: false, error: { issues: [{ path: [], message: 'Expected object' }] } };
    }

    const issues: { path: string[]; message: string }[] = [];
    const parsed: Record<string, unknown> = {};

    for (const [key, schema] of Object.entries(this.shape)) {
      const item = schema.safeParse((value as Record<string, unknown>)[key]);
      if (!item.success) {
        issues.push(...item.error.issues.map((issue) => ({ path: [key, ...issue.path], message: issue.message })));
      } else {
        parsed[key] = item.data;
      }
    }

    if (issues.length > 0) {
      return { success: false, error: { issues } };
    }

    return { success: true, data: parsed as { [K in keyof T]: T[K] extends Schema<infer U> ? U : never } };
  }
}

export const z = {
  string: () => new ZString(),
  enum: <T extends readonly string[]>(values: T) => new ZEnum(values),
  object: <T extends Record<string, Schema<unknown>>>(shape: T) => new ZObject(shape)
};
