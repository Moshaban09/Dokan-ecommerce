import { Link } from "react-router";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Button } from "@/components/ui/button";
import { UnderlineInput } from "@/components/ui/UnderlineInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("validation.emailInvalid"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("auth.forgotPassword.title"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (_data: ForgotPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success(t("auth.forgotPassword.success"));
  };

  return (
    <div className="w-full max-w-84.75">
      <div className="flex flex-col gap-6 mb-12">
        <h1 className="text-4xl font-medium font-inter tracking-[1.44px] text-black">
          {t("auth.forgotPassword.title")}
        </h1>
        <p className="text-base font-poppins text-black font-normal">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <UnderlineInput
            {...register("email")}
            type="email"
            placeholder={t("auth.forgotPassword.emailPlaceholder")}
            error={errors.email?.message ? t(errors.email.message) : undefined}
          />
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary text-white h-14 rounded-sm text-base font-medium transition-all active:scale-[0.98] disabled:opacity-70 hover:-translate-y-1"
          >
            {isSubmitting ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
          </Button>

          <Link
            to="/login"
            className="text-center text-black/70 font-poppins hover:text-black transition-all"
          >
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </form>
    </div>
  );
}
