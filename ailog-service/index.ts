import {inspect} from "util";
import {APIGatewayProxyHandler} from "aws-lambda";
import {putFeedback} from "./src/FeedbackService";

const handlePost = async (body: any) => {
  console.log('handlePost body', inspect(body));
  await putFeedback(body)
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
}
export const handler: APIGatewayProxyHandler = async (event, context) => {

  const body = event.body ? JSON.parse(event.body) : null;
  console.log('event.body', inspect(event.body));
  switch (`${event.httpMethod} ${event.path.toLowerCase()}`) {
    case 'POST /feedback':
      if (!event.body) {
        return {
          statusCode: 400,
          body: 'No body'
        }
      }
      await handlePost(body);
      return {
        statusCode: 200,
        body,
      };
    default:
      let msg = `Cannot ${event.httpMethod} ${event.path}`;
      console.error(msg)
      return {
        statusCode: 404,
        body: msg
      }
  }
}