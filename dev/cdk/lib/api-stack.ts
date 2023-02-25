import {Construct} from 'constructs';
import {ARecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {AiLogStack, TStackProps} from "./AiLogStack";
import {ApiGateway} from "aws-cdk-lib/aws-route53-targets";
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import {
  AuthorizationType,
  IdentitySource,
  LambdaRestApi,
  RequestAuthorizer
} from "aws-cdk-lib/aws-apigateway";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {ServiceLambda} from "./ServiceLambda";
import {AUTH_FN_NAME} from "ailog-common";
import {ITable} from "aws-cdk-lib/aws-dynamodb";

type ApiStackProps = TStackProps & {
  domainName: string,
  apiPrefix: string,
  sitePrefix: string,
  proxyFunction: IFunction,
  dynamoTable: ITable,
}
export class ApiStack extends AiLogStack<ApiStackProps> {

  public readonly authFunction: IFunction;
  public readonly apiUrl: string
  constructor(scope: Construct, props: ApiStackProps) {
    super(scope, 'ApiStack', props);
    this.apiUrl = `${props.apiPrefix}.${props.domainName}`
    this.authFunction = new ServiceLambda(this, 'AiLogAuthLambda', {
      functionName: AUTH_FN_NAME,
      package: 'ailog-api',
      handler: "authHandler",
      environment: {
        DYNAMO_TABLE_NAME: props.dynamoTable.tableName
      },
    });
    props.dynamoTable.grantReadData(this.authFunction);

    const zone = HostedZone.fromLookup(this, 'ApiHostedZone', {
      domainName: props.domainName
    })

    const certificate = new Certificate(this, 'AiLogApiCertificate', {
      domainName: this.apiUrl,
      validation: CertificateValidation.fromDns(zone),
    });

    const authorizer = new RequestAuthorizer(this, 'Authorizer', {
      handler: this.authFunction,
      identitySources: [IdentitySource.header('Authorization')]
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
        allowOrigins: [`https://${props.sitePrefix}.${props.domainName}`],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Authorization', 'Username', 'Content-Type']
      },
      defaultMethodOptions: {
        authorizationType: AuthorizationType.CUSTOM,
        authorizer,
      }
    })

    new ARecord(this, 'ApiARecord', {
      zone,
      recordName: this.apiUrl,
      target: RecordTarget.fromAlias(new ApiGateway(restApi))
    })

  }
}
