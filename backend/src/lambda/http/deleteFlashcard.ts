import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteFlashcard } from '../../businessLogic/flashcards'
import { getToken } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const flashcardId = event.pathParameters.flashcardId
    const jwtToken = getToken(event)
    await deleteFlashcard(flashcardId, jwtToken)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            Deleted: flashcardId
        })
    }    
}