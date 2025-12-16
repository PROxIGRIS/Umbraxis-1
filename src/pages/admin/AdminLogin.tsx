import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash, Phone, LockKeyhole } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyPhone = async () => {
    if (!phone.trim()) {
      toast.error("Enter phone number");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "verify-admin-phone",
        { body: { phone: phone.trim() } }
      );
      if (error) throw error;

      if (data?.isValid) {
        toast.success("Phone verified");
        setIsPhoneVerified(true);
      } else {
        toast.error("Phone not authorized");
      }
    } catch {
      toast.error("Failed to verify phone");
    }
    setLoading(false);
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-admin-otp");
      if (error) throw error;

      if (data.success) {
        toast.success("OTP sent to Telegram");
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Failed to send OTP");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("verify_admin_otp", {
        input_otp: otp,
      });
      if (error) throw error;

      const result = data as { success?: boolean; sessionToken?: string; error?: string };
      if (result.success && result.sessionToken) {
        sessionStorage.setItem("admin_session_token", result.sessionToken);
        toast.success("Login successful");
        navigate("/admin");
      } else {
        toast.error(result.error || "Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <ArrowLeft
            className="h-5 w-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1 className="text-xl font-bold">Admin Login</h1>
        </div>

        {step === "phone" && (
          <>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full h-11 rounded-lg border px-4"
                placeholder="Enter admin phone"
              />
            </div>

            {!isPhoneVerified ? (
              <Button className="w-full" onClick={verifyPhone} disabled={loading}>
                {loading ? "Verifying..." : "Verify Phone"}
              </Button>
            ) : (
              <Button className="w-full" onClick={sendOTP} disabled={loading}>
                {loading ? "Sending OTP..." : "Get OTP"}
              </Button>
            )}
          </>
        )}

        {step === "otp" && (
          <>
            <div>
              <label className="text-sm font-semibold flex items-center gap-2">
                <Hash className="h-4 w-4" /> Enter OTP
              </label>
              <input
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="mt-2 w-full h-11 rounded-lg border px-4 text-center tracking-widest text-lg"
                maxLength={6}
              />
            </div>

            <Button className="w-full" onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Login"}
            </Button>

            <Button variant="ghost" className="w-full" onClick={sendOTP}>
              Resend OTP
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
