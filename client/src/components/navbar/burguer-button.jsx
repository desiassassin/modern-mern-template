import { useSidebarContext } from "@contexts/layout-context";
import { Menu } from "lucide-react";

export const BurguerButton = () => {
     const { collapsed, setCollapsed } = useSidebarContext();

     return <Menu className="cursor-pointer" size={20} onClick={setCollapsed} />;
};
