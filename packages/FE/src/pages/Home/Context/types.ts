export type HomePageContextValues = {
  itemsVisible: number;
  setItemsVisible: (value: number | ((prev: number) => number)) => void;
};