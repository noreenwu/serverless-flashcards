import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllFlashcardsByCategory } from '../../businessLogic/flashcards'
import { getToken } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const category = event.pathParameters.category
    const category = event.queryStringParameters['category']
    const mastery = event.queryStringParameters['mastery']
    console.log("mastery specified ", mastery)
    const jwtToken = getToken(event)
    const flashcards = await getAllFlashcardsByCategory(jwtToken, category, mastery)
    console.log(jwtToken)
    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: "get flashcards by category",
            items: flashcards
        })
    }
}