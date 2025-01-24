import { Toaster, toast } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          maxWidth: "100%",
          width: "auto",
          minHeight: "8vh",
          fontSize: "0.875rem",
          padding: "0.5rem 2.7rem 0.5rem 1rem",
          borderRadius: "8px",
          textAlign: "left",
        },
        success: {
          style: {
            background: "text-primary",
            color: "#0f5132",
          },
        },
        error: {
          style: {
            background: "#f8d7da",
            color: "#842029",
          },
        },
      }}
    />
  );
};

export const showToast = (message: string, type: "success" | "error" = "success") => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  }
};
