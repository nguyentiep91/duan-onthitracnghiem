export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type StringRule = {
  min?: number;
  max?: number;
  email?: boolean;
  allowed?: readonly string[];
};

const isEmail = (value: string) => /.+@.+\..+/.test(value);

export function validateString(value: unknown, field: string, rule: StringRule = {}): ValidationResult<string> {
  if (typeof value !== 'string') {
    return { success: false, error: `${field} không hợp lệ.` };
  }

  const normalized = value.trim();

  if (rule.min && normalized.length < rule.min) {
    return { success: false, error: `${field} phải có ít nhất ${rule.min} ký tự.` };
  }

  if (rule.max && normalized.length > rule.max) {
    return { success: false, error: `${field} không được vượt quá ${rule.max} ký tự.` };
  }

  if (rule.email && !isEmail(normalized)) {
    return { success: false, error: `${field} phải là email hợp lệ.` };
  }

  if (rule.allowed && !rule.allowed.includes(normalized)) {
    return { success: false, error: `${field} không nằm trong tập giá trị cho phép.` };
  }

  return { success: true, data: normalized };
}

export function validateBoolean(value: unknown, field: string): ValidationResult<boolean> {
  if (typeof value === 'boolean') {
    return { success: true, data: value };
  }

  if (value === 'true' || value === 'on' || value === '1') {
    return { success: true, data: true };
  }

  if (value === 'false' || value === '0' || value === null) {
    return { success: true, data: false };
  }

  return { success: false, error: `${field} không hợp lệ.` };
}
