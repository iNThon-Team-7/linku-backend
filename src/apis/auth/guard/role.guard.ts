import {
  CanActivate,
  Injectable,
  ExecutionContext,
  mixin,
  Type,
} from '@nestjs/common';
import { Role } from 'src/lib/enums';
import { PermissionException } from 'src/lib/exceptions/permission.exception';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';

export type RoleInfo = {
  userId: number;
  minimumPermission: Role;
  currentPermission?: Role;
};

export const RoleGuard = (minimumPermission: Role): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const request = ctx.switchToHttp().getRequest();
      const requestUser = request?.user;

      const roleInfo: RoleInfo = { userId: requestUser?.id, minimumPermission };

      if (!roleInfo.userId) {
        throw new PermissionException('Invalid User Id', roleInfo);
      }

      const user = await this.userRepository.findOne({
        where: { id: roleInfo.userId },
      });

      if (!user) {
        throw new PermissionException('Invalid User Info', roleInfo);
      }

      roleInfo.currentPermission = user.role;
      if (
        Object.keys(Role).indexOf(roleInfo.currentPermission) <
        Object.keys(Role).indexOf(roleInfo.minimumPermission)
      ) {
        throw new PermissionException('Insufficient Permission', roleInfo);
      }

      console.log(
        roleInfo,
        Object.keys(Role),
        Object.keys(Role).indexOf(roleInfo.currentPermission),
        Object.keys(Role).indexOf(roleInfo.minimumPermission),
      );
      return true;
    }
  }

  return mixin(RoleGuardMixin);
};
