import { faker } from '@faker-js/faker';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export class ProductsService {
  private products: Product[] = [];

  constructor() {
    this.generateProducts();
  }

  private generateProducts(): void {
    for (let i = 0; i < 100; i++) {
      this.products.push({
        id: i,
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price()),
        image: faker.image.url(),
      });
    }
  }

  public async getProducts(): Promise<Product[]> {
    return this.products;
  }

  public async findProduct(id: number): Promise<Product | undefined> {
    return this.products.find((product) => product.id === id);
  }

  public async addProduct(product: Product): Promise<void> {
    this.products.push(product);
  }

  public async updateProduct(id: number, product: Product): Promise<void> {
    const index = this.products.findIndex((product) => product.id === id);
    this.products[index] = product;
  }

  public async deleteProduct(id: number): Promise<void> {
    this.products = this.products.filter((product) => product.id !== id);
  }
}
