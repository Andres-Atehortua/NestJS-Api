import { Schema } from 'mongoose';
import { TaskStatus } from '../interfaces/task.interface';

export const TaskSchema = new Schema(
  {
    title: String,
    description: String,
    status: {
      type: String,
      enum: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE],
      default: TaskStatus.OPEN,
    },
  },
  {
    timestamps: true,
  },
);
