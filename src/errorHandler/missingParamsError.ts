class MissingParamError extends Error {
  public readonly field: string;

  constructor(paramName: string, msg?: string) {
    super(msg ?? `Missing param: ${paramName}`);
    this.name = "MissingParamError";
    this.field = paramName;
  }
}

export { MissingParamError };
