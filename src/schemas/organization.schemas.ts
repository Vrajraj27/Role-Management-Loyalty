import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema({
  timestamps: true,
})
export class Organization {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  userId: string;

  @Prop({ type: String, unique: true, required: true, index: true })
  organizationId: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
