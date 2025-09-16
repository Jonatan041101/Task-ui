export interface Task {
    id: string;
    uuid: string;
    title: string;
    description: string;
    isCompleted?: boolean;
    createdAt?: string;
  }