"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");  //email input
  const [password, setPassword] = useState(""); //password 
  const [errorMsg, setErrorMsg] = useState<string | null>(null); //error messMsg is a string 
  const [loading, setLoading] = useState(false); //loading string logic so it shows a string when our accountn is being created
  
  const router = useRouter();
  // Initialize the browser-side Supabase client
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Success! 
      alert("worked now login with your credentials");
      router.push("/"); // Redirect back to Login/Home
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Start tracking your favorite cities.</p>
        </header>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-blue-900/20"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <Link href="/" className="text-blue-500 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}