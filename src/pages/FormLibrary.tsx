import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductPayload } from "./../types";

const schema = z.object({
  name: z.string().min(1).max(500),
  price: z.number().min(0),
  barcode: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  compareAtPrice: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  featured: z.boolean(),
  images: z.string().min(1),
  isDefault: z.boolean().nullable().optional(),
  owner: z.string().nullable().optional(),
  published: z.boolean(),
  quantity: z.number().min(0),
  sku: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
});

const FormLibrary: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      featured: false,
      published: false,
      quantity: 0,
    },
  });

  const onSubmit = async (data: ProductPayload) => {
    await fetch("https://api.oluwasetemi.dev/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("Product created");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Name" {...register("name")} />
      <p>{errors.name?.message}</p>

      <input
        type="number"
        placeholder="Price"
        {...register("price", { valueAsNumber: true })}
      />
      <p>{errors.price?.message}</p>

      <input placeholder="Images" {...register("images")} />
      <p>{errors.images?.message}</p>

      <input
        type="number"
        placeholder="Quantity"
        {...register("quantity", { valueAsNumber: true })}
      />
      <p>{errors.quantity?.message}</p>

      <label>
        Featured
        <input type="checkbox" {...register("featured")} />
      </label>

      <label>
        Published
        <input type="checkbox" {...register("published")} />
      </label>

      <button type="submit">Create Product</button>
    </form>
  );
};

export default FormLibrary;
