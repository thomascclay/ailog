#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DataStack} from '../lib/data-stack';
import {FrontendStack} from "../lib/frontend-stack";
import {ApiStack} from "../lib/api-stack";
import {ServiceStack} from "../lib/service-stack";

const app = new cdk.App();

new DataStack(app);

new ServiceStack(app)

new ApiStack(app);

new FrontendStack(app)