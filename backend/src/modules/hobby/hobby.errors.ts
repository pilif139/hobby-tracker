export class HobbyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HobbyNotFoundError extends HobbyError {
  constructor() {
    super('Hobby not found');
  }
}

export class HobbyAlreadyInProfileError extends HobbyError {
  constructor() {
    super('Hobby already in profile');
  }
}

export class HobbyNotInProfileError extends HobbyError {
  constructor() {
    super('Hobby not in profile');
  }
}
