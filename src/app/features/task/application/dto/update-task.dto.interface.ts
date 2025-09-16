import { ICreateTaskDto } from "./create-task.dto.interface";

export interface IUpdateTaskDto extends Partial<ICreateTaskDto>{
    id?:string
    uuid?:string
}