import {Construct} from 'constructs';
import {API_URL, SERVICE_FN_NAME, SITE_NAME} from "ailog-common";
import {ARecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {AiLogStack} from "./AiLogStack";
import {ApiGateway} from "aws-cdk-lib/aws-route53-targets";
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import { LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {Function} from "aws-cdk-lib/aws-lambda";


export class ApiStack extends AiLogStack {

  constructor(scope: Construct) {
    super(scope, 'ApiStack');

    const proxyFunction = Function.fromFunctionName(this, 'ServiceFn', SERVICE_FN_NAME)
    const zone = HostedZone.fromLookup(this, 'ApiHostedZone', {
      domainName: SITE_NAME[1]
    })

    const certificate = new Certificate(this, 'AiLogApiCertificate', {
      domainName: API_URL,
      validation: CertificateValidation.fromDns(zone),
    });

    const restApi = new LambdaRestApi(this, 'AiLogApiGateway', {
      proxy: true,
      handler: proxyFunction,
      restApiName: 'AiLog',
      domainName: {
        domainName: API_URL,
        certificate,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: [SITE_NAME.join('.')],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    })

    new ARecord(this, 'ApiARecord', {
      zone,
      recordName: API_URL,
      target: RecordTarget.fromAlias(new ApiGateway(restApi))
    })

  }
}
