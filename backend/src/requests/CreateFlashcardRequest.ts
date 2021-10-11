/**
 * Fields in a request to create a single Flashcard item.
 */
export interface CreateFlashcardRequest {
  question: string
  answer: string
  category: string
}
