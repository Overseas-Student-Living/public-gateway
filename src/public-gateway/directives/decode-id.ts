import { SchemaDirectiveVisitor } from "graphql-tools";

import {
  GraphQLScalarType,
  isWrappingType,
  isNamedType,
  GraphQLNonNull
} from "graphql";
import { decodeNodeIdForType } from "../utils";

export class DecodeIDDirective extends SchemaDirectiveVisitor {
  visitInputFieldDefinition(field: any) {
    this.wrapType(field);
  }

  wrapType(field: any) {
    const required = this.args.required;
    field.type = required
      ? new GraphQLNonNull(new DecodedIdType(field.type, this.args.type))
      : new DecodedIdType(field.type, this.args.type);
    const typeMap = this.schema.getTypeMap();
    let type = field.type;
    if (isWrappingType(type)) {
      type = type.ofType;
    }
    if (isNamedType(type) && !typeMap[type.name]) {
      typeMap[type.name] = type;
    }
  }
}

class DecodedIdType extends GraphQLScalarType {
  constructor(type, idType) {
    super({
      name: `Decoded${idType}ID`,
      serialize(value) {
        return type.serialize(value);
      },
      parseValue(value) {
        return decodeNodeIdForType(value, idType);
      }
    });
  }
}
