import { useState, useMemo } from "react";
import { useAllProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { invokeAdminFunction } from "@/lib/adminApi";
import { Loader2, Pencil, Plus, Trash } from "lucide-react";

export default function StockManager() {
  const { data: products = [], isLoading } = useAllProducts();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.categoryId ?? "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const openEditor = (product: any) => {
    setSelectedProduct({
      ...product,
      sizes: product.sizes || [],
      sizeStock: product.sizeStock || {},
    });
    setDialogOpen(true);
  };

  const addSize = () => {
    const size = prompt("Enter new size (e.g., S, M, XL, 30, 32):");
    if (!size) return;

    const clean = size.trim();
    if (!clean) return;

    if (selectedProduct.sizes.includes(clean)) {
      toast.error("Size already exists");
      return;
    }

    setSelectedProduct((prev: any) => ({
      ...prev,
      sizes: [...prev.sizes, clean],
      sizeStock: { ...prev.sizeStock, [clean]: 0 },
    }));
  };

  const removeSize = (size: string) => {
    setSelectedProduct((prev: any) => {
      const newSizes = prev.sizes.filter((s: string) => s !== size);
      const { [size]: _, ...remainingStock } = prev.sizeStock;
      return { ...prev, sizes: newSizes, sizeStock: remainingStock };
    });
  };

  const saveChanges = async () => {
  try {
    setSaving(true);

    const sessionToken = sessionStorage.getItem("admin_session_token");
    if (!sessionToken) {
      toast.error("Admin session missing. Please login again.");
      return;
    }

    const result = await invokeAdminFunction("admin-update-size-stock", {
      sessionToken,
      productId: selectedProduct.id,
      sizes: selectedProduct.sizes,
      sizeStock: selectedProduct.sizeStock,
    });

    if (!result.success) throw new Error(result.error || "Failed");

    toast.success("Sizes & stock updated");
    setDialogOpen(false);
  } catch (err: any) {
    toast.error(err.message || "Error saving");
  } finally {
    setSaving(false);
  }
};

  if (isLoading)
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        Loading products…
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Stock Manager</h1>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {/* Product List */}
      <div className="rounded-xl border bg-card divide-y">
        {filteredProducts.length === 0 && (
          <p className="p-6 text-muted-foreground text-center">
            No products found.
          </p>
        )}

        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 hover:bg-muted/50 transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.imageUrl || "/placeholder.svg"}
                alt={p.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <p className="font-semibold">{p.name}</p>
                {p.sizes?.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Sizes: {p.sizes.join(", ")}
                  </p>
                ) : (
                  <p className="text-xs text-blue-600 font-medium">
                    Free Size / No Variants
                  </p>
                )}
              </div>
            </div>

            <Button size="sm" onClick={() => openEditor(p)}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          </div>
        ))}
      </div>

      {/* Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Sizes & Stock</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6 mt-4">
              <div>
                <p className="font-semibold">{selectedProduct.name}</p>
                <p className="text-sm text-muted-foreground">
                  Edit sizes & stock
                </p>
              </div>

              {/* Sizes Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Sizes</Label>
                  <Button size="sm" variant="outline" onClick={addSize}>
                    <Plus className="w-4 h-4 mr-1" /> Add Size
                  </Button>
                </div>

                {selectedProduct.sizes.length === 0 && (
                  <p className="text-sm text-blue-600">
                    No sizes set. Product will be considered FREE SIZE.
                  </p>
                )}

                <div className="space-y-3">
                  {selectedProduct.sizes.map((size: string) => (
                    <div
                      key={size}
                      className="flex items-center gap-3 border rounded-lg p-2"
                    >
                      <div className="w-10 font-semibold">{size}</div>

                      <Input
                        type="number"
                        value={selectedProduct.sizeStock[size] ?? 0}
                        onChange={(e) =>
                          setSelectedProduct((prev: any) => ({
                            ...prev,
                            sizeStock: {
                              ...prev.sizeStock,
                              [size]: Number(e.target.value),
                            },
                          }))
                        }
                      />

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeSize(size)}
                        className="text-destructive"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <Button className="w-full" onClick={saveChanges} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
