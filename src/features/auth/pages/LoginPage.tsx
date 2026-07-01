import { Link, useNavigate, Navigate, useSearchParams } from "react-router";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Button } from "@/components/ui/button";
import { UnderlineInput } from "@/components/ui/UnderlineInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "../hooks/use-auth";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().trim().email("validation.emailInvalid"),
  password: z.string().min(1, "validation.passwordRequired"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.login"));
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated) {
    return <Navigate to={redirect} replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      navigate(redirect, { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        const msg = error.message;
        toast.error(msg.startsWith("auth.") ? t(msg) : msg);
      } else {
        toast.error(t("common.error"));
      }
    }
  };

  return (
    <div className="w-full max-w-[339px]">
      <div className="flex flex-col gap-6 mb-12">
        <h1 className="text-4xl font-medium font-inter tracking-[1.44px] text-black">
          {t("auth.login.title")}
        </h1>
        <p className="text-base font-poppins text-black font-normal">
          {t("auth.login.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <UnderlineInput
            {...register("email")}
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
            error={errors.email?.message ? t(errors.email.message) : undefined}
          />

          <UnderlineInput
            {...register("password")}
            type="password"
            placeholder={t("auth.login.passwordPlaceholder")}
            error={errors.password?.message ? t(errors.password.message) : undefined}
          />
        </div>

        <div className="flex items-center justify-between gap-4 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary text-white h-14 px-12 rounded-sm text-base font-medium transition-all active:scale-[0.98] disabled:opacity-70 hover:-translate-y-1"
          >
            {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
          </Button>

          <Link
            to="/forgot-password"
            className="text-primary font-poppins hover:underline transition-all"
          >
            {t("auth.login.forgetPassword")}
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-black/70 font-poppins">{t("auth.login.noAccount")}</p>
          <Link
            to={`/signup${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium font-poppins text-black border-b border-black/50 hover:border-black transition-all pb-1"
          >
            {t("auth.login.signup")}
          </Link>
        </div>
      </form>
    </div>
  );
}

