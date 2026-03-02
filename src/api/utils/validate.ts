import { ZodSchema } from "zod";
import { ApiError } from "./api-error";

export async function validate<T>(
  schema: ZodSchema<T>,
  body: unknown
): Promise<T> {

  const result =
    schema.safeParse(body);

  if (!result.success) {

    const errors =
      result.error.flatten()
        .fieldErrors;

    throw new ApiError(
      400,
      "Validation error",
      errors
    );
  }

  return result.data;
}