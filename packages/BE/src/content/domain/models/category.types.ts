export interface CategoryContent {
  language: string;
  name: string;
  description: string;
}

export interface CategoryAttributes {
  id: string;
  content: CategoryContent[];
}
