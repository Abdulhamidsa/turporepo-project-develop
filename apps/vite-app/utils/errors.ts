export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';

    // Fix for extending a built-in class like Error in TS
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
