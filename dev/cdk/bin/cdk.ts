#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DataStack} from '../lib/data-stack';
import {FrontendStack} from "../lib/frontend-stack";
import {ApiStack} from "../lib/api-stack";
import {ServiceStack} from "../lib/service-stack";
import {DYNAMO_TABLE, SITE_NAME} from "ailog-common";

const stage = 'dev'
const app = new cdk.App();

const dataStack = new DataStack(app, {
  stage,
  tableName: DYNAMO_TABLE.NAME
});

const serviceStack = new ServiceStack(app, {
  stage,
  dynamoTable: dataStack.dynamoTable
})

new ApiStack(app, {
  stage,
  proxyFunction: serviceStack.proxyFunction,
  apiPrefix: 'api',
  domainName: SITE_NAME[1]
});

new FrontendStack(app, {
  stage,
  subDomainName: 'ailog',
  domainName: SITE_NAME[1],
  siteDir: '../../ailog-ui/build',
})