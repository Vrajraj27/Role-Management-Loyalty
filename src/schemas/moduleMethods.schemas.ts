import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ModuleMethodDocument = HydratedDocument<ModuleMethod>;

@Schema({
  timestamps: true,
})
export class ModuleMethod {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  userId: string;

  @Prop()
  moduleIdsIn: [MongooseSchema.Types.ObjectId];

  @Prop()
  moduleIdsNotIn: [MongooseSchema.Types.ObjectId];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'organizations' })
  organizationId: string;

  @Prop({ default: true })
  isActive: boolean = false;

  @Prop()
  method: string;

  @Prop({ default: false })
  isGlobally: boolean;
}

export const ModuleMethodSchema = SchemaFactory.createForClass(ModuleMethod);
