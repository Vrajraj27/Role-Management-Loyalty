import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ModuleDocument = HydratedDocument<Modules>;

@Schema({
  timestamps: true,
})
export class Modules {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  userId: string;

  @Prop()
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'organizations' })
  organizationId: string;

  @Prop({ default: false })
  isGlobally: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Modules);
