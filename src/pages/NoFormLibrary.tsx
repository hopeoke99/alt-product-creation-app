import { useState } from 'react';
import type { ProductPayload } from './../types';

type Errors = Partial<Record<keyof ProductPayload, string>>;

const initialState: ProductPayload = {
  title: '',
  price: 0,
  description: '',
  category: '',
  image: '',
};

const NoFormLibrary: React.FC = () => {
  const [form, setForm] = useState<ProductPayload>(initialState);
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!form.title) newErrors.title = 'Title is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.image) newErrors.image = 'Image URL is required';
    if (!form.price || form.price <= 0)
      newErrors.price = 'Price must be greater than zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof ProductPayload, value: string) => {
    setForm({
      ...form,
      [key]: key === 'price' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await fetch('https://api.oluwasetemi.dev/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    alert('Product created');
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit}>
      {(Object.keys(form) as (keyof ProductPayload)[]).map((key) => (
        <div key={key} style={{ marginBottom: 8 }}>
          <input
            placeholder={key}
            type={key === 'price' ? 'number' : 'text'}
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
          <div style={{ color: 'red' }}>{errors[key]}</div>
        </div>
      ))}
      <button type="submit">Create</button>
    </form>
  );
};

export default NoFormLibrary;
