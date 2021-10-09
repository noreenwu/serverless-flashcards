
const AWS = require('aws-sdk')
import { FlashcardItem } from '../models/FlashcardItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import { UpdateFlashcardRequest } from '../requests/UpdateFlashcardRequest'
import { createLogger } from '../utils/logger'
const logger = createLogger('datalayer')

export class FlashcardAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly flashcardsTable = process.env.FLASHCARDS_TABLE) {
        }

        async getAllFlashcards(userId: string): Promise<FlashcardItem[]> {
            logger.info('getting all Flashcards for user', {
                userId
            }); 
            const result = await this.docClient
                .query({
                    TableName: this.flashcardsTable,
                    KeyConditionExpression: 'userId = :userId',
                    ExpressionAttributeValues: {
                        ':userId': userId
                },
                ScanIndexForward: false
            }).promise()

            const items = result.Items

            return items as FlashcardItem[]
        }

        // async createTodo(newTodo: FlashcardItem): Promise<FlashcardItem> {
        //     logger.info('creating a new Flashcard', {
        //         newTodo
        //     });              
        //     await this.docClient.put({
        //         TableName: this.flashcardsTable,
        //         Item: newTodo
        //       }).promise();
                            
        //       return newTodo;
        // }

        // async deleteTodo(userId: string, todoId: string): Promise<string> {
        //     logger.info('deleting specified Flashcard', {
        //         userId,
        //         todoId
        //     });             
        //     await this.docClient.delete({
        //         TableName: this.flashcardsTable,
        //         Key: { userId, todoId }
        //     })
        //     .promise();

        //     return  todoId;
        // }

        // async updateTodo(userId: string, todoId: string, todo: UpdateFlashcardRequest): Promise<any> {
        //     logger.info('updating specified Flashcard with new values', {
        //         userId,
        //         todoId,
        //         todo
        //     });            
        //     const updatedTodo = await this.docClient.update({
        //         TableName: this.flashcardsTable,
        //         Key: { userId, todoId },
        //         ExpressionAttributeNames: {
        //           '#todo_name': 'name',
        //         },
        //         ExpressionAttributeValues: {
        //           ':name': todo.name,
        //           ':dueDate': todo.dueDate,
        //           ':done': todo.done,
        //         },
        //         UpdateExpression: 'SET #todo_name = :name, dueDate = :dueDate, done = :done',
        //         ReturnValues: 'ALL_NEW',
        //     })
        //     .promise();
            
        //     const retTodo = { ...updatedTodo.Attributes }
        //     return retTodo
        // }

        // async getUploadUrl(todoId: string): Promise<string> {
        //     const bucketName = process.env.IMAGES_S3_BUCKET
        //     const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

        //     logger.info('Generating an uploadURL', {
        //         todoId
        //     });

        //     const s3 = new AWS.S3({
        //         signatureVersion: 'v4'
        //     })

        //     return s3.getSignedUrl('putObject', {
        //         Bucket: bucketName,
        //         Key: todoId,
        //         Expires: urlExpiration
        //     })
        //  }

        //  async updateTodoUploadUrl(userId: string, todoId: string, url: string): Promise<any> {
        //     logger.info('Saving uploadURL to FlashcardsTable specified item', {
        //         userId,
        //         todoId,
        //         url
        //     });             
        //     const updated = await this.docClient.update({
        //         TableName: this.flashcardsTable,
        //         Key: { userId, todoId },
        //         UpdateExpression: "set attachmentUrl=:URL",
        //         ExpressionAttributeValues: {
        //         ":URL": url.split("?")[0]
        //         },
        //         ReturnValues: "UPDATED_NEW"
        //     })
        //     .promise();

        //     return updated
        // } 
}


