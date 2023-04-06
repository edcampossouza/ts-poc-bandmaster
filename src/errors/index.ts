function invalidCredentialsError(message?: string): Error {
  return {
    name: "InvalidCredentialsError",
    message: message || "Email or password are incorrect",
  };
}
function unauthorizedError(): Error {
  return {
    name: "UnauthorizedError",
    message: "You must be signed in to continue",
  };
}
function duplicatedEmailError(email: string): Error {
  return {
    name: "DuplicatedEmailError",
    message: `There is already a user with the given email: ${email}`,
  };
}
function dateError(message: string): Error {
  return {
    name: "DateError",
    message,
  };
}
function conflictError(message: string): Error {
  return {
    name: "ConflictError",
    message,
  };
}
function notFoundError(message: string): Error {
  return {
    name: "NotFoundError",
    message,
  };
}
export default {
  invalidCredentialsError,
  unauthorizedError,
  duplicatedEmailError,
  dateError,
  conflictError,
  notFoundError,
};
