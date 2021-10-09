export interface FlashcardItem {
  userId: string
  flashcardId: string
  createdAt: string
  modifiedAt: string
  question: string
  answer: string
  category: string
  mastery: boolean
  attachmentUrl?: string
}
