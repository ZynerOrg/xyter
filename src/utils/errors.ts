class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class GuildNotFoundError extends CustomError {
  constructor() {
    super(
      "Guild not found: You are not part of a guild. Join a guild to embark on this adventure."
    );
  }
}

class UserNotFoundError extends CustomError {
  constructor() {
    super(
      "User not found: We couldn't retrieve your user information. Please try again or contact support for assistance."
    );
  }
}

class ChannelNotFoundError extends CustomError {
  constructor() {
    super(
      "Channel not found: We couldn't retrieve the channel. Please try again or contact support for assistance."
    );
  }
}

export { GuildNotFoundError, UserNotFoundError, ChannelNotFoundError };
