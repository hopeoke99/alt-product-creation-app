import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ProductPayload } from './../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive('Price must be greater than zero'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Invalid image URL'),
});

const FormLibrary: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductPayload>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ProductPayload) => {
    await fetch('https://api.oluwasetemi.dev/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    alert('Product created');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Title" {...register('title')} />
      <p>{errors.title?.message}</p>

      <input
        type="number"
        placeholder="Price"
        {...register('price', { valueAsNumber: true })}
      />
      <p>{errors.price?.message}</p>

      <input placeholder="Description" {...register('description')} />
      <p>{errors.description?.message}</p>

      <input placeholder="Category" {...register('category')} />
      <p>{errors.category?.message}</p>

      <input placeholder="Image URL" {...register('image')} />
      <p>{errors.image?.message}</p>

      <button type="submit">Create</button>
    </form>
  );
};

export default FormLibrary;
