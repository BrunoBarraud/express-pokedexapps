import { faker } from '@faker-js/faker';

export interface Category {
  id: number;
  name: string;
  image: string;
}

export class CategoriesService {
  private static instance: CategoriesService;
  private categories: Category[] = [];

  private constructor() {
    this.generateCategories();
  }

  public static getInstance(): CategoriesService {
    if (!CategoriesService.instance) {
      CategoriesService.instance = new CategoriesService();
    }
    return CategoriesService.instance;
  }

  private generateCategories(): void {
    for (let i = 0; i < 5; i++) {
      this.categories.push({
        id: i,
        name: faker.commerce.department(),
        image: faker.image.url(),
      });
    }
  }

  public async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  public async findCategory(id: number): Promise<Category | undefined> {
    return this.categories.find((category) => category.id === id);
  }

  public async addCategory(category: Category): Promise<void> {
    this.categories.push(category);
  }

  public async updateCategory(id: number, category: Category): Promise<void> {
    const index = this.categories.findIndex((category) => category.id === id);
    this.categories[index] = category;
  }

  public async deleteCategory(id: number): Promise<void> {
    this.categories = this.categories.filter((category) => category.id !== id);
  }
}
