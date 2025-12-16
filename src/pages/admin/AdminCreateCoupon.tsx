import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AdminCreateCoupon() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "flat">("percent");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code || !value || !minOrder) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("coupons").insert({
      code: code.trim().toUpperCase(),
      discount_type: type,
      discount_value: Number(value),
      min_order_value: Number(minOrder),
      max_discount: maxDiscount ? Number(maxDiscount) : null,
      expires_at: expiry ? new Date(expiry).toISOString() : null,
      is_active: active,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to create coupon");
      console.error(error);
    } else {
      toast.success("Coupon created successfully");
      navigate("/admin/coupons");
    }
  };

  return (
    <div className="container py-10 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create New Coupon</h1>

      <div className="space-y-5 bg-card p-6 rounded-xl border">

        {/* Coupon Code */}
        <div>
          <Label>Coupon Code *</Label>
          <Input 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SUMMER10"
          />
        </div>

        {/* Discount Type */}
        <div>
          <Label>Discount Type *</Label>
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">Percentage (%)</SelectItem>
              <SelectItem value="flat">Flat Amount (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Discount Value */}
        <div>
          <Label>Discount Value *</Label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., 10 for 10% or 50 for ₹50 off"
          />
        </div>

        {/* Minimum Order */}
        <div>
          <Label>Minimum Order Value *</Label>
          <Input
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            placeholder="₹200"
          />
        </div>

        {/* Max Discount */}
        <div>
          <Label>Max Discount (optional)</Label>
          <Input
            type="number"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
            placeholder="₹50"
          />
        </div>

        {/* Expiry */}
        <div>
          <Label>Expiry Date (optional)</Label>
          <Input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between">
          <Label>Coupon Active</Label>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>

        {/* Submit */}
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Coupon"}
        </Button>

      </div>
    </div>
  );
}
