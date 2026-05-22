export interface UnitContent {
  language: string;
  name: string;
  shortName: string;
  singularName: string;
}

export interface UnitAttributes {
  id: string;
  isVisible: boolean;
  content: UnitContent[];
}
