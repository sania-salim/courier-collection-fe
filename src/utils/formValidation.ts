type FieldErrors<T extends string> = Partial<Record<T, string>>;

export const validateRequired = (value: string, label: string): string | undefined => {
    if (!value.trim()) return `${label} is required`;
    return undefined;
};

export const validateNonNegativeInt = (
    value: string,
    label: string,
    required = false
): string | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return required ? `${label} is required` : undefined;
    const num = Number(trimmed);
    if (!Number.isInteger(num) || num < 0) {
        return `${label} must be a whole number ≥ 0`;
    }
    return undefined;
};

export type { FieldErrors };
