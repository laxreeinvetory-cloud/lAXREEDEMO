"use client";

import { useEffect, useState, useRef } from "react";
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
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Image compression utility — compresses before upload to avoid Vercel 413
// ─────────────────────────────────────────────────────────────
async function compressImage(file: File, maxDim: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressed = new File([blob], file.name, { type: "image/jpeg" });
              resolve(compressed);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

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
  specs: string;
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

// Parent category structure (matches catalogue-data.ts)
type ParentCat = {
  slug: string;
  name: string;
  description: string;
};

const PARENT_CATEGORIES: ParentCat[] = [
  { slug: "room-amenities", name: "Room Amenities", description: "Mini bars, kettles, trays, safes, locks, hangers, phones, dustbins, desktop accessories" },
  { slug: "washroom-amenities", name: "Washroom Amenities", description: "Hair dryers, soap dispensers, mirrors, paper dispensers, hand dryers, grab bars" },
  { slug: "lobby-items", name: "Lobby Amenities", description: "Luggage trolleys, housekeeping trolleys, lobby dustbins, Q managers, signage" },
  { slug: "bath-tub", name: "Bath Tub", description: "Freestanding bath tubs in multiple sizes" },
  { slug: "furniture", name: "Furniture", description: "Outdoor, guest room, restaurant, pool, garden" },
  { slug: "linen", name: "Linen", description: "Room linen, bath linen" },
  { slug: "amenities-tray-set", name: "Amenities Tray Set", description: "Premium tray sets for guest rooms" },
  { slug: "dome-space-pod", name: "Dome & Space POD", description: "Geodesic domes and space pods" },
];

// ─────────────────────────────────────────────────────────────
// Styles — high contrast, readable
// ─────────────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500/50";
const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5";
const btnPrimary =
  "rounded-lg bg-yellow-600 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const btnSecondary =
  "rounded-lg bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/20 transition-colors border border-white/15";

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.ok) {
        setProducts(data.products);
        setCategories(data.categories);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get item type names for selected parent from products table
  const getCategoriesForParent = (parentSlug: string): { name: string; count: number }[] => {
    const parentMap: Record<string, string[]> = {
      "room-amenities": ["Mini Bar", "Tea Kettle", "Kettle Tray", "Safe Box", "Wooden Hangers", "RFID Locks", "RFID Door Lock", "Door Lock", "Room Telephone", "Docking Pod", "Room Dustbin", "Desktop Accessories", "Rollaway Bed", "Mattress", "Iron & Iron Board", "Baby Cot", "Coat Stand", "Luggage Rack", "Emergency Torch"],
      "washroom-amenities": ["Hair Dryer", "Soap Dispenser", "Magnifying Mirror", "Lobby Soap Dispenser", "Weighing Scale", "Paper Dispenser", "Hand Dryer", "Shower Mat", "Cloth Line", "Towel Rack", "Toilet Paper Dispenser", "Towel Rod", "Washroom Tray", "Handicap Grab Bar"],
      "lobby-items": ["Luggage Trolley", "Housekeeping Trolley", "Lobby Dustbin", "Q Manager", "Sign Board", "Stand Pole", "Digital Signage"],
      "bath-tub": ["Bath Tub", "Bath Tub Models"],
      "furniture": ["Outdoor Furniture", "Guest Room Furniture", "Guest Room Loose Furniture", "Restaurant Furniture", "Pool Lounger", "Garden Umbrella", "FRP Flower Pots", "Room Furniture"],
      "linen": ["Room Linen", "Bath Linen"],
      "amenities-tray-set": ["Amenities Tray Set", "Amenities Tray Sets"],
      "dome-space-pod": ["Dome & Space POD", "Dome & Space POD Models"],
    };
    const catNames = parentMap[parentSlug] || [];
    // Get unique categories from products that match the parent mapping
    const productCats = new Set(products.map((p) => p.category));
    return catNames
      .filter((name) => productCats.has(name))
      .map((name) => ({
        name,
        count: products.filter((p) => p.category === name).length,
      }));
  };

  // Filter products by selected category
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const showToast = (kind: "ok" | "err", msg: string) => {
    setToast({ kind, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveProduct = async (data: Omit<Partial<Product>, "specs"> & { specs: Spec[] }) => {
    const method = editingProduct ? "PATCH" : "POST";
    const body = editingProduct
      ? { id: editingProduct.id, ...data, specs: data.specs }
      : data;

    try {
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.ok) {
        showToast("ok", `Product ${editingProduct ? "updated" : "created"} successfully! Image is now live.`);
        fetchProducts();
        setShowProductModal(false);
        setEditingProduct(null);
      } else {
        showToast("err", result.message || "Failed to save product");
      }
    } catch {
      showToast("err", "Network error — could not save product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleSeed = async () => {
    if (!confirm("Seed products from catalogue data? This will add all catalogue products to the database.")) return;
    const res = await fetch("/api/admin/products/seed", { method: "POST" });
    const data = await res.json();
    alert(`Seeded ${data.seeded?.products || 0} products and ${data.seeded?.categories || 0} categories`);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-600/30 border-t-yellow-600" />
      </div>
    );
  }

  const parentCategories = selectedParent ? getCategoriesForParent(selectedParent) : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Products & Categories</h1>
          <p className="text-sm text-gray-400">
            Manage all products with images, specifications, and descriptions.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {products.length === 0 && (
            <button onClick={handleSeed} className={btnSecondary}>
              Seed from catalogue
            </button>
          )}
          <button
            onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
            className={btnPrimary}
          >
            <Plus className="inline h-4 w-4 mr-1" /> Add Product
          </button>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 mb-4 text-sm flex-wrap">
        <button
          onClick={() => { setSelectedParent(null); setSelectedCategory(null); }}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            !selectedParent ? "bg-yellow-600 text-black font-semibold" : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          All Categories
        </button>
        {selectedParent && (
          <>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                !selectedCategory ? "bg-yellow-600 text-black font-semibold" : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {PARENT_CATEGORIES.find((p) => p.slug === selectedParent)?.name}
            </button>
          </>
        )}
        {selectedCategory && (
          <>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300">
              {selectedCategory}
            </span>
          </>
        )}
      </div>

      {/* Step 1: Show 8 parent categories */}
      {!selectedParent && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PARENT_CATEGORIES.map((parent) => {
            const parentCats = getCategoriesForParent(parent.slug);
            const productCount = products.filter((p) =>
              parentCats.some((c) => c.name === p.category)
            ).length;
            return (
              <button
                key={parent.slug}
                onClick={() => setSelectedParent(parent.slug)}
                className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/40 rounded-xl p-5 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-white">{parent.name}</h3>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{parent.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-yellow-500 font-mono">{parentCats.length} items</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-400 font-mono">{productCount} products</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Show item types within selected parent */}
      {selectedParent && !selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {PARENT_CATEGORIES.find((p) => p.slug === selectedParent)?.name} — Item Types
            </h2>
            <button
              onClick={() => setSelectedParent(null)}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Categories
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parentCategories.length > 0 ? (
              parentCategories.map((cat) => {
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/40 rounded-xl p-4 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-xs text-yellow-500 font-mono">{cat.count} products</span>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-gray-400 col-span-full py-8 text-center">
                No item types found. Use "Add Product" to create products in this category.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Show products within selected item type */}
      {selectedParent && selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-white">{selectedCategory} — Products</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-lg border border-white/15 bg-white/10 pl-9 pr-3 py-1.5 text-sm text-white placeholder:text-gray-500 focus:border-yellow-500 focus:outline-none w-48"
                />
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-500/40 transition-all"
              >
                {/* Image */}
                <div className="aspect-square w-full bg-gray-900 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-gray-700" />
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-yellow-500">{p.model}</span>
                    {p.featured && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">{p.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">{p.description || "No description"}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      p.published ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {p.published ? "Published" : "Hidden"}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditingProduct(p); setShowProductModal(true); }}
                        className="p-1.5 text-gray-400 hover:text-yellow-500 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-4">No products in this category yet.</p>
              <button
                onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                className={btnPrimary}
              >
                <Plus className="inline h-4 w-4 mr-1" /> Add First Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Editor Modal */}
      {showProductModal && (
        <ProductEditor
          product={editingProduct}
          categories={categories}
          defaultCategory={selectedCategory || undefined}
          onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-lg px-5 py-3 shadow-2xl border"
          style={{
            backgroundColor: toast.kind === "ok" ? "#1a4d3a" : "#5c1d1d",
            borderColor: toast.kind === "ok" ? "#22c55e" : "#ef4444",
          }}
        >
          {toast.kind === "ok" ? (
            <Check className="h-5 w-5 text-green-400" strokeWidth={2.5} />
          ) : (
            <X className="h-5 w-5 text-red-400" strokeWidth={2.5} />
          )}
          <span className="text-sm text-white font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Product Editor Modal — FIXED: proper scroll, no overlap, readable text
// ─────────────────────────────────────────────────────────────
function ProductEditor({
  product,
  categories,
  defaultCategory,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: Category[];
  defaultCategory?: string;
  onClose: () => void;
  onSave: (data: Omit<Partial<Product>, "specs"> & { specs: Spec[] }) => void;
}) {
  const [model, setModel] = useState(product?.model || "");
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || defaultCategory || "");
  const [image, setImage] = useState(product?.image || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [specs, setSpecs] = useState<Spec[]>(() => {
    if (!product?.specs) return [];
    try { return JSON.parse(product.specs); } catch { return []; }
  });
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [published, setPublished] = useState(product?.published ?? true);
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSpec = () => setSpecs([...specs, { label: "", value: "" }]);
  const updateSpec = (i: number, key: keyof Spec, val: string) =>
    setSpecs(specs.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      // Compress image client-side before upload (Vercel limits body to ~4.5MB)
      let uploadFile = file;
      if (file.size > 1 * 1024 * 1024) {
        // Image is over 1MB — compress it
        const compressed = await compressImage(file, 1024, 0.85);
        uploadFile = compressed;
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("model", model || "product");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "Server error");
        if (res.status === 413) {
          setError("Image too large even after compression. Please use a smaller image (max 4MB).");
        } else {
          setError(`Upload failed (${res.status}): ${text.substring(0, 100)}`);
        }
        setUploading(false);
        return;
      }
      const data = await res.json();
      if (data.ok) {
        setImage(data.imageUrl);
      } else {
        setError(data.message || "Upload failed — please try again");
      }
    } catch (err) {
      setError("Network error: " + (err instanceof Error ? err.message : "unknown"));
    }
    setUploading(false);
  };

  const handleSave = () => {
    if (!model.trim()) { setError("Model number is required."); return; }
    if (!name.trim()) { setError("Product name is required."); return; }
    onSave({
      model: model.trim(),
      name: name.trim(),
      category,
      image,
      description,
      price,
      specs: specs.filter((s) => s.label.trim() || s.value.trim()),
      featured,
      published,
      sortOrder: Number(sortOrder) || 0,
    });
  };

  return (
    // FIXED: proper fixed overlay, centered, scrollable, high z-index
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
      style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
    >
      <div
        className="bg-gray-900 border border-white/15 rounded-xl w-full max-w-2xl my-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — sticky at top of modal */}
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-lg font-bold text-white">
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body — scrollable content */}
        <div className="px-6 py-4 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* IMAGE UPLOAD SECTION */}
          <div>
            <label className={labelClass}>Product Image</label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="h-24 w-24 shrink-0 rounded-lg border border-white/15 bg-gray-800 overflow-hidden flex items-center justify-center">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-600" />
                )}
              </div>
              {/* Upload controls */}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/10 text-white px-4 py-2 text-sm hover:bg-white/20 transition-colors disabled:opacity-50 border border-white/15"
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload from Computer
                    </>
                  )}
                </button>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/product-catalogue/... or uploaded URL"
                  className={inputClass + " text-xs"}
                />
                <p className="text-[10px] text-gray-500">
                  Upload JPEG/PNG/WebP (max 10MB) or paste image URL
                </p>
              </div>
            </div>
          </div>

          {/* Model + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Model Number *</label>
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className={inputClass} placeholder="LRMB-132" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-gray-900">{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Product Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="45L Solid Door Compressor Mini Bar" />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass + " resize-none"} placeholder="Product description..." />
          </div>

          {/* Price + Sort Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (optional)</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="₹6,700" />
            </div>
            <div>
              <label className={labelClass}>Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass + " mb-0"}>Specifications</label>
              <button type="button" onClick={addSpec} className="inline-flex items-center gap-1 rounded-lg bg-white/10 text-white px-3 py-1 text-xs hover:bg-white/20 border border-white/15">
                <Plus className="h-3 w-3" /> Add Spec
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => updateSpec(i, "label", e.target.value)}
                    className={inputClass + " flex-1"}
                    placeholder="Label (e.g. Capacity)"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    className={inputClass + " flex-1"}
                    placeholder="Value (e.g. 40 Litres)"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {specs.length === 0 && (
                <p className="text-xs text-gray-500 py-2">No specs yet. Click "Add Spec" to add specifications.</p>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-yellow-500"
              />
              <span className="text-sm text-white">Featured</span>
              <Star className={`h-3.5 w-3.5 ${featured ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} />
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-yellow-500"
              />
              <span className="text-sm text-white">Published</span>
              {published ? <Eye className="h-3.5 w-3.5 text-green-400" /> : <EyeOff className="h-3.5 w-3.5 text-gray-600" />}
            </label>
          </div>
        </div>

        {/* Footer — sticky at bottom of modal */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 px-6 py-4 flex gap-3 rounded-b-xl">
          <button type="button" onClick={handleSave} className={btnPrimary + " flex-1"}>
            <Check className="inline h-4 w-4 mr-1" /> Save Product
          </button>
          <button type="button" onClick={onClose} className={btnSecondary}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
