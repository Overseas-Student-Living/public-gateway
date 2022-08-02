import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";
import { Context } from "../../../types/utils";
import {
  CreatePropertyTermInput,
  CreatePropertyTermPayload,
  DeletePropertyTermInput,
  PropertyTerm,
} from "../schemas/terms";
import { ResultPayload } from "../../common";
import { encodeNodeId } from "../../../utils";
import { AWSS3 } from "../../../s3";
import paymentRpc = require("../../../rpc/payment");
import { createPropertyTermRule, deletePropertyTermRule } from "../perm";

@Resolver(() => PropertyTerm)
export class PropertyTermResolver {
  @Mutation(() => CreatePropertyTermPayload)
  @Authorized(createPropertyTermRule)
  async createPropertyTerm(
    @Arg("input", () => CreatePropertyTermInput, { nullable: false })
    input: CreatePropertyTermInput,
    @Ctx() context: Context
  ) {
    // 是否校验property状态
    const { createReadStream, filename, mimetype } = await input.file;
    // if (!/\.(png|pdf|docx|PNG|PDF|DOCX)$/.test(filename)) {
    //   throw new GateWayError({
    //     code: 'INVALID_PROPERTY_TERMS_FILE_TYPE',
    //     message: 'INVALID_PROPERTY_TERMS_FILE_TYPE',
    //   });
    // }
    const s3Client = new AWSS3({
      accessKeyId: process.env.AWS_S3_STORM_FRONTEND_KEY,
      secretAccessKey: process.env.AWS_S3_STORM_FRONTEND_SECRET,
      region: process.env.AWS_S3_STORM_FRONTEND_REGION,
      destinationBucketName: process.env.AWS_S3_STORM_FRONTEND_BUCKET,
      folder: process.env.AWS_S3_STORM_FRONTEND_FOLDER,
    });
    const s3Obj = await s3Client.upload(createReadStream(), filename, mimetype);
    const url = `${process.env.AWS_S3_STORM_FRONTEND_DOMAIN}${s3Obj.Key}`;

    const result = await paymentRpc.createTermsAndConditions(
      context.rpc,
      input.propertyId,
      input.title,
      url,
      input.validFrom,
      input.validTill
    );

    return { propertyTerm: result };
  }

  @Mutation(() => ResultPayload)
  @Authorized(deletePropertyTermRule)
  async deletePropertyTerm(
    @Arg("input", () => DeletePropertyTermInput, {
      nullable: false,
    })
    input: DeletePropertyTermInput,
    @Ctx() context: Context
  ) {
    await paymentRpc.deleteTermsAndConditions(context.rpc, input.id);
    return { result: true };
  }

  @FieldResolver()
  async id(@Root() root: PropertyTerm) {
    return encodeNodeId("PropertyTerm", root.id);
  }
}
