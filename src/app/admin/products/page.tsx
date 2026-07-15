"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  Eye,
  EyeOff,
  X,
  Tags,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type Spec = { label: string; value: string };

type Product = {
  id: string;
  model: string;
  name: string;
  category: string;
  image: string;
  description: string;
  specs: string; // JSON string of Spec[]
  price: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: string;
};

type Category = {
  id: string;
  slug: string;
  name: string;
  count: number;
  blurb: string;
  image: string;
  span: string;
  sortOrder: number;
  createdAt: string;
};

type TabKey = "products" | "categories";

// ─────────────────────────────────────────────────────────────
// Shared input styles (match existing admin pages)
// ─────────────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none";
const labelClass = "data-label mb-1.5 block text-[11px] text-sand";

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [tab, setTab] = useState<TabKey>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [seeding, setSeeding] = useState(false);

  const fetchAll = async () => {
    const params = new URLSearchParams();
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    if (data.ok) {
      setProducts(data.products);
      setCategories(data.categories);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, [categoryFilter]);

  const filteredProducts = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    fetchAll();
  };

  const deleteCategory = async (id: string) => {
    if (
      !confirm(
        "Delete this category? Products assigned to it will keep their category string but will no longer match a dropdown option."
      )
    )
      return;
    await fetch(`/api/admin/products/categories?id=${id}`, {
      method: "DELETE",
    });
    fetchAll();
  };

  const seedData = async () => {
    if (
      !confirm(
        "Seed the catalogue from existing static data? This only fills empty tables — existing rows are left untouched."
      )
    )
      return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/products/seed", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        alert(
          `Seeded ${data.seeded.products} products and ${data.seeded.categories} categories.`
        );
        setCategoryFilter("all");
        fetchAll();
      } else {
        alert("Seed failed: " + (data.message || "Unknown error"));
      }
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass/30 border-t-brass" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ivory mb-2">
            Products &amp; Categories
          </h1>
          <p className="font-body text-sm text-sand">
            Manage your catalogue — {products.length} products,{" "}
            {categories.length} categories
          </p>
        </div>

        {tab === "products" && (
          <div className="flex items-center gap-2">
            {products.length === 0 && (
              <button
                onClick={seedData}
                disabled={seeding}
                className="rounded-full bg-white/5 text-ivory px-5 py-2.5 text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Populate the database from the existing static catalogue data"
              >
                {seeding ? "Seeding…" : "Seed from existing data"}
              </button>
            )}
            <button
              onClick={() => setCreatingProduct(true)}
              className="rounded-full bg-brass text-charcoal px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
        )}
        {tab === "categories" && (
          <button
            onClick={() => setCreatingCategory(true)}
            className="rounded-full bg-brass text-charcoal px-5 py-2.5 text-sm font-medium hover:bg-brass-light transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        )}
      </div>

      {products.length === 0 && categories.length === 0 && (
        <div className="glass-on-charcoal rounded-2xl p-4 mb-6">
          <p className="font-body text-xs text-sand">
            <span className="font-mono text-brass uppercase tracking-wider mr-2">
              Note
            </span>
            Your catalogue is empty. Click{" "}
            <span className="text-ivory font-medium">Seed from existing data</span>{" "}
            to populate products and categories from the static site data with one
            click — then edit them here.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10">
        <TabButton
          active={tab === "products"}
          onClick={() => setTab("products")}
          icon={<Package className="h-4 w-4" />}
          label="Products"
          count={products.length}
        />
        <TabButton
          active={tab === "categories"}
          onClick={() => setTab("categories")}
          icon={<Tags className="h-4 w-4" />}
          label="Categories"
          count={categories.length}
        />
      </div>

      {/* ─── Products tab ─── */}
      {tab === "products" && (
        <>
          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand/50" />
              <input
                type="text"
                placeholder="Search by name or model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-2.5 text-sm text-ivory placeholder:text-sand/40 focus:border-brass focus:outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ivory focus:border-brass focus:outline-none min-w-[180px]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products table */}
          <div className="glass-on-charcoal rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">
                      Model
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden lg:table-cell">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand hidden md:table-cell">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider text-sand">
                      Flags
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-12 w-12 rounded-lg object-cover shrink-0 bg-white/5"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/product-catalogue/placeholder.jpg";
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-body text-sm text-ivory font-medium truncate max-w-[220px]">
                              {p.name}
                            </p>
                            <p className="font-mono text-[10px] text-sand md:hidden">
                              {p.model}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs text-brass">
                          {p.model}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="font-body text-sm text-sand">
                          {p.category || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs text-sand">
                          {p.price || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {p.featured && (
                            <span
                              className="inline-flex items-center gap-1 rounded-full border border-brass/30 bg-brass/20 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-brass"
                              title="Featured"
                            >
                              <Star className="h-2.5 w-2.5 fill-brass" /> Feat
                            </span>
                          )}
                          {p.published ? (
                            <span
                              className="inline-flex items-center gap-1 rounded-full border border-emerald/30 bg-emerald/20 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-emerald-400"
                              title="Published"
                            >
                              <Eye className="h-2.5 w-2.5" /> Live
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-sand"
                              title="Hidden"
                            >
                              <EyeOff className="h-2.5 w-2.5" /> Hide
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 rounded-lg text-sand hover:bg-white/5 hover:text-brass transition-colors"
                            title="Edit"
                            aria-label={`Edit ${p.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 rounded-lg text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            title="Delete"
                            aria-label={`Delete ${p.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <Package className="h-10 w-10 text-sand/30 mx-auto mb-3" />
                <p className="font-body text-sm text-sand">
                  No products found.{" "}
                  {products.length === 0
                    ? "Add one or seed from existing data."
                    : "Try a different search or filter."}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Categories tab ─── */}
      {tab === "categories" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="glass-on-charcoal rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative h-32 bg-white/5">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/categories/placeholder.jpg";
                  }}
                />
                <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-brass">
                  {c.span}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display text-base text-ivory">{c.name}</h3>
                  <span className="font-mono text-[10px] text-brass shrink-0">
                    {c.count} pcs
                  </span>
                </div>
                <p className="font-mono text-[10px] text-sand mb-2">/{c.slug}</p>
                <p className="font-body text-xs text-sand line-clamp-2 mb-4">
                  {c.blurb || "—"}
                </p>
                <div className="flex items-center gap-1 mt-auto">
                  <button
                    onClick={() => setEditingCategory(c)}
                    className="flex-1 rounded-full bg-white/5 text-ivory px-4 py-2 text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="rounded-full bg-red-500/10 text-red-400 px-3 py-2 text-xs hover:bg-red-500/20 transition-colors"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="glass-on-charcoal rounded-2xl p-12 text-center col-span-full">
              <Tags className="h-10 w-10 text-sand/30 mx-auto mb-3" />
              <p className="font-body text-sm text-sand mb-4">
                No categories yet
              </p>
              <button
                onClick={() => setCreatingCategory(true)}
                className="rounded-full bg-brass text-charcoal px-6 py-3 text-sm font-medium hover:bg-brass-light transition-colors"
              >
                Create First Category
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── Product editor modal ─── */}
      {(editingProduct || creatingProduct) && (
        <ProductEditor
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setEditingProduct(null);
            setCreatingProduct(false);
          }}
          onSave={async (data) => {
            if (editingProduct) {
              await fetch("/api/admin/products", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingProduct.id, ...data }),
              });
            } else {
              await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
            }
            setEditingProduct(null);
            setCreatingProduct(false);
            fetchAll();
          }}
        />
      )}

      {/* ─── Category editor modal ─── */}
      {(editingCategory || creatingCategory) && (
        <CategoryEditor
          category={editingCategory}
          onClose={() => {
            setEditingCategory(null);
            setCreatingCategory(false);
          }}
          onSave={async (data) => {
            if (editingCategory) {
              await fetch("/api/admin/products/categories", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingCategory.id, ...data }),
              });
            } else {
              await fetch("/api/admin/products/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });
            }
            setEditingCategory(null);
            setCreatingCategory(false);
            fetchAll();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab button
// ─────────────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
        active
          ? "text-brass border-brass"
          : "text-sand border-transparent hover:text-ivory"
      }`}
    >
      {icon}
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
          active ? "bg-brass/20 text-brass" : "bg-white/5 text-sand"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Product editor
// ─────────────────────────────────────────────────────────────
function ProductEditor({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Omit<Partial<Product>, "specs"> & { specs: Spec[] }) => void;
}) {
  const parseSpecs = (raw: string): Spec[] => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [model, setModel] = useState(product?.model || "");
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(
    product?.category || (categories[0]?.name ?? "")
  );
  const [image, setImage] = useState(
    product?.image || "/images/product-catalogue/placeholder.jpg"
  );
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [specs, setSpecs] = useState<Spec[]>(
    product ? parseSpecs(product.specs) : []
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [published, setPublished] = useState(product?.published ?? true);
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);
  const [error, setError] = useState("");

  const addSpec = () =>
    setSpecs([...specs, { label: "", value: "" }]);
  const updateSpec = (i: number, key: keyof Spec, val: string) =>
    setSpecs(specs.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  const removeSpec = (i: number) =>
    setSpecs(specs.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!model.trim()) {
      setError("Model code is required.");
      return;
    }
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    onSave({
      model: model.trim(),
      name: name.trim(),
      category,
      image,
      price,
      description,
      specs: specs.filter((s) => s.label.trim() || s.value.trim()),
      featured,
      published,
      sortOrder: Number(sortOrder) || 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-on-charcoal rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ivory">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-sand hover:text-ivory transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Model Code *</label>
            <input
              className={inputClass}
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="LRMB-130"
            />
          </div>
          <div>
            <label className={labelClass}>Name *</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Absorption Minibar 40L"
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input
              className={inputClass}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₹12,000 — ₹18,000"
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Image URL</label>
            <input
              className={inputClass}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/product-catalogue/..."
            />
            {image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover bg-white/5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/product-catalogue/placeholder.jpg";
                  }}
                />
                <p className="font-mono text-[10px] text-sand truncate flex-1">
                  {image}
                </p>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short product description..."
            />
          </div>

          {/* Specs editor */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Specifications</label>
              <button
                type="button"
                onClick={addSpec}
                className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-brass hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Spec
              </button>
            </div>
            <div className="space-y-2">
              {specs.length === 0 && (
                <p className="font-body text-xs text-sand/60 italic">
                  No specs yet — add rows for capacity, power, material, etc.
                </p>
              )}
              {specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    value={s.label}
                    onChange={(e) => updateSpec(i, "label", e.target.value)}
                    placeholder="Label (e.g. Capacity)"
                  />
                  <input
                    className={inputClass}
                    value={s.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    placeholder="Value (e.g. 40 Litres)"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="shrink-0 p-2 rounded-lg text-sand hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    aria-label="Remove spec"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Sort Order</label>
            <input
              type="number"
              className={inputClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div className="flex items-end gap-4 pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-brass h-4 w-4"
              />
              <span className="text-sm text-ivory flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-brass" /> Featured
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="accent-brass h-4 w-4"
              />
              <span className="text-sm text-ivory flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-emerald-400" /> Published
              </span>
            </label>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="rounded-full bg-brass text-charcoal flex-1 py-3 text-sm font-medium hover:bg-brass-light transition-colors"
          >
            Save Product
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 text-ivory px-6 py-3 text-sm hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Category editor
// ─────────────────────────────────────────────────────────────
function CategoryEditor({
  category,
  onClose,
  onSave,
}: {
  category: Category | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}) {
  const [slug, setSlug] = useState(category?.slug || "");
  const [name, setName] = useState(category?.name || "");
  const [count, setCount] = useState(category?.count ?? 0);
  const [blurb, setBlurb] = useState(category?.blurb || "");
  const [image, setImage] = useState(
    category?.image || "/images/categories/placeholder.jpg"
  );
  const [span, setSpan] = useState(category?.span || "default");
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    onSave({
      slug: slug.trim(),
      name: name.trim(),
      count: Number(count) || 0,
      blurb,
      image,
      span,
      sortOrder: Number(sortOrder) || 0,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-on-charcoal rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ivory">
            {category ? "Edit Category" : "New Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-sand hover:text-ivory transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              className={inputClass}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="amenities"
            />
          </div>
          <div>
            <label className={labelClass}>Name *</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amenities"
            />
          </div>
          <div>
            <label className={labelClass}>Product Count</label>
            <input
              type="number"
              className={inputClass}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input
              type="number"
              className={inputClass}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Image URL</label>
            <input
              className={inputClass}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/categories/amenities.jpg"
            />
            {image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover bg-white/5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/categories/placeholder.jpg";
                  }}
                />
                <p className="font-mono text-[10px] text-sand truncate flex-1">
                  {image}
                </p>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Blurb</label>
            <textarea
              className={inputClass}
              rows={2}
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="Short description shown on the homepage category grid..."
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Grid Span</label>
            <select
              className={inputClass}
              value={span}
              onChange={(e) => setSpan(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="large">Large</option>
              <option value="wide">Wide</option>
              <option value="tall">Tall</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="rounded-full bg-brass text-charcoal flex-1 py-3 text-sm font-medium hover:bg-brass-light transition-colors"
          >
            Save Category
          </button>
          <button
            onClick={onClose}
            className="rounded-full bg-white/5 text-ivory px-6 py-3 text-sm hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
