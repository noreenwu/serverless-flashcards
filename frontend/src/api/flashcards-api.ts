import { apiEndpoint } from '../config'
import { Flashcard } from '../types/Flashcard';
import { CreateFlashcardRequest } from '../types/CreateFlashcardRequest';
import Axios from 'axios'
import { UpdateFlashcardRequest } from '../types/UpdateFlashcardRequest';


export async function getFlashcardsByCategory(idToken: string, category="", mastery=""): Promise<Flashcard[]> {
  let response: any
  if ( (! category) && (! mastery) ) {
      response = await Axios.get(`${apiEndpoint}/flashcards`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })   
  }
  else {
      const categoryParam = category !== "" ? `category=${category}` : ""
      const masteryParam = mastery !== "" ? `mastery=${mastery}` : ""
      const paramConnector = (categoryParam && masteryParam) ? "&" : ""

      response = await Axios.get(`${apiEndpoint}/flashcards?${categoryParam}${paramConnector}${masteryParam}`, {  
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
      })
  }
  return response.data.items
}

export async function createFlashcard(
  idToken: string,
  newFlashcard: CreateFlashcardRequest
): Promise<Flashcard> {
  const response = await Axios.post(`${apiEndpoint}/flashcards`,  JSON.stringify(newFlashcard), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchFlashcard(
  idToken: string,
  flashcardId: string,
  updatedFlashcard: UpdateFlashcardRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/flashcards/${flashcardId}`, JSON.stringify(updatedFlashcard), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteFlashcard(
  idToken: string,
  flashcardId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/flashcards/${flashcardId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  flashcardId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/flashcards/${flashcardId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
