import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import {TodoUpdate} from "../models/TodoUpdate"
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { getUserId } from '../lambda/utils';

// TODO: Implement businessLogic
 const toDosAccess = new TodosAccess ();

 export async function getAllTodos (): Promise <TodoItem []> {
    return toDosAccess.getAllTodos();
 }

 export async function CreateTodo (
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
    ): Promise <TodoItem> {
        const todoId = uuid.v4()
        const userId = getUserId(jwtToken)
        const s3Bucket = process.env.S3_BUCKET_IMAGES

        return toDosAccess.CreateTodo ({
            todoId:todoId,
            userId: userId,
            attachmentUrl:  `https://${s3Bucket}.s3.amazonaws.com/${todoId}`, 
            createdAt: new Date().getTime().toString(),
            done: false
        });
    }

    export async function updateToDo(
        updateTodoRequest: UpdateTodoRequest, 
        todoId: string, 
        jwtToken: string): Promise<TodoUpdate> {
        const userId = getUserId(jwtToken);

        return toDosAccess.updateToDo (
            updateTodoRequest, 
            todoId, 
            userId
        );
    }

    export async function deleteToDo(
        todoId: string, 
        jwtToken: string): Promise<string> {
        const userId = getUserId(jwtToken);

        return toDosAccess.deleteToDo(todoId, userId);
    }

    export function generateUploadUrl(todoId: string): Promise<string> {
        return toDosAccess.generateUploadUrl(todoId);
    }