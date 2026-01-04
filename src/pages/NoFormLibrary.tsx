import { useState } from "react";
import type { ProductPayload } from "./../types";
import './NoFromLibrary.css'

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

const ProductForm: React.FC = () => {
  const [form, setForm] = useState<ProductPayload>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};

    // Name validation
    if (!form.name || form.name.trim().length < 1) {
      e.name = "Name is required";
    } else if (form.name.length > 500) {
      e.name = "Name must not exceed 500 characters";
    }

    // Price validation
    if (isNaN(form.price)) {
      e.price = "Price must be a valid number";
    } else if (form.price < 0) {
      e.price = "Price must be ≥ 0";
    }

    // Images validation
    if (!form.images || form.images.trim().length === 0) {
      e.images = "Images field is required";
    }

    // Quantity validation
    if (isNaN(form.quantity)) {
      e.quantity = "Quantity must be a valid number";
    } else if (form.quantity < 0) {
      e.quantity = "Quantity must be ≥ 0";
    }

    // CompareAtPrice validation (optional but must be valid if provided)
    if (form.compareAtPrice !== null && form.compareAtPrice !== undefined) {
      if (isNaN(form.compareAtPrice)) {
        e.compareAtPrice = "Compare at price must be a valid number";
      } else if (form.compareAtPrice < 0) {
        e.compareAtPrice = "Compare at price must be ≥ 0";
      }
    }

    // SKU validation (optional but reasonable length)
    if (form.sku && form.sku.length > 100) {
      e.sku = "SKU must not exceed 100 characters";
    }

    // Barcode validation (optional but reasonable length)
    if (form.barcode && form.barcode.length > 100) {
      e.barcode = "Barcode must not exceed 100 characters";
    }

    // Description validation (optional but reasonable length)
    if (form.description && form.description.length > 5000) {
      e.description = "Description must not exceed 5000 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearFieldError = (field: keyof ProductPayload) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.oluwasetemi.dev/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      alert("Product created successfully!");
      setForm(initialState);
      setErrors({});
    } catch (error) {
      console.error("Failed to create product:", error);
      alert(
        `Failed to create product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Create Product</h2>

      {/* Name Field */}
      <div className="form-group">
        <label htmlFor="name">
          Name <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            clearFieldError("name");
          }}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p id="name-error" className="error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Product description"
          value={form.description || ""}
          onChange={(e) => {
            setForm({
              ...form,
              description: e.target.value || null,
            });
            clearFieldError("description");
          }}
          rows={5}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p id="description-error" className="error" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      {/* Price Field */}
      <div className="form-group">
        <label htmlFor="price">
          Price <span className="required">*</span>
        </label>
        <input
          id="price"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={form.price || ""}
          onChange={(e) => {
            const value = e.target.value === "" ? 0 : Number(e.target.value);
            setForm({ ...form, price: value });
            clearFieldError("price");
          }}
          aria-invalid={!!errors.price}
          aria-describedby={errors.price ? "price-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.price && (
          <p id="price-error" className="error" role="alert">
            {errors.price}
          </p>
        )}
      </div>

      {/* Compare At Price Field */}
      <div className="form-group">
        <label htmlFor="compareAtPrice">Compare At Price</label>
        <input
          id="compareAtPrice"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={form.compareAtPrice ?? ""}
          onChange={(e) => {
            const value =
              e.target.value === "" ? null : Number(e.target.value);
            setForm({ ...form, compareAtPrice: value });
            clearFieldError("compareAtPrice");
          }}
          aria-invalid={!!errors.compareAtPrice}
          aria-describedby={
            errors.compareAtPrice ? "compareAtPrice-error" : undefined
          }
          disabled={isSubmitting}
        />
        {errors.compareAtPrice && (
          <p id="compareAtPrice-error" className="error" role="alert">
            {errors.compareAtPrice}
          </p>
        )}
      </div>

      {/* Quantity Field */}
      <div className="form-group">
        <label htmlFor="quantity">
          Quantity <span className="required">*</span>
        </label>
        <input
          id="quantity"
          type="number"
          placeholder="0"
          min="0"
          step="1"
          value={form.quantity || ""}
          onChange={(e) => {
            const value = e.target.value === "" ? 0 : Number(e.target.value);
            setForm({ ...form, quantity: Math.floor(value) });
            clearFieldError("quantity");
          }}
          aria-invalid={!!errors.quantity}
          aria-describedby={errors.quantity ? "quantity-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.quantity && (
          <p id="quantity-error" className="error" role="alert">
            {errors.quantity}
          </p>
        )}
      </div>

      {/* SKU Field */}
      <div className="form-group">
        <label htmlFor="sku">SKU</label>
        <input
          id="sku"
          type="text"
          placeholder="SKU-12345"
          value={form.sku || ""}
          onChange={(e) => {
            setForm({ ...form, sku: e.target.value || null });
            clearFieldError("sku");
          }}
          aria-invalid={!!errors.sku}
          aria-describedby={errors.sku ? "sku-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.sku && (
          <p id="sku-error" className="error" role="alert">
            {errors.sku}
          </p>
        )}
      </div>

      {/* Barcode Field */}
      <div className="form-group">
        <label htmlFor="barcode">Barcode</label>
        <input
          id="barcode"
          type="text"
          placeholder="123456789012"
          value={form.barcode || ""}
          onChange={(e) => {
            setForm({ ...form, barcode: e.target.value || null });
            clearFieldError("barcode");
          }}
          aria-invalid={!!errors.barcode}
          aria-describedby={errors.barcode ? "barcode-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.barcode && (
          <p id="barcode-error" className="error" role="alert">
            {errors.barcode}
          </p>
        )}
      </div>

      {/* Images Field */}
      <div className="form-group">
        <label htmlFor="images">
          Images <span className="required">*</span>
        </label>
        <input
          id="images"
          type="text"
          placeholder="Image URL or comma-separated URLs"
          value={form.images}
          onChange={(e) => {
            setForm({ ...form, images: e.target.value });
            clearFieldError("images");
          }}
          aria-invalid={!!errors.images}
          aria-describedby={errors.images ? "images-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.images && (
          <p id="images-error" className="error" role="alert">
            {errors.images}
          </p>
        )}
      </div>

      {/* Category Field */}
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          placeholder="Electronics, Clothing, etc."
          value={form.category || ""}
          onChange={(e) => {
            setForm({ ...form, category: e.target.value || null });
            clearFieldError("category");
          }}
          disabled={isSubmitting}
        />
      </div>

      {/* Tags Field */}
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          placeholder="tag1, tag2, tag3"
          value={form.tags || ""}
          onChange={(e) => {
            setForm({ ...form, tags: e.target.value || null });
            clearFieldError("tags");
          }}
          disabled={isSubmitting}
        />
        <small className="help-text">Comma-separated tags</small>
      </div>

      {/* Owner Field */}
      <div className="form-group">
        <label htmlFor="owner">Owner</label>
        <input
          id="owner"
          type="text"
          placeholder="Owner ID or name"
          value={form.owner || ""}
          onChange={(e) => {
            setForm({ ...form, owner: e.target.value || null });
            clearFieldError("owner");
          }}
          disabled={isSubmitting}
        />
      </div>

      {/* Checkboxes */}
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({ ...form, featured: e.target.checked })
            }
            disabled={isSubmitting}
          />
          <span>Featured Product</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm({ ...form, published: e.target.checked })
            }
            disabled={isSubmitting}
          />
          <span>Published</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.isDefault ?? false}
            onChange={(e) =>
              setForm({ ...form, isDefault: e.target.checked })
            }
            disabled={isSubmitting}
          />
          <span>Set as Default</span>
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting} className="submit-button">
        {isSubmitting ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;