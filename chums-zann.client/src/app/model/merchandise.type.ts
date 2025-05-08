import { PrimaryCategory } from '../model/primaryCategory.type';
import { SubCategory } from '../model/subCategory.type';

export type Merchandise = {
  id: number,
  name: string,
  description: string,
  price: number,
  image: string,
  primCategory: PrimaryCategory,
  subCategory: SubCategory,
  onSale: boolean,
  outOfStock: boolean,
  salePrice: number,
  saleDescription: string
}
