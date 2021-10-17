import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllFlashcards, getAllFlashcardsByCategory } from '../../businessLogic/flashcards'
import { getToken } from '../utils'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const jwtToken = getToken(event)
    let flashcards: any
    let message: string

    if ( event.queryStringParameters == null ) {
      message = "get flashcards: no querystring parameters were specified"
      flashcards = await getAllFlashcards(jwtToken)  
    } else {
      const category = event.queryStringParameters['category']
      const mastery = event.queryStringParameters['mastery']      
      if (( category == null ) && ( mastery !== null) ) {
        // category not specified, but mastery is specified
        message = `get flashcards: category not specified but mastery specified: ${mastery}`
        flashcards = await getAllFlashcards(jwtToken, mastery)  // won't use GSI
      }
      else {
        // getFlashcardsByCategory can handle optional no mastery flag specified
        message = `get flashcards: category: ${category}, mastery: ${mastery}`
        flashcards = await getAllFlashcardsByCategory(jwtToken, category, mastery)       
      }
    }

    return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: message,
            items: flashcards
        })
    }
}