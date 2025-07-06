import React from "react";
import { Sidebar } from "./sidebar.styles";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "@contexts/layout-context";
import { useLocation } from "react-router-dom";
import { Box, ChartNoAxesCombined, Coins, UsersRound } from "lucide-react";

export const SidebarWrapper = () => {
     const { pathname } = useLocation();
     const { collapsed, setCollapsed } = useSidebarContext();

     return (
          <aside className="z-[41]">
               {/* overlay behind the sidebar */}
               {!collapsed ? (
                    <div
                         className="bg-[rgb(15_23_42/0.3)] fixed inset-0 z-[49] opacity-80 transition-opacity md:hidden md:z-auto md:opacity-100"
                         onClick={setCollapsed}
                    />
               ) : null}
               <div
                    className={Sidebar({
                         collapsed: collapsed
                    })}
               >
                    <div className="px-6">
                         {/* {company.logo} */}
                         <h3 className="text-2xl font-medium m-0 text-default-900 whitespace-nowrap">Your App</h3>
                    </div>
                    <div className="flex flex-col gap-6 mt-3 px-2">
                         <SidebarMenu>
                              <SidebarItem
                                   href="/dashboard/insights"
                                   isActive={pathname.includes("/dashboard/insights")}
                                   title="Insights"
                                   icon={<ChartNoAxesCombined size={20} />}
                              />
                         </SidebarMenu>
                    </div>
               </div>
          </aside>
     );
};
