
const AWS = require('aws-sdk')
import { FlashcardItem } from '../models/FlashcardItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UpdateFlashcardRequest } from '../requests/UpdateFlashcardRequest'
import { createLogger } from '../utils/logger'
const logger = createLogger('datalayer')

export class FlashcardAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly flashcardsTable = process.env.FLASHCARDS_TABLE,
        private readonly categoryIndex = process.env.CATEGORY_INDEX) {
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

        async getAllFlashcardsFilterByMastery(userId: string, mastery: boolean): Promise<FlashcardItem[]> {
            logger.info('getting all Flashcards for user, filtered by mastery', {
                userId,
                mastery
            }); 
            const result = await this.docClient
                .query({
                    TableName: this.flashcardsTable,
                    KeyConditionExpression: 'userId = :userId',
                    ExpressionAttributeValues: {
                        ':userId': userId,
                        ':mastery': mastery
                },
                ScanIndexForward: false,
                FilterExpression: 'mastery = :mastery'
            }).promise()

            const items = result.Items

            return items as FlashcardItem[]            

        }

        // By Category
        async getAllFlashcardsByCategory(userId: string, category: string): Promise<FlashcardItem[]> {
            logger.info('getting all Flashcards by category for user', {
                userId,
                category
            }); 
            const result = await this.docClient
                    .query({
                        TableName: this.flashcardsTable,
                        IndexName: this.categoryIndex,
                        KeyConditionExpression: 'userId = :userId and category = :category',
                        ExpressionAttributeValues: {
                            ':category': category,
                            ':userId': userId,                            
                        },
                    ScanIndexForward: false
                }).promise()

            const items = result.Items

            return items as FlashcardItem[]
        }

        // By Category and Mastery
        async getAllFlashcardsByCategoryMastery(userId: string, category: string, mastery: boolean): Promise<FlashcardItem[]> {
            logger.info('getting all Flashcards by category for user', {
                userId,
                category,
                mastery
            });

            const result = await this.docClient
                    .query({
                        TableName: this.flashcardsTable,
                        IndexName: this.categoryIndex,
                        KeyConditionExpression: 'userId = :userId and category = :category',
                        ExpressionAttributeValues: {
                            ':category': category,
                            ':userId': userId,
                            ':mastery': mastery                            
                        },
                    ScanIndexForward: false,
                    FilterExpression: 'mastery = :mastery'
                }).promise()  

            const items = result.Items

            return items as FlashcardItem[]
        }

        // async getAllFlashcardsByCategory(userId: string, category: string, mastery: string): Promise<FlashcardItem[]> {
        //     console.log("datalayer category is ", category)
        //     logger.info('getting all Flashcards by category for user', {
        //         userId,
        //         category,
        //         mastery
        //     });

        //     let result: any;
        //     if (mastery === "true" || mastery === "false") {
        //         let boolValue: boolean
        //         (mastery == "true") ? boolValue = true : boolValue = false;
        //         result = await this.docClient
        //             .query({
        //                 TableName: this.flashcardsTable,
        //                 IndexName: this.categoryIndex,
        //                 KeyConditionExpression: 'userId = :userId and category = :category',
        //                 ExpressionAttributeValues: {
        //                     ':category': category,
        //                     ':userId': userId,
        //                     ':mastery': boolValue                            
        //                 },
        //             ScanIndexForward: false,
        //             FilterExpression: 'mastery = :mastery'
        //         }).promise()
        //     }
        //     else {
        //         // mastery not specified: don't filter
        //         result = await this.docClient
        //             .query({
        //                 TableName: this.flashcardsTable,
        //                 IndexName: this.categoryIndex,
        //                 KeyConditionExpression: 'userId = :userId and category = :category',
        //                 ExpressionAttributeValues: {
        //                     ':category': category,
        //                     ':userId': userId,                            
        //                 },
        //             ScanIndexForward: false
        //         }).promise()                
        //     }

        //     const items = result.Items

        //     return items as FlashcardItem[]
        // }

        async createFlashcard(newFlashcard: FlashcardItem): Promise<FlashcardItem> {
            logger.info('creating a new Flashcard', {
                newFlashcard
            });              
            await this.docClient.put({
                TableName: this.flashcardsTable,
                Item: newFlashcard
              }).promise();
                            
              return newFlashcard;
        }

        async deleteFlashcard(userId: string, flashcardId: string): Promise<string> {
            logger.info('deleting specified Flashcard', {
                userId,
                flashcardId
            });             
            await this.docClient.delete({
                TableName: this.flashcardsTable,
                Key: { userId, flashcardId }
            })
            .promise();

            return  flashcardId;
        }

        async updateFlashcard(userId: string, flashcardId: string, flashcard: UpdateFlashcardRequest): Promise<any> {
            logger.info('updating specified Flashcard with new values', {
                userId,
                flashcardId,
                flashcard
            });            
            const updatedFlashcard = await this.docClient.update({
                TableName: this.flashcardsTable,
                Key: { userId, flashcardId },
                ExpressionAttributeNames: {
                  '#flashcard_question': 'question',
                },
                ExpressionAttributeValues: {
                  ':question': flashcard.question,
                  ':answer': flashcard.answer,
                  ':mastery': flashcard.mastery,
                },
                UpdateExpression: 'SET #flashcard_question = :question, answer = :answer, mastery = :mastery',
                ReturnValues: 'ALL_NEW',
            })
            .promise();
            
            const retFlashcard = { ...updatedFlashcard.Attributes }
            return retFlashcard
        }

        async getUploadUrl(flashcardId: string): Promise<string> {
            const bucketName = process.env.IMAGES_S3_BUCKET
            const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

            logger.info('Generating an uploadURL', {
                flashcardId
            });

            const s3 = new AWS.S3({
                signatureVersion: 'v4'
            })

            return s3.getSignedUrl('putObject', {
                Bucket: bucketName,
                Key: flashcardId,
                Expires: urlExpiration
            })
         }

         async updateFlashcardUploadUrl(userId: string, flashcardId: string, url: string): Promise<any> {
            logger.info('Saving uploadURL to FlashcardsTable specified item', {
                userId,
                flashcardId,
                url
            });             
            const updated = await this.docClient.update({
                TableName: this.flashcardsTable,
                Key: { userId, flashcardId },
                UpdateExpression: "set attachmentUrl=:URL",
                ExpressionAttributeValues: {
                ":URL": url.split("?")[0]
                },
                ReturnValues: "UPDATED_NEW"
            })
            .promise();

            return updated
        } 
}


