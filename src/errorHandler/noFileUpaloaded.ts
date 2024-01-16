class NoFileUpload extends Error {
  constructor() {
    super("No file Founde");
    this.name = "No file Found";
  }
}

export { NoFileUpload };
