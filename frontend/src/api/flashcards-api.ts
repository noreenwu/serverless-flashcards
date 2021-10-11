import { apiEndpoint } from '../config'
import { Flashcard } from '../types/Flashcard';
import { CreateFlashcardRequest } from '../types/CreateFlashcardRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

export async function getFlashcards(idToken: string): Promise<Flashcard[]> {
  console.log('Fetching flashcards')

  const response = await Axios.get(`${apiEndpoint}/flashcards`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Flashcards:', response.data)
  return response.data.items
}

export async function createFlashcard(
  idToken: string,
  newFlashcard: CreateFlashcardRequest
): Promise<Flashcard> {
  console.log("async function createFlashcard about to POST newFlashcard", newFlashcard)
  const response = await Axios.post(`${apiEndpoint}/flashcards`,  JSON.stringify(newFlashcard), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log("and the response from Axios.post was: ", response.data.newItem)
  return response.data.newItem
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
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
