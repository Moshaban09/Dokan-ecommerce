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
import { env } from "@/lib/env";
import { getSafeRedirect, withRedirect } from "@/lib/safe-redirect";

const signupSchema = z.object({
  name: z.string().trim().min(2, "validation.nameMin"),
  email: z.string().trim().email("validation.emailInvalid"),
  password: z.string().min(6, "validation.passwordMin"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.signup"));
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get("redirect"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  if (isAuthenticated) {
    return <Navigate to={redirect} replace />;
  }

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data);
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
    <div className="w-full max-w-[371px]">
      <div className="flex flex-col gap-6 mb-12">
        <h1 className="text-4xl font-medium font-inter tracking-[1.44px] text-black">
          {t("auth.signup.title")}
        </h1>
        <p className="text-base font-poppins text-black font-normal">
          {t("auth.signup.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <UnderlineInput
            {...register("name")}
            type="text"
            placeholder={t("auth.signup.namePlaceholder")}
            error={errors.name?.message ? t(errors.name.message) : undefined}
          />

          <UnderlineInput
            {...register("email")}
            type="email"
            placeholder={t("auth.signup.emailPlaceholder")}
            error={errors.email?.message ? t(errors.email.message) : undefined}
          />

          <UnderlineInput
            {...register("password")}
            type="password"
            placeholder={t("auth.signup.passwordPlaceholder")}
            error={errors.password?.message ? t(errors.password.message) : undefined}
          />
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary text-white h-14 rounded-sm text-base font-medium transition-all active:scale-[0.98] disabled:opacity-70 hover:-translate-y-1"
          >
            {isSubmitting ? t("auth.signup.submitting") : t("auth.signup.submit")}
          </Button>

          {env.enableGoogleAuth && (
            <button
              type="button"
              onClick={() => toast.info(t("auth.signup.googleSoon"))}
              className="w-full border border-black/40 h-14 rounded-sm flex items-center justify-center gap-4 hover:bg-black/5 transition-all active:scale-[0.98] opacity-70 cursor-not-allowed"
              title={t("auth.signup.googleSoon")}
            >
              <svg viewBox="0 0 48 48" className="w-6 h-6" aria-label="Google" role="img">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span className="text-base font-poppins text-black">{t("auth.signup.withGoogle")}</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-black/70 font-poppins">{t("auth.signup.hasAccount")}</p>
          <Link
            to={withRedirect("/login", redirect)}
            className="font-medium font-poppins text-black border-b border-black/50 hover:border-black transition-all pb-1"
          >
            {t("auth.signup.login")}
          </Link>
        </div>
      </form>
    </div>
  );
}

