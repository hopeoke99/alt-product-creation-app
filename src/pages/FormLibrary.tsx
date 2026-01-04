import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { ProductPayload } from "./../types";

// Enhanced schema with better validation messages
const productSchema = z.object({
  name: z
    .string({ message: "Name must be a string" })
    .min(1, "Name is required")
    .max(500, "Name must not exceed 500 characters")
    .trim(),
  price: z
    .number({ message: "Price must be a valid number" })
    .min(0, "Price must be at least 0"),
  featured: z.boolean(),
  images: z.string().min(1, "At least one image URL is required"),
  published: z.boolean(),
  quantity: z
    .number({ message: "Quantity must be a valid number" })
    .int("Quantity must be a whole number")
    .min(0, "Quantity must be at least 0"),
  barcode: z
    .string()
    .max(100, "Barcode must not exceed 100 characters")
    .nullable(),
  category: z
    .string()
    .max(200, "Category must not exceed 200 characters")
    .nullable(),
  compareAtPrice: z
    .number({ message: "Compare at price must be a valid number" })
    .min(0, "Compare at price must be at least 0")
    .nullable(),
  description: z
    .string()
    .max(5000, "Description must not exceed 5000 characters")
    .nullable(),
  isDefault: z.boolean().nullable(),
  owner: z
    .string()
    .max(200, "Owner must not exceed 200 characters")
    .nullable(),
  sku: z
    .string()
    .max(100, "SKU must not exceed 100 characters")
    .nullable(),
  tags: z
    .string()
    .max(500, "Tags must not exceed 500 characters")
    .nullable(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductFormWithLibrary: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
    },
    mode: "onChange", // Validate on change for better UX
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("https://api.oluwasetemi.dev/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setSubmitSuccess(true);
      reset(); // Reset form to initial state
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to create product:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="product-form" noValidate>
      <h2>Create Product</h2>

      {/* Success Message */}
      {submitSuccess && (
        <div className="alert alert-success" role="alert">
          ✓ Product created successfully!
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="alert alert-error" role="alert">
          ✗ {submitError}
        </div>
      )}

      {/* Name Field */}
      <div className="form-group">
        <label htmlFor="name">
          Name <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Product name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Product description"
          rows={5}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
          disabled={isSubmitting}
          {...register("description", {
            setValueAs: (v) => v === "" ? null : v,
          })}
        />
        {errors.description && (
          <p id="description-error" className="error" role="alert">
            {errors.description.message}
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
          aria-invalid={!!errors.price}
          aria-describedby={errors.price ? "price-error" : undefined}
          disabled={isSubmitting}
          {...register("price", { 
            valueAsNumber: true,
            setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
          })}
        />
        {errors.price && (
          <p id="price-error" className="error" role="alert">
            {errors.price.message}
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
          aria-invalid={!!errors.compareAtPrice}
          aria-describedby={
            errors.compareAtPrice ? "compareAtPrice-error" : undefined
          }
          disabled={isSubmitting}
          {...register("compareAtPrice", {
            setValueAs: (v) => (v === "" || v === null || v === undefined) ? null : parseFloat(v),
          })}
        />
        {errors.compareAtPrice && (
          <p id="compareAtPrice-error" className="error" role="alert">
            {errors.compareAtPrice.message}
          </p>
        )}
        <small className="help-text">
          Original price for showing discounts
        </small>
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
          aria-invalid={!!errors.quantity}
          aria-describedby={errors.quantity ? "quantity-error" : undefined}
          disabled={isSubmitting}
          {...register("quantity", {
            valueAsNumber: true,
            setValueAs: (v) => (v === "" ? 0 : parseInt(v, 10)),
          })}
        />
        {errors.quantity && (
          <p id="quantity-error" className="error" role="alert">
            {errors.quantity.message}
          </p>
        )}
      </div>

      {/* SKU Field */}
      <div className="form-group">
        <label htmlFor="sku">SKU (Stock Keeping Unit)</label>
        <input
          id="sku"
          type="text"
          placeholder="SKU-12345"
          aria-invalid={!!errors.sku}
          aria-describedby={errors.sku ? "sku-error" : undefined}
          disabled={isSubmitting}
          {...register("sku", {
            setValueAs: (v) => v === "" ? null : v,
          })}
        />
        {errors.sku && (
          <p id="sku-error" className="error" role="alert">
            {errors.sku.message}
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
          aria-invalid={!!errors.barcode}
          aria-describedby={errors.barcode ? "barcode-error" : undefined}
          disabled={isSubmitting}
          {...register("barcode", {
            setValueAs: (v) => v === "" ? null : v,
          })}
        />
        {errors.barcode && (
          <p id="barcode-error" className="error" role="alert">
            {errors.barcode.message}
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
          placeholder="https://example.com/image.jpg"
          aria-invalid={!!errors.images}
          aria-describedby={errors.images ? "images-error" : undefined}
          disabled={isSubmitting}
          {...register("images")}
        />
        {errors.images && (
          <p id="images-error" className="error" role="alert">
            {errors.images.message}
          </p>
        )}
        <small className="help-text">
          Enter image URL or comma-separated URLs
        </small>
      </div>

      {/* Category Field */}
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          placeholder="Electronics, Clothing, etc."
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? "category-error" : undefined}
          disabled={isSubmitting}
          {...register("category", {
            setValueAs: (v) => v === "" ? null : v,
          })}
        />
        {errors.category && (
          <p id="category-error" className="error" role="alert">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Tags Field */}
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          placeholder="tag1, tag2, tag3"
          aria-invalid={!!errors.tags}
          aria-describedby={errors.tags ? "tags-error" : undefined}
          disabled={isSubmitting}
          {...register("tags", {
            setValueAs: (v) => v === "" ? null : v,
          })}
        />
        {errors.tags && (
          <p id="tags-error" className="error" role="alert">
            {errors.tags.message}
          </p>
        )}
        <small className="help-text">Comma-separated tags</small>
      </div>

      {/* Owner Field */}
      <div className="form-group">
        <label htmlFor="owner">Owner</label>
        <input
          id="owner"
          type="text"
          placeholder="Owner ID or name"
          aria-invalid={!!errors.owner}
          aria-describedby={errors.owner ? "owner-error" : undefined}
          disabled={isSubmitting}
          {...register("owner", {
            setValueAs: (v) => v === "" ? null : v,
          })}
        />
        {errors.owner && (
          <p id="owner-error" className="error" role="alert">
            {errors.owner.message}
          </p>
        )}
      </div>

      {/* Boolean Fields */}
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            disabled={isSubmitting}
            {...register("featured")}
          />
          <span>Featured Product</span>
        </label>

        <label>
          <input
            type="checkbox"
            disabled={isSubmitting}
            {...register("published")}
          />
          <span>Published</span>
        </label>

        <label>
          <input
            type="checkbox"
            disabled={isSubmitting}
            {...register("isDefault")}
          />
          <span>Set as Default</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
        
        {isDirty && !isSubmitting && (
          <button
            type="button"
            onClick={() => reset()}
            className="reset-button"
          >
            Reset Form
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductFormWithLibrary;