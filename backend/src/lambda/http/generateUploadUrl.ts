import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getToken } from '../utils'
import { getUploadUrl, saveUploadUrl } from '../../businessLogic/flashcards'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const flashcardId = event.pathParameters.flashcardId
  const jwtToken = getToken(event)

  const url = await getUploadUrl(flashcardId)

  await saveUploadUrl(flashcardId, jwtToken, url)
  
  // Return a presigned URL to upload a file for a Flashcard item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        flashcardId,
        uploadUrl: url
    })
  }
}