export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  featured?: boolean;
};

export type OrderStatus = "new" | "paid" | "making" | "shipped";

export type OrderSummary = {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  items: number;
};
