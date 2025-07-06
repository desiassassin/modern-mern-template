import {
     Avatar,
     Button,
     Dropdown,
     DropdownItem,
     DropdownMenu,
     DropdownSection,
     DropdownTrigger,
     Input,
     Navbar,
     NavbarContent,
     Spinner
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "axios";
import React, { useEffect, useState, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLockedBody } from "@hooks/useBodyLock";
import { SidebarContext } from "@/contexts/layout-context";
import { BurguerButton } from "@/components/navbar/burguer-button";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
import useDebounce from "@/hooks/useDebounce";
import { useQueryParams } from "use-query-params";
import CONSTANTS from "@/constants";
import useDimensions from "@/hooks/useDimesions";
import { CircleQuestionMark, Settings, LogOut } from "lucide-react";

export default function Dashboard() {
     const [query, setQuery] = useQueryParams();
     const { isMobileLayout, windowDimensions } = useDimensions();

     const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobileLayout);
     const [locked, setLocked] = useLockedBody(false);
     const handleToggleSidebar = () => {
          setSidebarCollapsed(!sidebarCollapsed);
          setLocked(!sidebarCollapsed);
     };
     const navigate = useNavigate();
     const queryClient = useQueryClient();
     const location = useLocation();

     const [debouncedSearch, search, setSearch] = useDebounce(
          {
               [location.pathname]: query[CONSTANTS.SEARCH_PARAMS.SEARCH],
               setDefaultsOnChange: {}
          },
          2000
     );

     // queries
     const { data: userData, ...userQuery } = useQuery({
          queryKey: ["user"],
          queryFn: async function () {
               const response = await Axios({ method: "GET", url: `${import.meta.env.VITE_BASE_URL}/auth/user-data` });
               return response.data.data;
          }
     });

     // mutation
     const logoutMutation = useMutation({
          mutationFn: async function () {
               const response = await Axios({ method: "GET", url: `${import.meta.env.VITE_BASE_URL}/auth/logout` });
               return response;
          },
          onSuccess: function (response) {
               // remove all the cached query data
               queryClient.clear();
               navigate("/get-started", { replace: true });
               toast.success(response.data.message);
          }
     });

     function handleSearchChange(event) {
          const value = event.target.value;

          setSearch(
               (previousValues) => ({
                    ...previousValues,
                    [location.pathname]: value
               }),
               function () {
                    return function () {
                         // update search param along with some extra params according to the route's component
                         setQuery({ ...search.setDefaultsOnChange, [CONSTANTS.SEARCH_PARAMS.SEARCH]: value });
                    };
               }
          );
     }

     // function clearSearch() {
     //      const value = "";

     //      setSearch(
     //           (previousValues) => ({
     //                ...previousValues,
     //                [location.pathname]: value
     //           }),
     //           function () {
     //                return function () {
     //                     // update only the search param because all of the rest needs to stay the same
     //                     setQuery({ [CONSTANTS.SEARCH_PARAMS.SEARCH]: value });
     //                };
     //           }
     //      );
     // }

     function setDefaultsOnChangeObject(object) {
          setSearch((previousValues) => ({ ...previousValues, setDefaultsOnChange: object }));
     }

     // insert empty search value on path change
     useEffect(() => {
          setSearch((previousValues) => {
               return {
                    ...previousValues,
                    [location.pathname]: "",
                    setDefaultsOnChange: {}
               };
          });

          // update the query with the search query whenever route changes
          setQuery({ [CONSTANTS.SEARCH_PARAMS.SEARCH]: "" });
     }, [location.pathname]);

     useEffect(() => {
          setSidebarCollapsed(isMobileLayout);
     }, [isMobileLayout]);

     return (
          <SidebarContext.Provider
               value={{
                    collapsed: sidebarCollapsed,
                    setCollapsed: handleToggleSidebar
               }}
          >
               <section className="flex h-screen align-stretch">
                    <SidebarWrapper />
                    <div className="relative flex flex-col flex-1 dark:bg-black overflow-y-auto">
                         <Navbar
                              // isBordered
                              className="w-full dark:bg-black"
                              classNames={{
                                   wrapper: "w-full max-w-full px-2"
                              }}
                         >
                              <Input
                                   variant="underlined"
                                   size="lg"
                                   placeholder="Search"
                                   radius="sm"
                                   startContent={
                                        <NavbarContent>
                                             <BurguerButton />
                                        </NavbarContent>
                                   }
                                   classNames={{
                                        input: "ms-10"
                                   }}
                                   value={search[location.pathname]}
                                   onChange={handleSearchChange}
                                   endContent={
                                        <NavbarContent justify="end">
                                             <Dropdown placement="bottom-end" closeOnSelect={true}>
                                                  <DropdownTrigger>
                                                       <Avatar
                                                            isBordered
                                                            as="button"
                                                            className="transition-transform"
                                                            // color="default"
                                                            name={userData?.name}
                                                            size="sm"
                                                            src={userData?.picture}
                                                       />
                                                  </DropdownTrigger>
                                                  <DropdownMenu
                                                       aria-label="Profile Actions"
                                                       variant="flat"
                                                       disabledKeys={["settings", "profiles", "help", "light-theme", "dark-theme"]}
                                                  >
                                                       <DropdownSection showDivider>
                                                            <DropdownItem key="profile" className="h-14 gap-2" textValue="User details">
                                                                 <p className="font-semibold">{`Hi, ${userData?.name}`}</p>
                                                                 <p className="">{userData?.email}</p>
                                                            </DropdownItem>
                                                       </DropdownSection>
                                                       <DropdownSection showDivider>
                                                            {/* {darkMode.value ? (
                                                                 <DropdownItem
                                                                      key="light-theme"
                                                                      onClick={darkMode.disable}
                                                                      startContent={<MdSunny size={20} />}
                                                                      textValue="Enable light mode"
                                                                 >
                                                                      Light Mode
                                                                 </DropdownItem>
                                                            ) : (
                                                                 <DropdownItem
                                                                      key="dark-theme"
                                                                      onClick={darkMode.enable}
                                                                      startContent={<MdNightlight size={20} />}
                                                                      textValue="Enable dark mode"
                                                                 >
                                                                      Dark Mode
                                                                 </DropdownItem>
                                                            )} */}
                                                            <DropdownItem key="settings" startContent={<Settings size={20} />} textValue="Settings">
                                                                 My Settings
                                                            </DropdownItem>
                                                       </DropdownSection>
                                                       <DropdownSection>
                                                            <DropdownItem
                                                                 key="help"
                                                                 startContent={<CircleQuestionMark size={20} />}
                                                                 textValue="Help and feedback"
                                                            >
                                                                 Help & Feedback
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                 key="logout"
                                                                 color="danger"
                                                                 className="text-danger"
                                                                 onClick={logoutMutation.mutate}
                                                                 startContent={<LogOut size={20} />}
                                                                 textValue="Log user out"
                                                            >
                                                                 Log Out
                                                            </DropdownItem>
                                                       </DropdownSection>
                                                  </DropdownMenu>
                                             </Dropdown>
                                        </NavbarContent>
                                   }
                              />
                         </Navbar>
                         <div className="dark:bg-black">
                              <Suspense
                                   fallback={
                                        <div className="flex items-center justify-center" style={{ minHeight: "calc(100dvh - 100px)" }}>
                                             <Spinner />
                                        </div>
                                   }
                              >
                                   <Outlet context={{ globalSearch: debouncedSearch, setDefaultsOnChangeObject }} />
                              </Suspense>
                         </div>
                    </div>
               </section>
          </SidebarContext.Provider>
     );
}
