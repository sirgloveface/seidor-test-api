export default class WeatherException extends Error {
  constructor({ message, status, stack }) {
    // Calling parent constructor of base Error class.
    super(message || "Ha ocurrido un error inesperado");
    // Saving class name in the property of our custom error as a shortcut.
    this.name = "WeatherException";
    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status || 500;
    this.stack = stack || "...";
  }
}
