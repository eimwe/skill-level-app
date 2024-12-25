import type {
  IValidationField,
  IValidationResult,
  IValidationRule,
} from "@/types";

export const validateInputs = (
  fields: IValidationField[]
): IValidationResult => {
  for (const field of fields) {
    const { value, rules, fieldName } = field;

    for (const rule of rules) {
      const { test, errorMessage } = rule;

      if (!test(value)) {
        return { isValid: false, error: `${fieldName}: ${errorMessage}` };
      }
    }
  }
  return { isValid: true, error: null };
};

export const isNotEmpty: IValidationRule = {
  test: (value) => value.trim() !== "",
  errorMessage: "This field cannot be empty",
};

export const isValidEmail: IValidationRule = {
  test: (value) => /\S+@\S+\.\S+/.test(value),
  errorMessage: "Invalid email format",
};
