export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  createdAt: Date;
}

export interface NewEvent {
  name: string;
  date: string;
  time: string;
  description: string;
}
