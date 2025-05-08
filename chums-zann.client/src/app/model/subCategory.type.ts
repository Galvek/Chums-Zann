import { PrimaryCategory } from "./primaryCategory.type"

export type SubCategory = {
  id: number,
  primaryCategory: PrimaryCategory,
  description: string
}
