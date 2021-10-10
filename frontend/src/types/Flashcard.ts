export interface Flashcard {
  flashcardId: string;
  createdAt: string;
  question: string;
  answer: string;
  category: string;
  mastery: boolean;
  attachmentUrl?: string;
}
