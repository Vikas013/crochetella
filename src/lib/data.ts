import type { OrderSummary, Product } from "./types";

export const products: Product[] = [
  {
    id: "sunset-tote",
    name: "Sunset Granny Square Tote",
    category: "Bags",
    price: 68,
    stock: 6,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80",
    description: "A sturdy cotton tote made with warm sunset-inspired granny squares.",
    featured: true,
  },
  {
    id: "cloud-bunny",
    name: "Cloud Bunny Amigurumi",
    category: "Toys",
    price: 34,
    stock: 12,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80",
    description: "Soft plush bunny with embroidered details for safe gifting.",
    featured: true,
  },
  {
    id: "heirloom-blanket",
    name: "Heirloom Baby Blanket",
    category: "Home",
    price: 124,
    stock: 3,
    image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=900&q=80",
    description: "A keepsake blanket using washable merino blend yarn.",
  },
];

export const orders: OrderSummary[] = [
  { id: "ORD-1042", customer: "Maya Chen", total: 102, status: "making", items: 2 },
  { id: "ORD-1041", customer: "Jordan Lee", total: 68, status: "paid", items: 1 },
  { id: "ORD-1040", customer: "Amara Patel", total: 158, status: "shipped", items: 3 },
];

export const categories = ["Bags", "Toys", "Home", "Accessories"];
