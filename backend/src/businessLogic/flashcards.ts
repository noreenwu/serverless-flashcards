import * as uuid from 'uuid'
import { FlashcardItem } from '../models/FlashcardItem'
import { FlashcardAccess } from '../dataLayer/flashcardsAccess'
import { CreateFlashcardRequest } from '../requests/CreateFlashcardRequest'
// import { UpdateFlashcardRequest } from '../requests/UpdateFlashcardRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('businesslogic')
const flashcardAccess = new FlashcardAccess();

// get all Flashcards for logged in user
export async function getAllFlashcards(jwtToken: string): Promise<FlashcardItem[]> {
    logger.info('getting all Flashcards for user', {
        jwtToken
    });     
    const userId = parseUserId(jwtToken)
    return flashcardAccess.getAllFlashcards(userId)
}

// create a Flashcard for logged in user
export async function createFlashcard(newFlashcard: CreateFlashcardRequest, jwtToken: string): Promise<FlashcardItem> {    
    const flashcardId = uuid.v4()
    const userId = parseUserId(jwtToken)
    logger.info('createFlashcard', {
        newFlashcard,
        jwtToken
    });

    return await flashcardAccess.createFlashcard({
        userId: userId,
        flashcardId: flashcardId,
        createdAt: Date.now().toString(),
        question: newFlashcard.question,
        answer: newFlashcard.answer,
        category: newFlashcard.category || "",
        mastery: false
    })
}

// delete specified Flashcard for logged in user
export async function deleteFlashcard(flashcardId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken)
    logger.info('deleteFlashcard', {
        userId,
        flashcardId
    });

    return flashcardAccess.deleteFlashcard(userId, flashcardId)

}

// // update specified Todo for logged in user
// export async function updateTodo(todoId: string, revisedTodo: UpdateTodoRequest, jwtToken: string): Promise<TodoItem> {

//     const userId = parseUserId(jwtToken)
//     logger.info('updateTodo', {
//         userId,
//         todoId,
//         revisedTodo
//     });

//     return todoAccess.updateTodo(userId, todoId, revisedTodo)
// }

// // get upload Url
// export async function getUploadUrl(todoId: string): Promise<string> {
//     logger.info('getUploadUrl', {
//         todoId
//     });    
//     return await todoAccess.getUploadUrl(todoId)
// }

// // save the S3 url in the Todo item
// export async function saveUploadUrl(todoId: string, jwtToken: string, url: string): Promise<string> {
//     const userId = parseUserId(jwtToken)
//     logger.info('saveUploadUrl', {
//         todoId,
//         jwtToken,
//         url
//     });
//     return await todoAccess.updateTodoUploadUrl(userId, todoId, url)
// }