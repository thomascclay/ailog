import {inspect} from "util";
import {APIGatewayProxyEvent, APIGatewayProxyHandler} from "aws-lambda";
import {putFeedback} from "./FeedbackService";
import {login} from "./Authorizer";

type HttpEventHandler = (event: APIGatewayProxyEvent) => Promise<any>;
type HttpEventHandlers = {
  [key: string]: HttpEventHandler
}

const postFeedback: HttpEventHandler = async (event) => {
  console.log('handlePost event', inspect(event));
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body) {
    return {
      statusCode: 400,
      body: 'Bad Request'
    }
  }
  return await putFeedback(body)
      .then(_ => ({
        statusCode: 200,
        body: 'OK'
      }))
      .catch(err => {
        console.error('Error', err);
        return {
          statusCode: 500,
          body: inspect(err)
        }
      })
};

const postLogin: HttpEventHandler = async (event) => {
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body) {
    return {
      statusCode: 400,
      body: 'Bad Request, no body'
    }
  }
  if (body.username && body.password) {
    const token = await login(body.username, body.password);
    if (token) {
      return {
        statusCode: 200,
        body: JSON.stringify({token, user: {username: body.username}})
      }
    } else {
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }
  } else {
    return {
      statusCode: 400,
      body: 'Bad Request, no username or password'
    }
  }
}

const httpEventHandlers: HttpEventHandlers = {
  'POST /feedback': postFeedback,
  'POST /login': postLogin
};


export const rootHandler: APIGatewayProxyHandler = async (event, context) => {
  console.debug('event', inspect(event));
  console.log('event.body', inspect(event.body));
  const handler = httpEventHandlers[`${event.httpMethod} ${event.path.toLowerCase()}`];
  if (handler) {
    return await handler(event);
  } else {
    let msg = `Cannot ${event.httpMethod} ${event.path}`;
    console.error(msg)
    return {
      statusCode: 404,
      body: msg
    }
  }
}
