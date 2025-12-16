import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { invokeAdminFunction } from "@/lib/adminApi";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Shield,
  Phone,
  Globe,
  Clock,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";

interface CODSecuritySettingsData {
  id: string;
  enable_cod_otp: boolean;
  max_cod_per_phone_per_day: number | null;
  max_cod_per_ip_per_day: number | null;
  max_cod_attempts_per_hour: number | null;
  require_phone_verification: boolean;
}

export function CODSecuritySettings() {
  const queryClient = useQueryClient();

  // Local state for form
  const [settings, setSettings] = useState<CODSecuritySettingsData>({
    id: "",
    enable_cod_otp: false,
    max_cod_per_phone_per_day: null,
    max_cod_per_ip_per_day: null,
    max_cod_attempts_per_hour: null,
    require_phone_verification: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch current settings
  const { data: fetchedSettings, isLoading } = useQuery({
    queryKey: ["cod-security-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cod_security_settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as CODSecuritySettingsData | null;
    },
  });

  // Update local state when fetched data changes
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
      setHasChanges(false);
    }
  }, [fetchedSettings]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const result = await invokeAdminFunction("admin-update-cod-security", {
        enable_cod_otp: settings.enable_cod_otp,
        max_cod_per_phone_per_day: settings.max_cod_per_phone_per_day,
        max_cod_per_ip_per_day: settings.max_cod_per_ip_per_day,
        max_cod_attempts_per_hour: settings.max_cod_attempts_per_hour,
        require_phone_verification: settings.require_phone_verification,
      });
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cod-security-settings"] });
      toast({
        title: "Settings saved",
        description: "COD security settings updated successfully.",
      });
      setHasChanges(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle toggle changes
  const handleToggle = (field: keyof CODSecuritySettingsData, value: boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Handle number input changes
  const handleNumberChange = (
    field: keyof CODSecuritySettingsData,
    value: string
  ) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    if (value !== "" && (isNaN(numValue!) || numValue! < 0)) return;
    setSettings((prev) => ({ ...prev, [field]: numValue }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-card border space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-card border">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">COD Security Settings</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Configure optional security features to prevent COD fraud and trolling.
        All features are disabled by default.
      </p>

      <div className="space-y-6">
        {/* Enable COD OTP */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="enable_cod_otp" className="font-medium">
                Enable COD OTP Verification
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Require customers to verify phone via OTP before placing COD orders.
              OTP expires in 5 minutes.
            </p>
          </div>
          <Switch
            id="enable_cod_otp"
            checked={settings.enable_cod_otp}
            onCheckedChange={(checked) => handleToggle("enable_cod_otp", checked)}
          />
        </div>

        {/* Max COD per phone per day */}
        <div className="pb-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="max_cod_per_phone" className="font-medium">
              Daily COD Limit Per Phone
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Maximum COD orders allowed per phone number per day. Leave empty for
            unlimited.
          </p>
          <Input
            id="max_cod_per_phone"
            type="number"
            min="0"
            placeholder="Unlimited"
            value={settings.max_cod_per_phone_per_day ?? ""}
            onChange={(e) =>
              handleNumberChange("max_cod_per_phone_per_day", e.target.value)
            }
            className="max-w-[200px]"
          />
        </div>

        {/* Max COD per IP per day */}
        <div className="pb-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="max_cod_per_ip" className="font-medium">
              Daily COD Limit Per IP Address
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Maximum COD orders allowed per IP address per day. Leave empty for
            unlimited.
          </p>
          <Input
            id="max_cod_per_ip"
            type="number"
            min="0"
            placeholder="Unlimited"
            value={settings.max_cod_per_ip_per_day ?? ""}
            onChange={(e) =>
              handleNumberChange("max_cod_per_ip_per_day", e.target.value)
            }
            className="max-w-[200px]"
          />
        </div>

        {/* Max COD attempts per hour */}
        <div className="pb-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="max_cod_attempts" className="font-medium">
              Max COD Attempts Per Hour
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Rate limit COD order attempts to prevent trolling. Leave empty for
            unlimited.
          </p>
          <Input
            id="max_cod_attempts"
            type="number"
            min="0"
            placeholder="Unlimited"
            value={settings.max_cod_attempts_per_hour ?? ""}
            onChange={(e) =>
              handleNumberChange("max_cod_attempts_per_hour", e.target.value)
            }
            className="max-w-[200px]"
          />
        </div>

        {/* Require phone verification */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <Label
                htmlFor="require_phone_verification"
                className="font-medium"
              >
                Require Phone Verification
              </Label>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Block COD if phone number is not verified via OTP. Similar to OTP
              verification above but explicitly blocks unverified phones.
            </p>
          </div>
          <Switch
            id="require_phone_verification"
            checked={settings.require_phone_verification}
            onCheckedChange={(checked) =>
              handleToggle("require_phone_verification", checked)
            }
          />
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            These settings help prevent fake COD orders and trolling. Enable them
            gradually based on your needs. OTP is sent via SMS (requires SMS
            gateway integration) or shown to admin via Telegram for testing.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!hasChanges || saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
