import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";

export default function AdminCoupons() {
  const queryClient = useQueryClient();

  // Fetch coupons
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Toggle Active
  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coupon updated");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  // Delete coupon
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coupon deleted");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button asChild>
          <Link to="/admin/coupons/new">
            <Plus className="h-4 w-4 mr-2" />
            New Coupon
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {coupons?.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No coupons yet. Create one now.
          </p>
        ) : (
          <div className="space-y-6">
            {coupons?.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{c.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.discount_type === "percent"
                        ? `${c.discount_value}% off`
                        : `₹${c.discount_value} off`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Min Order: ₹{c.min_order_value}
                      {c.max_discount && ` | Max Discount: ₹${c.max_discount}`}
                    </p>

                    {c.expires_at && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Expires: {new Date(c.expires_at).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Toggle Active */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Active</span>
                      <Switch
                        checked={c.is_active}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ id: c.id, is_active: checked })
                        }
                      />
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteMutation.mutate(c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
