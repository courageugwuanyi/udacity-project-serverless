import { ToDoAccess} from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import {TodoUpdate} from "../models/TodoUpdate"
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils';

// TODO: Implement businessLogic

 const toDosAccess = new ToDoAccess();

 export async function getAllToDos (): Promise <TodoItem []> {
    return toDosAccess.getAllToDos();
 }

 export async function CreateToDo (
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
    ): Promise <TodoItem> {
        const todoId = uuid.v4()
        const userId = getUserId(jwtToken)
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