import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Star, Eye, EyeOff } from "lucide-react";
import { loginSchema } from "../../utils/validation.js";
import { authApi } from "../../api/auth.js";
import { useAuthStore } from "../../store/auth.store.js";
import { getErrorMessage } from "../../utils/helpers.js";
import FormField from "../../components/ui/FormField.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await authApi.login(data.email, data.password);
      setAuth(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "STORE_OWNER") navigate("/owner/dashboard");
      else navigate("/user/stores");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-950 to-brand-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Star className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">StoreRating</h1>
          <p className="mt-1 text-sm text-white/60">Sign in to your account</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} onClose={() => setError("")} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Email" error={errors.email?.message} required>
              <input
                {...register("email")}
                type="email"
                className="input-base"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPw ? "text" : "password"}
                  className="input-base pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size="sm" /> : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-brand-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-white/40">
          Default admin: admin@storerating.dev / Admin@1234
        </p>
      </div>
    </div>
  );
}
