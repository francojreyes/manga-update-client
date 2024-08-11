"use client";
import { usePathname } from "next/navigation";

const usePageName = () => {
  const pathname = usePathname();
  const lastSegment = pathname.substring(pathname.lastIndexOf("/") + 1);

  switch (lastSegment) {
    case "manga":
      return "Manga List";
    case "webhooks":
      return "Webhook List";
    case "members":
      return "Members";
    case "settings":
      return "Settings";
    default:
      return "Unknown Page";
  }
};

export default usePageName;
