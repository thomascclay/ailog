#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DataStack} from '../lib/data-stack';
import {FrontendStack} from "../lib/frontend-stack";
import {ApiStack} from "../lib/api-stack";

const env: cdk.StackProps['env'] = {
  account: process.env.DEFAULT_CDK_ACCOUNT,
  region: process.env.DEFAULT_CDK_REGION,
}

const app = new cdk.App();

new DataStack(app, 'AILogDataStack', {
  env,
});

new ApiStack(app, 'AiLogApiStack', {
  env
});

new FrontendStack(app, 'AILogFrontendStack', {
  env,
  domainName: 'tomsplayground.net',
  siteSubDomain: 'ailog'
})