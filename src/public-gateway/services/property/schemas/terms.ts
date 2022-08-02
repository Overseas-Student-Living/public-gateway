import { GraphQLUpload } from "graphql-tools";
import { Upload } from "../../common";
import { Directive, Field, ID, InputType, ObjectType } from "type-graphql";
import { resolvers as scalar } from "../../../scalars";
import { PropertyTermStatus } from "../enum";

// Object

@ObjectType()
export class PropertyTerm {
  @Field(() => ID, { nullable: false })
  id: string;
  @Field(() => String, { nullable: false })
  title: string;
  @Field(() => String, { nullable: false })
  url: string;
  @Field(() => scalar.Date)
  validFrom: Date;
  @Field(() => scalar.Date)
  validTill: Date;
  @Field(() => String)
  fileName: string;
  @Field(() => PropertyTermStatus, { nullable: true })
  status: PropertyTermStatus;
  // @Field(() => scalar.Datetime)
  // createdAt: Date;
  // @Field(() => scalar.Datetime)
  // updatedAt: Date;
}

@ObjectType()
export class CreatePropertyTermPayload {
  @Field(() => PropertyTerm, { nullable: true })
  propertyTerm: PropertyTerm;
}

@InputType()
export class CreatePropertyTermInput {
  @Directive('@decodeID(type: "Property", required: true)')
  @Field(() => ID, { nullable: false })
  propertyId: string;

  @Field(() => String, { nullable: false })
  title: string;

  @Field(() => scalar.Date, { nullable: false })
  validFrom: Date;

  @Field(() => scalar.Date)
  validTill: Date;

  @Field(() => GraphQLUpload, { nullable: false })
  file: Upload;
}

@InputType()
export class DeletePropertyTermInput {
  @Directive('@decodeID(type: "PropertyTerm", required: true)')
  @Field(() => ID, { nullable: false })
  id: string;
}
