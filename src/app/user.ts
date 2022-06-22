export interface Users {
  users: User[];
  length: number;
}

export interface User {
  id?: number;
  name: string;
  phoneNumbers: string[];
}

