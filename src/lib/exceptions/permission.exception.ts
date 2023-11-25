import { RoleInfo } from 'src/apis/auth/guard/role.guard';

export class PermissionException extends Error {
  constructor(cause?: string, public info?: RoleInfo) {
    super(`User permission error occurred: ${cause}`);
  }
}
