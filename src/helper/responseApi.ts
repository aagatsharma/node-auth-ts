export const successResponse = (
  message: string,
  results: any,
  statusCode: number
) => {
  return {
    message,
    error: false,
    code: statusCode,
    results,
  };
};

export const validationResponse = (errors: any) => {
  return {
    message: "Validation error",
    error: true,
    code: 422,
    errors,
  };
};

export const errorResponse = (message: string, statusCode: number) => {
  const codes = [400, 401, 404, 403, 422, 500];
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;
  return {
    message,
    error: true,
    code: statusCode,
  };
};
