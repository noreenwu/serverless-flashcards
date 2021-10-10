import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateFlashcardRequest } from '../../requests/CreateFlashcardRequest'
import { createFlashcard } from '../../businessLogic/flashcards'
import { getToken } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const newFlashcard: CreateFlashcardRequest = JSON.parse(event.body)
    const jwtToken = getToken(event)
    const newItem = await createFlashcard(newFlashcard, jwtToken)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem
        })
    }
}