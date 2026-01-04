import { useState } from "react";
import type { ProductPayload } from "./../types";

type Errors = Partial<Record<keyof ProductPayload, string>>;

const initialState: ProductPayload = {
  name: "",
  price: 0,
  featured: false,
  images: "",
  published: false,
  quantity: 0,
  barcode: null,
  category: null,
  compareAtPrice: null,
  description: null,
  isDefault: null,
  owner: null,
  sku: null,
  tags: null,
};

const NoFormLibrary: React.FC = () => {
  const [form, setForm] = useState<ProductPayload>(initialState);
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const e: Errors = {};

    if (!form.name || form.name.length < 1)
      e.name = "Name is required";

    if (form.name.length > 500)
      e.name = "Name must not exceed 500 characters";

    if (form.price < 0)
      e.price = "Price must be ≥ 0";

    if (!form.images)
      e.images = "Images field is required";

    if (form.quantity < 0)
      e.quantity = "Quantity must be ≥ 0";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await fetch("https://api.oluwasetemi.dev/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Product created");
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <p>{errors.name}</p>

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />
      <p>{errors.price}</p>

      <input
        placeholder="Images"
        value={form.images}
        onChange={(e) => setForm({ ...form, images: e.target.value })}
      />
      <p>{errors.images}</p>

      <input
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) =>
          setForm({ ...form, quantity: Number(e.target.value) })
        }
      />
      <p>{errors.quantity}</p>

      <label>
        Featured
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) =>
            setForm({ ...form, featured: e.target.checked })
          }
        />
      </label>

      <label>
        Published
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) =>
            setForm({ ...form, published: e.target.checked })
          }
        />
      </label>

      <button type="submit">Create Product</button>
    </form>
  );
};

export default NoFormLibrary;
