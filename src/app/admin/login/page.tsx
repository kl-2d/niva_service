"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Неверный логин или пароль");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1C] flex items-center justify-center p-4">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E07B00] mb-4 shadow-lg shadow-orange-900/40">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-2xl font-bold text-white uppercase tracking-widest"
            style={{ fontFamily: "var(--font-oswald, sans-serif)" }}
          >
            Нива Сервис
          </h1>
          <p className="text-stone-400 text-sm mt-1">Панель управления</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-white font-semibold text-lg mb-6">Вход в систему</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-stone-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Логин
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-stone-600 focus:outline-none focus:border-[#E07B00] focus:ring-1 focus:ring-[#E07B00] transition disabled:opacity-50"
                placeholder="admin"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-stone-400 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-stone-600 focus:outline-none focus:border-[#E07B00] focus:ring-1 focus:ring-[#E07B00] transition disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-[#E07B00] hover:bg-[#B86300] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Проверка...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-600 text-xs mt-6">
          Нива Сервис © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
