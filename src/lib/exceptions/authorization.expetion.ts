export class AuthorizationException extends Error {
  constructor() {
    super('Unauthorized');
  }
}
