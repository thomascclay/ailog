#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DataStack} from '../lib/data-stack';
import {FrontendStack} from "../lib/frontend-stack";
import {ApiStack} from "../lib/api-stack";
import assert = require("node:assert");
import {ServiceStack} from "../lib/service-stack";

assert(process.env.DEFAULT_CDK_ACCOUNT, "DEFAULT_CDK_ACCOUNT must be set")
assert(process.env.DEFAULT_CDK_REGION, "DEFAULT_CDK_REGION must be set")

const env = {
  account: process.env.DEFAULT_CDK_ACCOUNT!,
  region: process.env.DEFAULT_CDK_REGION!,
}

const app = new cdk.App();

new DataStack(app, 'AILogDataStack', {
  env,
});

new ServiceStack(app, 'AILogServiceStack', {
  env
})

new ApiStack(app, 'AiLogApiStack', {
  env
});

new FrontendStack(app, 'AILogFrontendStack', {
  env,
})