import awsSdk = require("aws-sdk");
import v4 = require("uuid/v4");
import { ManagedUpload } from "aws-sdk/clients/s3";

// example
// import {AWSS3} from "../../s3";
//
// const bulkUpdateS3 = new AWSS3({
//   region: process.env.AWS_S3_REGION,
//   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
//   destinationBucketName: process.env.AWS_S3_OPPORTUNITY_DOCUMENT_BUCKET,
//   folder: process.env.AWS_S3_BULK_UPDATE_OPP_FOLDER,
// });

interface AWSS3Config {
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  destinationBucketName: string;
  folder?: string;
  filenameTransform?: (filename?: string) => string;
}

function uuidFilenameTransform(filename = "") {
  return `${v4()}-${filename}`;
}

export class AWSS3 {
  public config: AWSS3Config;
  private s3: awsSdk.S3;
  private readonly folder: string;
  private readonly filenameTransform: (filename?: string) => string;

  constructor(config: AWSS3Config) {
    awsSdk.config = new awsSdk.Config();
    awsSdk.config.update({
      region: config.region || process.env.AWS_S3_REGION,
      accessKeyId: config.accessKeyId || process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey:
        config.secretAccessKey || process.env.AWS_S3_SECRET_ACCESS_KEY
    });
    this.filenameTransform = config.filenameTransform || uuidFilenameTransform;
    this.s3 = new awsSdk.S3();
    this.config = config;
    this.folder = this.config.folder || "default";
  }

  public async upload(
    readStream,
    filename,
    mimetype
  ): Promise<ManagedUpload.SendData> {
    // @ts-ignore
    const transformedFilename = this.filenameTransform(filename);
    return await this.s3
      .upload({
        Bucket: this.config.destinationBucketName,
        Body: readStream,
        Key: `${this.folder}/${transformedFilename}`,
        ContentType: mimetype
      })
      .promise();
  }

  public async download(fileKey) {
    const options = {
      Bucket: this.config.destinationBucketName,
      Key: `${this.folder}/${fileKey}`
    };
    const s3stream = this.s3.getObject(options).createReadStream();

    s3stream.on("error", function error(err) {
      return {
        success: false,
        error: err
      };
    });
    return s3stream;
  }
}
