import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../interfaces/task.interface';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: string): string {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not a valid status.`);
    }
    return value;
  }
  private isStatusValid(status: any): boolean {
    return this.allowedStatuses.indexOf(status) !== -1;
  }
}
