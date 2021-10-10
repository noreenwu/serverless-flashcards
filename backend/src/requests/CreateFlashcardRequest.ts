/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateFlashcardRequest {
  question: string
  answer: string
  category: string
}
