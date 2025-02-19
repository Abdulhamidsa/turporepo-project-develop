export class AppError extends Error {
  constructor(
    public message: string,
    /** Optional HTTP status code (e.g., 400, 401, 500) */
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';

    // Fix for extending a built-in class like Error in TS
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
