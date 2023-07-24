import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleSchema, Modules } from './module.schemas';
import { ModuleMethod, ModuleMethodDocument, ModuleMethodSchema } from './moduleMethods.schemas';
import { Organization, OrganizationSchema } from './organization.schemas';
import { Permission, PermissionSchema } from './permission.schemas';
import { RoleSchema, Role } from './role.schemas';
import { User, UserSchema } from './user.schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: Modules.name, schema: ModuleSchema },
      { name: ModuleMethod.name, schema: ModuleMethodSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: ModuleMethod.name, schema: ModuleMethodSchema },
    ]),
  ],
})
export class SchemasModule {}
