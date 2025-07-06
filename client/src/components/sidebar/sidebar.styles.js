import { tv } from "@heroui/react";

export const SidebarWrapper = tv({
     base: "dark:bg-black bg-white transition-transform w-52 shrink-0 z-[50] overflow-y-auto border-r border-divider flex-col gap-6 py-6 px-3 md:ml-0 md:flex md:h-screen fixed md:static top-0 h-full ",

     variants: {
          collapsed: {
               true: "ml-0 [display:inherit] md:fixed -translate-x-full"
          }
     }
});

export const Sidebar = Object.assign(SidebarWrapper, {});
