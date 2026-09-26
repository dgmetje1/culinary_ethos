import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer
      className={cn(
        "w-full border-t mt-20",
        "bg-white/70 dark:bg-stone-950/70",
        "backdrop-blur-xl",
        "border-stone-200/50 dark:border-stone-800/50",
      )}
    >
      <div
        className={cn(
          "max-w-[1200px] mx-auto",
          "py-12 px-8",
          "flex flex-col md:flex-row",
          "justify-between items-center",
          "gap-8",
        )}
      >
        <div className={cn("flex flex-col items-center md:items-start", "gap-2")}>
          <span className={cn("text-lg font-serif italic", "text-stone-900 dark:text-stone-100")}>
            {t("layout.footer.brand")}
          </span>
          <p
            className={cn(
              "text-xs uppercase tracking-widest",
              "text-stone-400 dark:text-stone-500",
              "mt-2",
            )}
          >
            {t("layout.footer.copyright")}
          </p>
        </div>
        <div className="flex gap-8 flex-wrap justify-center">
          <a
            href="#"
            className={cn(
              "text-xs uppercase tracking-widest",
              "text-stone-400 dark:text-stone-500",
              "hover:text-stone-900 dark:hover:text-stone-200",
              "underline decoration-stone-200 dark:decoration-stone-700",
              "opacity-100 transition-opacity",
            )}
          >
            {t("layout.footer.links.philosophy")}
          </a>
          <a
            href="#"
            className={cn(
              "text-xs uppercase tracking-widest",
              "text-stone-400 dark:text-stone-500",
              "hover:text-stone-900 dark:hover:text-stone-200",
              "underline decoration-stone-200 dark:decoration-stone-700",
              "opacity-100 transition-opacity",
            )}
          >
            {t("layout.footer.links.terms")}
          </a>
          <a
            href="#"
            className={cn(
              "text-xs uppercase tracking-widest",
              "text-stone-400 dark:text-stone-500",
              "hover:text-stone-900 dark:hover:text-stone-200",
              "underline decoration-stone-200 dark:decoration-stone-700",
              "opacity-100 transition-opacity",
            )}
          >
            {t("layout.footer.links.privacy")}
          </a>
          <a
            href="#"
            className={cn(
              "text-xs uppercase tracking-widest",
              "text-stone-400 dark:text-stone-500",
              "hover:text-stone-900 dark:hover:text-stone-200",
              "underline decoration-stone-200 dark:decoration-stone-700",
              "opacity-100 transition-opacity",
            )}
          >
            {t("layout.footer.links.archive")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
