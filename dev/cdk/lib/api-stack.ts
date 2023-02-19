import {Construct} from 'constructs';
import {DYNAMO_TABLE_NAME, OUTPUT_KEYS, SITE_NAME} from "./constants";
import {ARecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {TStack, TStackProps} from "./TStack";
import {Distribution, SecurityPolicyProtocol} from "aws-cdk-lib/aws-cloudfront";
import {CloudFrontTarget} from "aws-cdk-lib/aws-route53-targets";
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"

export class ApiStack extends TStack {
  region: string;
  account: string;
  tableArn: string;
  public apiUrl: string;

  constructor(scope: Construct, id: string, props: TStackProps) {
    super(scope, id, props);
    this.region = props.env.region
    this.account = props?.env?.account ?? process.env.DEFAULT_CDK_ACCOUNT!
    this.tableArn = `arn:aws:dynamodb:${props?.env?.region ?? process.env.AWS_REGION}:${this.account}:table/${DYNAMO_TABLE_NAME}`
    this.apiUrl = `api.${SITE_NAME[1]}`

    const zone = HostedZone.fromLookup(this, 'ApiHostedZone', {
      domainName: SITE_NAME[1]
    })

    const certificate = new Certificate(this, 'AiLogApiCertificate', {
      domainName: this.apiUrl,
      validation: CertificateValidation.fromDns(zone),
    });

    // CloudFront distribution
    const distribution = new Distribution(this, 'AiLogSiteDistribution', {
      certificate: certificate,
      domainNames: [this.apiUrl],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new origins.HttpOrigin(this.import(OUTPUT_KEYS.API_LAMBDA_URL))
      }
    })

    new ARecord(this, 'ApiARecord', {
      zone,
      recordName: this.apiUrl,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution))
    })

  }
}
