import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './interfaces/task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Response } from 'express';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(
    @Res() res: Response,
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
  ): Promise<Response> {
    if (Object.keys(filterDto).length) {
      return res.status(HttpStatus.OK).json({
        ok: true,
        tasks: await this.taskService.getTasksWithFilters(filterDto),
      });
    }
    return res
      .status(HttpStatus.OK)
      .json({ ok: true, tasks: await this.taskService.getAllTasks() });
  }

  @Get(':id')
  async getTaskById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    const task = await this.taskService.getTaskById(id);
    return res.status(HttpStatus.FOUND).json({ ok: true, task });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @Res() res: Response,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Response> {
    const createdTask = await this.taskService.createTask(createTaskDto);
    return res.status(HttpStatus.CREATED).json({
      ok: true,
      createdTask,
    });
  }

  @Delete(':id')
  async deleteTask(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    const deletedTask = await this.taskService.deleteTask(id);
    return res.status(HttpStatus.OK).json({ ok: true, deletedTask });
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Res() res: Response,
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Response> {
    const modifiedTask = await this.taskService.updateTask(id, status);
    return res.status(HttpStatus.OK).json({ ok: true, modifiedTask });
  }
}
