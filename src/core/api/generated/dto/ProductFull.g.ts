export interface ProductFull {
  id: string;
  productName: string;
  price: number;
  cofeId: string;
  cofeName: string;
  favarite: boolean;
  attribute: Attribute[];
  imagesPath: string;
}

export interface Attribute {
  id: string;
  description: string;
  iconType: string;
}