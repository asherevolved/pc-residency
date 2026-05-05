"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CreditCard, ShieldCheck, Zap, CheckCircle2, ArrowRight,
  AlertCircle, Globe, Key
} from "lucide-react";

interface PaymentSettings {
  id: string;
  processor_name: string;
  merchant_id: string | null;
  api_key_public: string | null;
  api_key_secret: string | null;
  is_live_mode: boolean;
  onboarding_complete: boolean;
  webhook_url: string | null;
}

export default function PaymentsTab() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    merchant_id: "",
    api_key_public: "",
    api_key_secret: "",
    webhook_url: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const { data } = await supabase.from("payment_settings").select("*").limit(1).single();
    if (data) {
      setSettings(data as PaymentSettings);
      setForm({
        merchant_id: data.merchant_id || "",
        api_key_public: data.api_key_public || "",
        api_key_secret: data.api_key_secret || "",
        webhook_url: data.webhook_url || "",
      });
      if (data.onboarding_complete) setStep(3);
      else if (data.api_key_public) setStep(2);
      else if (data.merchant_id) setStep(1);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const nextStep = async () => {
    setSaving(true);
    if (step === 0) {
      const mid = `MID-${Date.now().toString(36).toUpperCase()}`;
      await supabase.from("payment_settings").update({ merchant_id: mid }).eq("id", settings!.id);
      setForm((f) => ({ ...f, merchant_id: mid }));
      setStep(1);
    } else if (step === 1) {
      const pubKey = `pk_test_${randomStr(24)}`;
      const secKey = `sk_test_${randomStr(32)}`;
      await supabase.from("payment_settings").update({
        api_key_public: pubKey,
        api_key_secret: secKey,
      }).eq("id", settings!.id);
      setForm((f) => ({ ...f, api_key_public: pubKey, api_key_secret: secKey }));
      setStep(2);
    } else if (step === 2) {
      const webhookUrl = `https://bozbzatnmqfjbcxnkkxp.supabase.co/functions/v1/payment-webhook`;
      await supabase.from("payment_settings").update({
        webhook_url: webhookUrl,
        onboarding_complete: true,
      }).eq("id", settings!.id);
      setForm((f) => ({ ...f, webhook_url: webhookUrl }));
      setStep(3);
    }
    setSaving(false);
    fetchSettings();
  };

  const resetOnboarding = async () => {
    await supabase.from("payment_settings").update({
      merchant_id: null,
      api_key_public: null,
      api_key_secret: null,
      webhook_url: null,
      onboarding_complete: false,
      is_live_mode: false,
    }).eq("id", settings!.id);
    setStep(0);
    setForm({ merchant_id: "", api_key_public: "", api_key_secret: "", webhook_url: "" });
    fetchSettings();
  };

  const toggleLiveMode = async () => {
    if (!settings) return;
    await supabase.from("payment_settings").update({
      is_live_mode: !settings.is_live_mode,
    }).eq("id", settings.id);
    fetchSettings();
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;
  if (!settings) return <div className="empty-state"><AlertCircle size={36} /><p>No payment settings found</p></div>;

  const steps = [
    { title: "Register Merchant", desc: "Create your merchant account with HotelPay" },
    { title: "Generate API Keys", desc: "Get your public and secret API keys" },
    { title: "Configure Webhook", desc: "Set up payment notifications endpoint" },
    { title: "Complete", desc: "You're ready to accept payments!" },
  ];

  return (
    <>
      <div className="section-heading">
        <h2>Payment Processor Onboarding</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {settings.onboarding_complete && (
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={toggleLiveMode}>
              {settings.is_live_mode ? "🟢 Live Mode" : "🟡 Test Mode"}
            </button>
          )}
          {step > 0 && (
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={resetOnboarding}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {steps.map((_, i) => (
          <div key={i} className={`step ${i < step ? "done" : i === step ? "active" : ""}`} />
        ))}
      </div>

      {/* Steps */}
      <div style={{ display: "grid", gap: 16 }}>
        {steps.map((s, i) => (
          <div key={i} className="admin-card" style={{ opacity: i > step ? 0.4 : 1, transition: "opacity 0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i === step || i < step ? 16 : 0 }}>
              <div className={`stat-icon ${i < step ? "green" : i === step ? "rose" : ""}`} style={{ width: 40, height: 40 }}>
                {i < step ? <CheckCircle2 size={20} /> : [<CreditCard size={20} key={0} />, <Key size={20} key={1} />, <Globe size={20} key={2} />, <ShieldCheck size={20} key={3} />][i]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
                  Step {i + 1}: {s.title}
                </div>
                <div style={{ color: "#71717a", fontSize: 12 }}>{s.desc}</div>
              </div>
              {i < step && <span className="badge badge-confirmed">Done</span>}
            </div>

            {/* Step content */}
            {i === 0 && i <= step && form.merchant_id && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "#0f1117", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 11, color: "#71717a" }}>Merchant ID</span>
                <div className="font-mono" style={{ color: "#4ade80", fontSize: 14, marginTop: 2 }}>{form.merchant_id}</div>
              </div>
            )}
            {i === 1 && i <= step && form.api_key_public && (
              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "#0f1117", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 11, color: "#71717a" }}>Public Key</span>
                  <div className="font-mono" style={{ color: "#60a5fa", fontSize: 13, marginTop: 2 }}>{form.api_key_public}</div>
                </div>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "#0f1117", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 11, color: "#71717a" }}>Secret Key</span>
                  <div className="font-mono" style={{ color: "#fbbf24", fontSize: 13, marginTop: 2 }}>
                    {form.api_key_secret?.slice(0, 12)}{"•".repeat(20)}
                  </div>
                </div>
              </div>
            )}
            {i === 2 && i <= step && form.webhook_url && (
              <div style={{ padding: "12px 16px", borderRadius: 10, background: "#0f1117", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 11, color: "#71717a" }}>Webhook URL</span>
                <div className="font-mono" style={{ color: "#c084fc", fontSize: 13, marginTop: 2, wordBreak: "break-all" }}>{form.webhook_url}</div>
              </div>
            )}
            {i === 3 && step === 3 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", borderRadius: 12, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
                <Zap size={20} style={{ color: "#4ade80" }} />
                <span style={{ color: "#4ade80", fontWeight: 600, fontSize: 14 }}>
                  Payment processor is fully configured and {settings.is_live_mode ? "LIVE" : "in TEST mode"}
                </span>
              </div>
            )}

            {/* Action button for current step */}
            {i === step && step < 3 && (
              <button className="admin-btn admin-btn-primary mt-16" onClick={nextStep} disabled={saving}>
                {saving ? "Processing..." : steps[i].title} <ArrowRight size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function randomStr(len: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < len; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}
