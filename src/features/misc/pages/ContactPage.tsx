import { PageContainer } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "@/components/common/Breadcrumb";

const contactSchema = z.object({
  name: z.string().trim().min(2, "common.required"),
  email: z.string().trim().email("common.invalidEmail"),
  phone: z
    .string()
    .trim()
    .min(10, "common.required"),
  message: z.string().trim().min(10, "common.required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.contact"));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async () => {
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success(t("contact.form.success"));
    reset();
  };
  return (
    <PageContainer className="py-20 flex flex-col">
      <Breadcrumb 
        items={[
          { label: t("common.home"), to: "/" },
          { label: t("nav.contact"), active: true }
        ]} 
        className="mb-20"
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {}
        <div className="w-full lg:w-1/3 bg-white shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] rounded-sm p-8 md:p-10 flex flex-col gap-8">
          {}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <Phone size={20} />
              </div>
              <h3 className="text-base font-medium font-poppins text-black">
                {t("contact.callToUs.title")}
              </h3>
            </div>
            <div className="flex flex-col gap-4 text-sm font-poppins text-black">
              <p>{t("contact.callToUs.desc")}</p>
              <p>{t("contact.callToUs.phone")}</p>
            </div>
          </div>

          <div className="h-px bg-black/50 w-full" />

          {}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <Mail size={20} />
              </div>
              <h3 className="text-base font-medium font-poppins text-black">
                {t("contact.writeToUs.title")}
              </h3>
            </div>
            <div className="flex flex-col gap-4 text-sm font-poppins text-black">
              <p>{t("contact.writeToUs.desc")}</p>
              {t("contact.writeToUs.emails").split('\n').map((email, idx) => (
                <p key={idx}>{email}</p>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="w-full lg:w-2/3 bg-white shadow-[0px_1px_13px_0px_rgba(0,0,0,0.05)] rounded-sm p-8 md:p-10">
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <Input
                    {...register("name")}
                    placeholder=" "
                    className={`bg-secondary text-black border-0 focus:ring-1 focus-visible:ring-1 focus-visible:ring-offset-0 h-12.5 rounded-sm px-4 pe-8 peer transition-all outline-none ${
                      errors.name
                        ? "ring-1 ring-red-500"
                        : "focus:ring-primary focus-visible:ring-primary"
                    }`}
                  />
                  <label className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none transition-all peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                    {t("contact.form.name")} <span className="text-primary">*</span>
                  </label>
                </div>
                {errors.name && (
                  <span className="text-xs text-red-500 font-poppins">
                    {t(errors.name.message as string)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder=" "
                    className={`bg-secondary text-black border-0 focus:ring-1 focus-visible:ring-1 focus-visible:ring-offset-0 h-12.5 rounded-sm px-4 pe-8 peer transition-all outline-none ${
                      errors.email
                        ? "ring-1 ring-red-500"
                        : "focus:ring-primary focus-visible:ring-primary"
                    }`}
                  />
                  <label className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none transition-all peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                    {t("contact.form.email")} <span className="text-primary">*</span>
                  </label>
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500 font-poppins">
                    {t(errors.email.message as string)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative group">
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder=" "
                    className={`bg-secondary text-black border-0 focus:ring-1 focus-visible:ring-1 focus-visible:ring-offset-0 h-12.5 rounded-sm px-4 pe-8 peer transition-all outline-none ${
                      errors.phone
                        ? "ring-1 ring-red-500"
                        : "focus:ring-primary focus-visible:ring-primary"
                    }`}
                  />
                  <label className="absolute inset-s-4 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none transition-all peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                    {t("contact.form.phone")} <span className="text-primary">*</span>
                  </label>
                </div>
                {errors.phone && (
                  <span className="text-xs text-red-500 font-poppins">
                    {t(errors.phone.message as string)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative group">
                <Textarea
                  {...register("message")}
                  placeholder=" "
                  className={`bg-secondary text-black border-0 focus:ring-1 focus-visible:ring-1 focus-visible:ring-offset-0 min-h-50 rounded-sm p-4 resize-none peer transition-all outline-none ${
                    errors.message
                      ? "ring-1 ring-red-500"
                      : "focus:ring-primary focus-visible:ring-primary"
                  }`}
                />
                <label className="absolute inset-s-4 top-4 text-black/50 pointer-events-none transition-all peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:opacity-0">
                  {t("contact.form.message")} <span className="text-primary">*</span>
                </label>
              </div>
              {errors.message && (
                <span className="text-xs text-red-500 font-poppins">
                  {t(errors.message.message as string)}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary text-white px-12 py-4 h-auto text-base font-medium rounded-sm transition-all duration-300 active:scale-95 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

