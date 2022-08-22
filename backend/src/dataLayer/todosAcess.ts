import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';


const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the dataLayer logic
export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3Bucket = process.env.S3_BUCKET_NAME) {
    }

    async getAllToDos(userId:string): Promise<TodoItem[]> {
        console.log("Getting all todos");

        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        }).promise();
        const items = result.Items;
        return items as TodoItem[];
    };

    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        console.log("Creating new todo");
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem
        }).promise()
        
        return todoItem as TodoItem
    }

    async updateToDo(
        todoUpdate: TodoUpdate, 
        todoId: string, 
        userId: string): Promise<TodoUpdate> {
        console.log("Updating todo item");

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #k = :o, #l = :p, #m = :q",
            ExpressionAttributeNames: {
                "#k": "name",
                "#l": "dueDate",
                "#m": "done"
            },
            ExpressionAttributeValues: {
                ":o": todoUpdate['name'],
                ":p": todoUpdate['dueDate'],
                ":q": todoUpdate['done']
            },
            ReturnValues: "UPDATED_NEW"
        };

        const result = await this.docClient.update(params).promise();
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteToDo(
        todoId: string, 
        userId: string): Promise<string> {
        console.log("Deleting todo item");

        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            }
        }).promise();

        return "" as string;
    }

    async generateUploadUrl(
        todoId: string): Promise<string> {
        console.log("Generating UploadURL");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3Bucket,
            Key: todoId,
            Expires: 2000,
        });
        console.log(url);

        return url as string;
    }

}


