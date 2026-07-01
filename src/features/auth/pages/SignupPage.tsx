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
  const redirect = searchParams.get("redirect") || "/";

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

          <button
            type="button"
            onClick={() => toast.info(t("auth.signup.googleSoon"))}
            className="w-full border border-black/40 h-14 rounded-sm flex items-center justify-center gap-4 hover:bg-black/5 transition-all active:scale-[0.98] opacity-70 cursor-not-allowed"
            title={t("auth.signup.googleSoon")}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="text-base font-poppins text-black">{t("auth.signup.withGoogle")}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-black/70 font-poppins">{t("auth.signup.hasAccount")}</p>
          <Link
            to={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-medium font-poppins text-black border-b border-black/50 hover:border-black transition-all pb-1"
          >
            {t("auth.signup.login")}
          </Link>
        </div>
      </form>
    </div>
  );
}

