import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskStatus } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async getAllTasks(): Promise<Task[]> {
    const allTasks = await this.taskModel.find();
    return allTasks;
  }

  async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.getAllTasks();
    status && (tasks = await this.taskModel.find({ status }));
    search &&
      (tasks = await this.taskModel.find({
        $or: [
          { title: { $regex: search } },
          { description: { $regex: search } },
        ],
      }));
    if (!tasks.length) {
      throw new NotFoundException(`No tasks found matching your search`);
    }
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.taskModel.findById(id);
    if (!foundTask) {
      throw new NotFoundException(
        `The id: ${id} does not correspond to any task`,
      );
    }
    return foundTask;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const createdTask = await this.taskModel.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    return createdTask;
  }

  async deleteTask(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id);
    return deletedTask;
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const updatedTask = await this.taskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!updatedTask) {
      throw new NotFoundException(
        `The id: ${id} does not correspond to any task`,
      );
    }
    return updatedTask;
  }
}
