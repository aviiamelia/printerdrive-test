class DuplicatedKey extends Error {
  constructor() {
    super("Duplicated User.");
    this.name = "Already exists in the database";
  }
}

export { DuplicatedKey };
