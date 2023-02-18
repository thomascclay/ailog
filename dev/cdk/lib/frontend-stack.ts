import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from "aws-cdk-lib/aws-iam";
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import {CfnOutput, Duration} from "aws-cdk-lib";
import {CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";

type FrontendStackProps = cdk.StackProps & {
  domainName: string
  siteSubDomain: string
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: FrontendStackProps) {
    super(scope, id, props);
    const zone = route53.HostedZone.fromLookup(this, 'Zone', {domainName: props.domainName});
    const siteDomain = props.siteSubDomain + '.' + props.domainName;
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for ${id}`
    });

    // Create an S3 bucket to store the static assets
    const siteBucket = new s3.Bucket(this, 'AilogUiSiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Grant access to cloudfront
    siteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [siteBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }));
    new CfnOutput(this, 'Bucket', {value: siteBucket.bucketName});

    // TLS certificate
    const certificate = new acm.Certificate(this, 'AiLogSiteCertificate', {
      domainName: siteDomain,
      validation: CertificateValidation.fromDns(zone),
    });
    new CfnOutput(this, 'Certificate', {value: certificate.certificateArn});

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'AiLogSiteDistribution', {
      certificate: certificate,
      defaultRootObject: "index.html",
      domainNames: [siteDomain],
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: '/error.html',
          ttl: Duration.minutes(30),
        }
      ],
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, {originAccessIdentity: cloudfrontOAI}),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
    })

    new CfnOutput(this, 'DistributionId', {value: distribution.distributionId});

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, 'AilogUiRecord', {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });

    // Deploy the static assets to the S3 bucket
    new s3deploy.BucketDeployment(this, 'AilogUiBucketDeployment', {
      sources: [s3deploy.Source.asset('../../ailog-ui/build')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
