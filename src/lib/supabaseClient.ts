import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const FALLBACK_SUPABASE_URL = "https://nktowpkldpwbbvchcuzu.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdG93cGtsZHB3YmJ2Y2hjdXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTI4MDMsImV4cCI6MjA4ODcyODgwM30.azhFf3o-NQtlekbFD099NFm4n4QkKyE22saDtQolZj0";

const normalizeJwtBase64 = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
};

const decodeProjectRefFromKey = (key: string | undefined) => {
  if (!key) return null;

  try {
    const payload = key.split(".")[1];
    if (!payload) return null;
    const parsed = JSON.parse(atob(normalizeJwtBase64(payload)));
    return typeof parsed?.ref === "string" ? parsed.ref : null;
  } catch {
    return null;
  }
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const maskKey = (key: string) => `${key.slice(0, 8)}...${key.slice(-6)}`;

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const expectedUrl = projectId ? `https://${projectId}.supabase.co` : FALLBACK_SUPABASE_URL;

const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const envPublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const envKey = envAnonKey || envPublishableKey;

const envUrlMatchesProject = !!envUrl && (!!projectId ? envUrl.includes(`${projectId}.supabase.co`) : true);
const envKeyProjectRef = decodeProjectRefFromKey(envKey);
const envKeyMatchesProject = !!envKey && (!!projectId ? envKeyProjectRef === projectId : true);

const supabaseUrl = (envUrlMatchesProject ? envUrl : expectedUrl) ?? expectedUrl;
const supabaseAnonKey = (envKeyMatchesProject ? envKey : FALLBACK_SUPABASE_ANON_KEY) ?? FALLBACK_SUPABASE_ANON_KEY;

export const getSupabaseDiagnostics = () => ({
  projectId,
  supabaseHost: isValidUrl(supabaseUrl) ? new URL(supabaseUrl).host : "invalid_url",
  hasEnvUrl: !!envUrl,
  hasEnvAnonKey: !!envAnonKey,
  hasEnvPublishableKey: !!envPublishableKey,
  usingUrlFallback: !envUrlMatchesProject,
  usingKeyFallback: !envKeyMatchesProject,
  keyPreview: maskKey(supabaseAnonKey),
});

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey) {
  console.error("[Supabase Init] Invalid authentication configuration", getSupabaseDiagnostics());
} else {
  console.info("[Supabase Init] Client configured", getSupabaseDiagnostics());
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
