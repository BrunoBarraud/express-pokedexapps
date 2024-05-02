import { faker } from '@faker-js/faker';

interface User {
  id: number;
  name: string;
  email: string;
}

export class UsersService {
  private static instance: UsersService;
  private users: User[] = [];

  private constructor() {
    this.generateUsers();
  }

  public static getInstance(): UsersService {
    if (!UsersService.instance) {
      UsersService.instance = new UsersService();
    }
    return UsersService.instance;
  }

  private generateUsers(): void {
    for (let i = 0; i < 100; i++) {
      this.users.push({
        id: i,
        name: faker.person.firstName(),
        email: faker.internet.email(),
      });
    }
  }

  public async getUsers(): Promise<User[]> {
    return this.users;
  }

  public async findUser(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  public async addUser(user: User): Promise<void> {
    this.users.push(user);
  }

  public async updateUser(id: number, user: User): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    this.users[index] = user;
  }

  public async deleteUser(id: number): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
