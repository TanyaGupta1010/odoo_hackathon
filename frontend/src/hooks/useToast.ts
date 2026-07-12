import { useState } from "react";

export default function useToast() {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [type, setType] = useState<
    "success" | "error" | "info"
  >("info");

  function showToast(
    toastType: "success" | "error" | "info",
    toastTitle: string,
    toastMessage = ""
  ) {
    setType(toastType);

    setTitle(toastTitle);

    setMessage(toastMessage);

    setOpen(true);

    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }

  return {
    open,
    title,
    message,
    type,
    showToast,
    close: () => setOpen(false),
  };
}