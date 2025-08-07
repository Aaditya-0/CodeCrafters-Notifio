export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  createdAt: Date;
  completed?: boolean;
}

export interface NewEvent {
  name: string;
  date: string;
  time: string;
  description: string;
}
