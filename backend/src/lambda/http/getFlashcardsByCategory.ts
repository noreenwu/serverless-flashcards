import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllFlashcardsByCategory } from '../../businessLogic/flashcards'
import { getToken } from '../utils'

const return400 = (message: string) => {
  return {
    statusCode: 400,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        message: message,
    })
  }  
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if ( event.queryStringParameters == null ) {
      return return400("get flashcards by category: no parameters specified")
    }
    if ( event.queryStringParameters['category'] == null ) {
      return return400("get flashcards by category: no category specified")
    }

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
            message: `get flashcards by category: ${category}, mastery: ${mastery}`,
            items: flashcards
        })
    }
}