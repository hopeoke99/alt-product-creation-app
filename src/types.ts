export interface ProductPayload {
  name: string;               // required, min 1, max 500
  price: number;              // required, min 0
  barcode?: string | null;
  category?: string | null;
  compareAtPrice?: number | null;
  description?: string | null;
  featured: boolean;          // required
  images: string;             // required
  isDefault?: boolean | null;
  owner?: string | null;
  published: boolean;         // required
  quantity: number;           // required, min 0
  sku?: string | null;
  tags?: string | null;
}
