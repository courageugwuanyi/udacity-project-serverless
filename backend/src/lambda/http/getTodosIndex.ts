import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllToDosIndex } from '../../businessLogic/todos'


// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    console.log("Processing Event ", event);

    const createdAtId = event.pathParameters.createdAtId
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const todos = await getAllToDosIndex(jwtToken, createdAtId);

    if (todos.length !== 0) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                "items": todos,
            })
          };
    }
    
    return {
        statusCode: 404,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            error: "Todo does not exist"
        })
      };

  }
)
handler.use(
  cors({
    credentials: true
  })
)