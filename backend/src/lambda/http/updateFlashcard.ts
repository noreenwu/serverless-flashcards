import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateFlashcardRequest } from '../../requests/UpdateFlashcardRequest'
import { updateFlashcard } from '../../businessLogic/flashcards'
import { getToken } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const flashcardId = event.pathParameters.flashcardId
    const jwtToken = getToken(event)
    const revisedFlashcard: UpdateFlashcardRequest = JSON.parse(event.body)

    const newItem = await updateFlashcard(flashcardId, revisedFlashcard, jwtToken)    
    
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          updated: newItem
        })
      };
}