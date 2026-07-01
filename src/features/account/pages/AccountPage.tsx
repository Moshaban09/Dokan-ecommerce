import { useAuth } from "@/features/auth";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AccountSidebar } from "../components/AccountSidebar";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { useEffect } from "react";

type ProfileFormValues = z.infer<typeof profileSchema>;

const profileSchema = z.object({
  firstName: z.string().min(2, "common.required"),
  lastName: z.string().min(2, "common.required"),
  email: z.string().email("common.invalidEmail"),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmNewPassword) return false;
  return true;
}, {
  message: "account.profile.passwordMismatch",
  path: ["confirmNewPassword"],
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) return false;
  return true;
}, {
  message: "account.profile.currentPasswordRequired",
  path: ["currentPassword"],
});

export default function AccountPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("account.sidebar.myProfile"));
  const { user, updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });


  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) return;
    toast.loading(t("account.profile.saving"), { id: "profile-update" });

    try {
      await updateUser({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email !== user.email ? data.email : undefined,
        password: data.newPassword || undefined,
      });

      toast.success(t("account.profile.success"), {
        id: "profile-update",
        icon: <CheckCircle size={16} />,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message, { id: "profile-update" });
    }
  };

  return (
    <div className="max-w-360 mx-auto px-4 py-20 min-h-[50vh]">
      {}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
        <Breadcrumb
          items={[
            { label: t("common.home"), to: "/" },
            { label: t("account.sidebar.myProfile"), active: true },
          ]}
          className="mb-0"
        />
        <div className="text-sm text-black whitespace-nowrap">
          {t("account.welcome")}{" "}
          <span className="text-primary font-medium">{user?.name || t("account.profile.guest")}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-20">
        {}
        <AccountSidebar />

        {}
        <div className="w-full md:w-3/4 shadow-[0_1px_13px_0_rgba(0,0,0,0.05)] bg-white px-8 md:px-14 py-10 rounded">
          <h2 className="text-primary font-medium text-xl mb-6">
            {t("account.profile.title")}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-black text-sm">{t("account.profile.firstName")}</label>
                <input
                  {...register("firstName")}
                  type="text"
                  placeholder={t("account.profile.firstName")}
                  className="h-12.5 bg-secondary rounded text-black px-4 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
                />
                {errors.firstName && <span className="text-xs text-red-500">{t(errors.firstName.message || "")}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-black text-sm">{t("account.profile.lastName")}</label>
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder={t("account.profile.lastName")}
                  className="h-12.5 bg-secondary rounded text-black px-4 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
                />
                {errors.lastName && <span className="text-xs text-red-500">{t(errors.lastName.message || "")}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-black text-sm">{t("account.profile.email")}</label>
              <input
                {...register("email")}
                type="email"
                placeholder={t("account.profile.emailPlaceholder")}
                className="h-12.5 bg-secondary rounded text-black px-4 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
              />
              {errors.email && <span className="text-xs text-red-500">{t(errors.email.message || "")}</span>}
            </div>


            <div className="flex flex-col gap-4 mt-2">
              <label className="text-black text-sm">{t("account.profile.passwordChanges")}</label>
              <div className="flex flex-col gap-2">
                <input
                  {...register("currentPassword")}
                  type="password"
                  placeholder={t("account.profile.currentPassword")}
                  className="h-12.5 bg-secondary rounded text-black px-4 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
                />
                {errors.currentPassword && <span className="text-xs text-red-500">{t(errors.currentPassword.message || "")}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  {...register("newPassword")}
                  type="password"
                  placeholder={t("account.profile.newPassword")}
                  className="h-12.5 bg-secondary rounded text-black px-4 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
                />
                {errors.newPassword && <span className="text-xs text-red-500">{t(errors.newPassword.message || "")}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  {...register("confirmNewPassword")}
                  type="password"
                  placeholder={t("account.profile.confirmNewPassword")}
                  className="h-12.5 bg-secondary rounded text-black px-4 focus:outline-none focus:ring-1 focus:ring-black/20 transition-all"
                />
                {errors.confirmNewPassword && <span className="text-xs text-red-500">{t(errors.confirmNewPassword.message || "")}</span>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-6 mt-4">
              <button
                type="button"
                onClick={() => reset()}
                className="text-black hover:text-black/70 transition-colors font-medium cursor-pointer"
              >
                {t("account.profile.cancel")}
              </button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white h-14 px-12 rounded hover:bg-primary hover:-translate-y-1 disabled:opacity-70 transition-all font-medium cursor-pointer"
              >
                {isSubmitting ? t("account.profile.saving") : t("account.profile.saveChanges")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
