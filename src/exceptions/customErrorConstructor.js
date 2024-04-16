//create custom class as a sub-class of Error class
export class ErrorWithStatusCode extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
