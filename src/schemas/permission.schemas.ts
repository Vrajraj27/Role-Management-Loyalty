import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({
  timestamps: true,
})
export class Permission {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'roles' })
  roleId: string;

  @Prop()
  name: string;

  @Prop()
  moduleName: string;

  @Prop()
  permissions: MongooseSchema.Types.Array;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
