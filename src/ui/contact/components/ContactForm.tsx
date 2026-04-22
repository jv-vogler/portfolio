"use client";

import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Textarea } from "@/ui/components/ui/textarea";
import { useContactForm } from "@/ui/contact/hooks/useContactForm";
import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";

export function ContactForm() {
  const t = useTranslations("contact");
  const { form, onSubmit, isSubmitting, submitResult } = useContactForm();
  const {
    register,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!submitResult) return;

    if (submitResult.success) {
      toast.success(t("success"));
    } else {
      toast.error(submitResult.error ?? t("error"));
    }
  }, [submitResult, t]);

  return (
    <form onSubmit={onSubmit} className="space-y-5" aria-label={t("heading")}>
      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          {t("name")}
        </label>
        <Input
          id="name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          {t("email")}
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          {t("message")}
        </label>
        <Textarea
          id="message"
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          autoComplete="off"
          placeholder={t("messagePlaceholder")}
          disabled={isSubmitting}
          className="min-h-32"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-sm text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {t("submit")}
      </Button>
    </form>
  );
}
