export interface Offer {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  emoji: string;
  discount?: number;
  category: string;
}
