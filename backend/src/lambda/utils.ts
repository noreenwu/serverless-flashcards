import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {


  const authorization = event.headers.Authorization

  if (!authorization) throw new Error('No authentication header')

  if (!authorization.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authorization.split(' ')
  const jwtToken = split[1]

  console.log("getUserId: jwtToken is: ", jwtToken)
  return parseUserId(jwtToken)
}

export function getToken(event: APIGatewayProxyEvent): string {

  const authorization = event.headers.Authorization;

  if (authorization) {
    const split = authorization.split(' ')
    const jwtToken = split[1]  
    return jwtToken    
  }
  else {
    throw new Error('No authentication header')
  }


}