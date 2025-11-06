import { createClient } from "@supabase/supabase-js";

// Read Vite env vars (must be prefixed with VITE_): VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let supabase;

if (!supabaseUrl || !supabaseKey) {
  // Warn in dev and export a safe stub so the app doesn't crash on import.
  // Auth methods return { data: null, error: Error } so calling code can handle it.

  console.warn(
    "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing — configure your .env"
  );

  const notConfigured = async () => ({
    data: null,
    error: new Error(
      "Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env"
    ),
  });

  supabase = {
    auth: {
      signInWithPassword: notConfigured,
      signInWithOAuth: notConfigured,
      signUp: notConfigured,
      // small stub for auth listener
      onAuthStateChange: () => ({
        data: null,
        subscription: { unsubscribe: () => {} },
      }),
    },
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };

// Create a .env file in the project root with these variables (do NOT include this block in JS):
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_ANON_KEY=your-public-anon-key
