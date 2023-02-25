import {inspect} from "util";
import {APIGatewayProxyEvent, APIGatewayProxyHandler} from "aws-lambda";
import * as fbservice from "./FeedbackService";
import {login, SITE_NAME} from "ailog-common";

type HttpEventHandler = (event: APIGatewayProxyEvent) => Promise<any>;
type HttpEventHandlers = {
  [key: string]: HttpEventHandler
}

const bodyAsString = (body: any): string => {
  if (typeof body === 'string') {
    return body;
  } else {
    return JSON.stringify(body);
  }
}

const Responses = {
  OK: (body: any = "OK") => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': `https://${SITE_NAME.join('.')}`,
      },
      body: bodyAsString(body)
    }
  },
  BAD_REQUEST: (body: any = "Bad Request") => {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': `https://${SITE_NAME.join('.')}`,
      },
      body: bodyAsString(body)
    }
  },
  NOT_FOUND: (body: any = "Not Found") => {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': `https://${SITE_NAME.join('.')}`,
      },
      body: bodyAsString(body)
    }
  },
  ERROR: (body: any = "Error") => {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': `https://${SITE_NAME.join('.')}`,
      },
      body: bodyAsString(body)
    }
  }
}

const putFeedback: HttpEventHandler = async (event) => {
  console.log('handlePost event', inspect(event));
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body) {
    return Responses.BAD_REQUEST('Bad Request, no body')
  }
  return await fbservice.putFeedback(body)
      .then(_ => Responses.OK)
      .catch(err => {
        console.error('Error', err);
        return Responses.ERROR(err)
      })
};

const postLogin: HttpEventHandler = async (event) => {
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body) {
    return Responses.BAD_REQUEST('Bad Request, no body')
  }
  if (body.username && body.password) {
    const token = await login(body.username, body.password);
    if (token) {
      return Responses.OK({token, username: body.username})
    } else {
      return {
        statusCode: 401,
        body: 'Unauthorized'
      }
    }
  } else {
    return Responses.BAD_REQUEST('Bad Request, no username or password')
  }
}

const httpEventHandlers: HttpEventHandlers = {
  'PUT /feedback': putFeedback,
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
    return Responses.NOT_FOUND(msg)
  }
}
