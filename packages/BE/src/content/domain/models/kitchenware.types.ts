export interface KitchenwareContent {
  language: string;
  name: string;
  singularName: string;
}

export interface KitchenwareAttributes {
  id: string;
  content: KitchenwareContent[];
}
