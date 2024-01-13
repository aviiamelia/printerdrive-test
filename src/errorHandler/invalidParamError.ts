class InvalidParamError extends Error {
  public readonly field: string;

  constructor(paramName: string, msg?: string) {
    super(msg ?? `Invalid param: ${paramName}`);
    this.name = "InvalidParamError";
    this.field = paramName;
  }
}
export { InvalidParamError };
