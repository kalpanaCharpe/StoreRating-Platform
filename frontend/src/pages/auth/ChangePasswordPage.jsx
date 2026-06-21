import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { changePasswordSchema } from "../../utils/validation.js";
import { authApi } from "../../api/auth.js";
import { getErrorMessage } from "../../utils/helpers.js";
import FormField from "../../components/ui/FormField.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Spinner from "../../components/ui/Spinner.jsx";

export default function ChangePasswordPage() {
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      setSuccess("Password updated successfully.");
      reset();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Change Password</h1>
        <p className="mt-1 text-sm text-gray-500">Update your login credentials below.</p>
      </div>

      <div className="card max-w-md p-6">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
          <KeyRound className="h-5 w-5 text-brand-600" />
        </div>

        {error && (
          <div className="mb-5">
            <Alert type="error" message={error} onClose={() => setError("")} />
          </div>
        )}
        {success && (
          <div className="mb-5">
            <Alert type="success" message={success} onClose={() => setSuccess("")} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Current password" error={errors.currentPassword?.message} required>
            <div className="relative">
              <input
                {...register("currentPassword")}
                type={showCur ? "text" : "password"}
                className="input-base pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCur((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="New password" error={errors.newPassword?.message} required hint="8–16 chars, one uppercase, one special character">
            <div className="relative">
              <input
                {...register("newPassword")}
                type={showNew ? "text" : "password"}
                className="input-base pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm new password" error={errors.confirmPassword?.message} required>
            <input
              {...register("confirmPassword")}
              type="password"
              className="input-base"
              placeholder="••••••••"
            />
          </FormField>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Spinner size="sm" /> : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
