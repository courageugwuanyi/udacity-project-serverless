import { ToDoAccess} from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import {TodoUpdate} from "../models/TodoUpdate"
import * as uuid from 'uuid'
import { parseUserId } from '../auth/utils'

// TODO: Implement businessLogic

 const toDosAccess = new ToDoAccess();


 export async function getAllToDos (jwtToken:string): Promise <TodoItem []> {
    const userID = parseUserId(jwtToken);
    return toDosAccess.getAllToDos(userID);
 }

 export async function getAllToDosIndex (jwtToken:string, createdAtId:string): Promise <TodoItem []> {
    const userID = parseUserId(jwtToken);
    return toDosAccess.getAllToDosIndex(userID, createdAtId);
 }

 export async function CreateToDo (
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
    ): Promise <TodoItem> {
        const todoId = uuid.v4()
        const userId = parseUserId(jwtToken)
        const s3Bucket = process.env.S3_BUCKET_NAME

        return toDosAccess.createToDo ({
            todoId: todoId,
            userId: userId,
            attachmentUrl: `https://${s3Bucket}.s3.amazonaws.com/${todoId}`,
            createdAt: new Date().getTime().toString(),
            done: false,
            name: createTodoRequest.name,
            dueDate: createTodoRequest.dueDate
        });
    }

    export async function updateToDo (
        updateTodoRequest: UpdateTodoRequest, 
        todoId: string, 
        jwtToken: string): Promise<TodoUpdate> {
        const userId = parseUserId(jwtToken);

        return toDosAccess.updateToDo (
            updateTodoRequest,
            todoId, 
            userId
        );
    }

    export async function deleteToDo(
        todoId: string, 
        jwtToken: string): Promise<string> {
        const userId = parseUserId(jwtToken);

        return toDosAccess.deleteToDo(todoId, userId);
    }

    export function generateUploadUrl(todoId: string): Promise<string> {
        return toDosAccess.generateUploadUrl(todoId);
    }