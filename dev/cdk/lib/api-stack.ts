import {Construct} from 'constructs';
import {ARecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {AiLogStack, TStackProps} from "./AiLogStack";
import {ApiGateway} from "aws-cdk-lib/aws-route53-targets";
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import { LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {IFunction} from "aws-cdk-lib/aws-lambda";

type ApiStackProps = TStackProps & {
  domainName: string,
  apiPrefix: string,
  proxyFunction: IFunction,
}

export class ApiStack extends AiLogStack<ApiStackProps> {

  public apiUrl: string
  constructor(scope: Construct, props: ApiStackProps) {
    super(scope, 'ApiStack', props);
    this.apiUrl = `${props.apiPrefix}.${props.domainName}`

    const zone = HostedZone.fromLookup(this, 'ApiHostedZone', {
      domainName: props.domainName
    })

    const certificate = new Certificate(this, 'AiLogApiCertificate', {
      domainName: this.apiUrl,
      validation: CertificateValidation.fromDns(zone),
    });

    const restApi = new LambdaRestApi(this, 'AiLogApiGateway', {
      proxy: true,
      handler: props.proxyFunction,
      restApiName: 'AiLog',
      domainName: {
        domainName: this.apiUrl,
        certificate,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: [props.domainName],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    })

    new ARecord(this, 'ApiARecord', {
      zone,
      recordName: this.apiUrl,
      target: RecordTarget.fromAlias(new ApiGateway(restApi))
    })

  }
}
