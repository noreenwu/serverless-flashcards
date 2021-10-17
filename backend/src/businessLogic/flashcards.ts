import * as uuid from 'uuid'
import { FlashcardItem } from '../models/FlashcardItem'
import { FlashcardAccess } from '../dataLayer/flashcardsAccess'
import { CreateFlashcardRequest } from '../requests/CreateFlashcardRequest'
import { UpdateFlashcardRequest } from '../requests/UpdateFlashcardRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('businesslogic')
const flashcardAccess = new FlashcardAccess();


const masteryStringToBool = (mastery: string): boolean => {
    return (mastery === "true")
}

// get all Flashcards for logged in user (no category)
export async function getAllFlashcards(jwtToken: string, mastery="All"): Promise<FlashcardItem[]> {
    logger.info('getting all Flashcards for user', {
        jwtToken,
        mastery
    });
    const userId = parseUserId(jwtToken)
    if (mastery !== "All") {
        return flashcardAccess.getAllFlashcardsFilterByMastery(userId, masteryStringToBool(mastery))
    }

    return flashcardAccess.getAllFlashcards(userId)
}

// get all Flashcards for logged in user (by category)
export async function getAllFlashcardsByCategory(jwtToken: string, category: string, mastery="All"): Promise<FlashcardItem[]> {
    logger.info('getting all Flashcards for user', {
        jwtToken,
        category,
        mastery
    });     
    const userId = parseUserId(jwtToken)
    if (mastery !== "All") {
        return flashcardAccess.getAllFlashcardsByCategoryMastery(userId, category, masteryStringToBool(mastery))
    }

    return flashcardAccess.getAllFlashcardsByCategory(userId, category)
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

// update specified Flashcard for logged in user
export async function updateFlashcard(flashcardId: string, revisedTodo: UpdateFlashcardRequest, jwtToken: string): Promise<FlashcardItem> {

    const userId = parseUserId(jwtToken)
    logger.info('updateFlashcard', {
        userId,
        flashcardId,
        revisedTodo
    });

    return flashcardAccess.updateFlashcard(userId, flashcardId, revisedTodo)
}

// get upload Url
export async function getUploadUrl(flashcardId: string): Promise<string> {
    logger.info('getUploadUrl', {
        flashcardId
    });    
    return await flashcardAccess.getUploadUrl(flashcardId)
}

// save the S3 url in the Flashcard item
export async function saveUploadUrl(flashcardId: string, jwtToken: string, url: string): Promise<string> {
    const userId = parseUserId(jwtToken)
    logger.info('saveUploadUrl', {
        flashcardId,
        jwtToken,
        url
    });
    return await flashcardAccess.updateFlashcardUploadUrl(userId, flashcardId, url)
}