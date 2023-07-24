import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: true,
})
export class Role {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  userId: string;

  @Prop()
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'organizations' })
  organizationId: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
