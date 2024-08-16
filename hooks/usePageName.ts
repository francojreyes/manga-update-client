"use client";

import { usePathname } from "next/navigation";

const usePageName = () => {
  const pathname = usePathname();

  if (pathname.includes("manga")) {
    return "Manga List";
  } else if (pathname.includes("webhooks")) {
    return "Webhook List";
  } else if (pathname.includes("members")) {
    return "Members";
  } else if (pathname.includes("settings")) {
    return "Settings";
  } else {
    return undefined;
  }
};

export default usePageName;
