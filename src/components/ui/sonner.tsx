import { useThemeContext } from "@/contexts/ThemeContext";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useThemeContext();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:dark:bg-gray-900 group-[.toaster]:text-foreground group-[.toaster]:dark:text-gray-100 group-[.toaster]:border-border group-[.toaster]:dark:border-gray-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:dark:text-gray-200",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
