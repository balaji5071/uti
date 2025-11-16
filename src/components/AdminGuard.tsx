import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Admin from "../pages/Admin";

export default function AdminGuard() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Load existing auth session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setLoading(false);
    };

    getSession();

    // Listen to login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      setError(error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>

          <form onSubmit={login} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Admin Email"
              className="w-full p-3 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              required
              placeholder="Password"
              className="w-full p-3 border rounded"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button className="w-full bg-rose-500 text-white p-3 rounded-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Admin onLogout={logout} />;
}
