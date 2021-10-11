/**
 * Fields in a request to update a single Flashcard item.
 */
export interface UpdateFlashcardRequest {
  question: string
  answer: string
  category: string
  mastery: boolean
}