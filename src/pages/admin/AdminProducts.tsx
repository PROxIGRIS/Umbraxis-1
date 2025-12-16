// src/pages/admin/AdminProducts.tsx
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Loader2,
  UploadCloud,
  Download,
  FilePlus,
  ChevronsLeft,
  ChevronsRight,
  X,
  GripVertical,
  Banknote,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import Papa from 'papaparse';
import debounce from 'just-debounce-it';
import { invokeAdminFunction, uploadAdminImage } from '@/lib/adminApi';

const PAGE_SIZE = 12;

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading: productsLoading } = useAllProducts();
  const { data: categories = [] } = useCategories();

  // UI state
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    unit: '',
    imageUrl: '',
    images: [] as string[],
    isFeatured: false,
    isActive: true,
    codAllowed: true,
    allowBackorder: false,
  });

  // Image upload state
  const [csvImportLoading, setCsvImportLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedSet = useMemo(() => debounce((v: string) => setDebouncedSearch(v), 250), []);

  useEffect(() => {
    debouncedSet(search);
  }, [search, debouncedSet]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.unit || '').toLowerCase().includes(q)
    );
  }, [products, debouncedSearch]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil((filteredProducts || []).length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      unit: '',
      imageUrl: '',
      images: [],
      isFeatured: false,
      isActive: true,
      codAllowed: true,
      allowBackorder: false,
    });
    setEditingProductId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      categoryId: product.categoryId || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock?.toString() || '0',
      unit: product.unit || '',
      imageUrl: product.imageUrl || '',
      images: product.images || [],
      isFeatured: !!product.isFeatured,
      isActive: product.isActive ?? true,
      codAllowed: product.codAllowed ?? true,
      allowBackorder: product.allowBackorder ?? false,
    });
    setIsDialogOpen(true);
  };

  // Upload image via Edge Function
  const handleImageFile = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const result = await uploadAdminImage(file);
      
      if (!result.success) {
        toast.error(result.error || 'Upload failed');
        return null;
      }
      
      return result.url || null;
    } catch (err: any) {
      console.error('Image upload error', err);
      toast.error(err?.message || 'Upload failed');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    for (const file of files) {
      const url = await handleImageFile(file);
      if (url) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, url],
          imageUrl: prev.imageUrl || url,
        }));
      }
    }
  }, []);

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        imageUrl: newImages[0] || '',
      };
    });
  };

  const setMainImage = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  // Submit form via Edge Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    try {
      const product = {
        name: formData.name,
        slug,
        categoryId: formData.categoryId,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock, 10),
        unit: formData.unit || '1 pc',
        imageUrl: formData.imageUrl || formData.images[0] || null,
        images: formData.images,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        codAllowed: formData.codAllowed,
        allowBackorder: formData.allowBackorder,
      };

      const result = await invokeAdminFunction('admin-upsert-product', {
        product,
        productId: editingProductId || undefined,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to save product');
      }

      toast.success(editingProductId ? 'Product updated successfully' : 'Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete via Edge Function
  const handleDelete = async (id: string) => {
    try {
      const result = await invokeAdminFunction('admin-delete-product', { productId: id });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete product');
      }
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  // Toggle field via Edge Function
  const updateField = async (id: string, field: string, value: any, successMsg?: string) => {
    try {
      const result = await invokeAdminFunction('admin-update-product-field', {
        productId: id,
        field,
        value,
      });
      
      if (!result.success) {
        throw new Error(result.error || `Failed to update ${field}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (successMsg) toast.success(successMsg);
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${field}`);
    }
  };

  const toggleVisibility = (id: string, currentState: boolean) => {
    updateField(id, 'is_active', !currentState);
  };

  const toggleFeatured = (id: string, currentState: boolean) => {
    updateField(id, 'is_featured', !currentState);
  };

  const toggleCod = (id: string, currentState: boolean) => {
    updateField(id, 'cod_allowed', !currentState, !currentState ? 'COD enabled' : 'COD disabled');
  };

  const toggleBackorder = (id: string, currentState: boolean) => {
    updateField(id, 'allow_backorder', !currentState, !currentState ? 'Backorder enabled' : 'Backorder disabled');
  };

  const updateStockInline = (id: string, value: number) => {
    updateField(id, 'stock', Math.max(0, value), 'Stock updated');
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Unknown';
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  // Bulk actions
  const toggleSelect = (id: string) => setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  
  const selectAllOnPage = () => {
    const ids = paginatedProducts.reduce((acc: Record<string, boolean>, p) => {
      acc[p.id] = true;
      return acc;
    }, {});
    setSelectedIds(ids);
  };
  
  const clearSelection = () => setSelectedIds({});
  
  // Bulk delete via Edge Function
  const bulkDelete = async () => {
    const ids = Object.keys(selectedIds).filter((k) => selectedIds[k]);
    if (ids.length === 0) return toast.error('No products selected');
    
    try {
      const result = await invokeAdminFunction('admin-bulk-delete-products', { productIds: ids });
      
      if (!result.success) {
        throw new Error(result.error || 'Bulk delete failed');
      }
      
      toast.success(`${ids.length} product(s) deleted`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      clearSelection();
      setIsBulkMode(false);
    } catch (error: any) {
      toast.error(error.message || 'Bulk delete failed');
    }
  };

  // CSV export
  const exportCSV = () => {
    const rows = filteredProducts.map((p) => ({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock,
      unit: p.unit,
      imageUrl: p.imageUrl,
      isFeatured: p.isFeatured ? '1' : '0',
      isActive: p.isActive ? '1' : '0',
      codAllowed: p.codAllowed ? '1' : '0',
      allowBackorder: p.allowBackorder ? '1' : '0',
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  // CSV import via Edge Function
  const importCSV = async (file: File) => {
    setCsvImportLoading(true);
    try {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true });
      const rows = parsed.data as any[];
      
      const result = await invokeAdminFunction('admin-csv-import', { products: rows });
      
      if (!result.success) {
        throw new Error(result.error || 'CSV import failed');
      }
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`CSV import complete: ${result.data?.imported || 0} imported`);
    } catch (error: any) {
      toast.error(error.message || 'CSV import failed');
    } finally {
      setCsvImportLoading(false);
    }
  };

  // Handle image file input
  const onImageSelected = async (file?: File) => {
    if (!file) return;
    const url = await handleImageFile(file);
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url],
        imageUrl: prev.imageUrl || url,
      }));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 w-48"
            />
          </div>

          <Button variant="outline" onClick={() => { setIsBulkMode(!isBulkMode); clearSelection(); }}>
            {isBulkMode ? 'Cancel' : 'Bulk'}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Fresh Milk"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹) *</Label>
                    <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Original Price</Label>
                    <Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock *</Label>
                    <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="e.g., 1 Kg" />
                  </div>
                </div>

                {/* Image Upload - Drag & Drop with Mobile Support */}
                <div className="space-y-3">
                  <Label>Product Images</Label>

                  {/* Hidden file input triggered programmatically */}
                  <input
                    ref={fileInputRef}
                    id="admin-image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(f => onImageSelected(f));
                      (e.target as HTMLInputElement).value = '';
                    }}
                  />

                  {/* Drag & Drop / Click area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-colors text-center select-none cursor-pointer ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    aria-label="Drop product images here or choose files"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    {/* Loading overlay */}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl z-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                      <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground mb-1" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop images here, or tap to choose</p>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          Choose Files
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = prompt('Paste image URL (optional):');
                            if (url) {
                              setFormData(prev => ({
                                ...prev,
                                images: [...prev.images, url],
                                imageUrl: prev.imageUrl || url,
                              }));
                            }
                          }}
                        >
                          Paste URL
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">Tap or click to choose files. Mobile will open the native picker.</p>
                    </div>

                    {/* Visual drop hint */}
                    <div
                      aria-hidden
                      className={`absolute inset-0 rounded-xl transition-opacity duration-150 ${
                        dragActive ? 'opacity-100 bg-primary/10 z-0' : 'opacity-0 pointer-events-none'
                      }`}
                    />
                  </div>

                  {/* Image Gallery */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
                      {formData.images.map((url, index) => (
                        <div
                          key={index}
                          className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            formData.imageUrl === url ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setMainImage(url)}
                        >
                          <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <GripVertical className="h-5 w-5 text-white" />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {formData.imageUrl === url && (
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold">
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.isFeatured} onCheckedChange={(c) => setFormData({ ...formData, isFeatured: c })} />
                    <Label className="text-sm">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.isActive} onCheckedChange={(c) => setFormData({ ...formData, isActive: c })} />
                    <Label className="text-sm">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.codAllowed} onCheckedChange={(c) => setFormData({ ...formData, codAllowed: c })} />
                    <Label className="text-sm flex items-center gap-1">
                      <Banknote className="h-3 w-3" />
                      COD
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={formData.allowBackorder} onCheckedChange={(c) => setFormData({ ...formData, allowBackorder: c })} />
                    <Label className="text-sm flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Backorder
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingProductId ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <label className="cursor-pointer">
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files && importCSV(e.target.files[0])} />
            <Button variant="outline" size="sm" asChild>
              <span>
                <FilePlus className="h-4 w-4 mr-2" />
                {csvImportLoading ? 'Importing...' : 'Import'}
              </span>
            </Button>
          </label>

          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {isBulkMode && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-secondary/50">
          <Button onClick={selectAllOnPage} variant="outline" size="sm">Select All</Button>
          <Button onClick={bulkDelete} size="sm" className="bg-destructive text-destructive-foreground">Delete Selected</Button>
          <div className="ml-auto text-sm text-muted-foreground">{Object.values(selectedIds).filter(Boolean).length} selected</div>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Options</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-3 px-4"><Skeleton className="h-10 w-48" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {isBulkMode && (
                          <input type="checkbox" checked={!!selectedIds[product.id]} onChange={() => toggleSelect(product.id)} />
                        )}
                        <img src={product.imageUrl || '/placeholder.svg'} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{getCategoryName(product.categoryId)}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium">₹{product.price}</span>
                      {product.originalPrice && <span className="text-xs text-muted-foreground line-through ml-1">₹{product.originalPrice}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={product.stock > 10 ? 'secondary' : product.stock > 0 ? 'outline' : 'destructive'}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </Badge>
                        <div className="flex items-center gap-0.5">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateStockInline(product.id, product.stock - 1)}>
                            <ChevronsLeft className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateStockInline(product.id, product.stock + 1)}>
                            <ChevronsRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={product.isActive ? 'default' : 'outline'} className="text-xs">{product.isActive ? 'Active' : 'Hidden'}</Badge>
                        {product.isFeatured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                        <Badge 
                          variant={product.codAllowed ? 'secondary' : 'outline'} 
                          className={`text-xs cursor-pointer ${!product.codAllowed && 'border-yellow-500 text-yellow-600'}`}
                          onClick={() => toggleCod(product.id, !!product.codAllowed)}
                        >
                          <Banknote className="h-3 w-3 mr-1" />
                          {product.codAllowed ? 'COD' : 'No COD'}
                        </Badge>
                        {product.allowBackorder && (
                          <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                            <Package className="h-3 w-3 mr-1" />
                            Backorder
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFeatured(product.id, product.isFeatured)} title="Toggle featured">
                          {product.isFeatured ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleVisibility(product.id, product.isActive)} title="Toggle visibility">
                          {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to delete "{product.name}"?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y">
          {productsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 space-y-3">
                <Skeleton className="h-16 w-full" />
              </div>
            ))
          ) : (
            paginatedProducts.map((product) => (
              <div key={product.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {isBulkMode && (
                    <input type="checkbox" checked={!!selectedIds[product.id]} onChange={() => toggleSelect(product.id)} className="mt-1" />
                  )}
                  <img src={product.imageUrl || '/placeholder.svg'} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{getCategoryName(product.categoryId)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-medium">₹{product.price}</span>
                      {product.originalPrice && <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>Are you sure you want to delete "{product.name}"?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={product.stock > 10 ? 'secondary' : product.stock > 0 ? 'outline' : 'destructive'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                  <Badge variant={product.isActive ? 'default' : 'outline'} className="text-xs">{product.isActive ? 'Active' : 'Hidden'}</Badge>
                  {product.isFeatured && <Badge variant="outline" className="text-xs">Featured</Badge>}
                  <Badge 
                    variant={product.codAllowed ? 'secondary' : 'outline'} 
                    className={`text-xs cursor-pointer ${!product.codAllowed && 'border-yellow-500 text-yellow-600'}`}
                    onClick={() => toggleCod(product.id, !!product.codAllowed)}
                  >
                    <Banknote className="h-3 w-3 mr-1" />
                    {product.codAllowed ? 'COD' : 'No COD'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
