import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route, Navigate, useHref } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Dashboard from "@views/dashboard/Dashboard";
import Axios from "axios";
import GetStarted from "@views/auth/getStarted";
import OauthRedirect from "@views/auth/oauthRedirect";
import { HeroUIProvider } from "@heroui/react";
import { StatusCodes } from "http-status-codes";
import { Check, Wifi, WifiOff, X } from "lucide-react";
import ForgotPassword from "@views/auth/forgotPassword";
import ResetPassword from "./views/auth/resetPassword";
import { formatTimeFriendly } from "./utils/utils";

const Insights = lazy(() => import("@views/dashboard/insights/insights"));

// set `baseURL` and `withCredentials` options in axios
Axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
Axios.defaults.withCredentials = true;
Axios.interceptors.response.use(
     function (response) {
          return response;
     },
     function (error) {
          if (error?.response) {
               const { status, headers, data } = error.response;

               if (status === StatusCodes.UNAUTHORIZED || status === StatusCodes.FORBIDDEN) {
                    window.location.href = `${window.location.origin}/get-started?session_expired=true`;
               } else if (status === StatusCodes.TOO_MANY_REQUESTS) {
                    const seconds = parseInt(headers["ratelimit-reset"], 10);
                    const waitTime = formatTimeFriendly(seconds);
                    toast.error(`${data.message} Please try again in ${waitTime}.`);
               } else if (status !== StatusCodes.UNPROCESSABLE_ENTITY) {
                    data?.message && toast.error(data.message);
               }
          } else {
               console.error("Network Error:", "Unable to connect to the server");
               toast.error("Unable to connect to the server");
          }
          return Promise.reject(error);
     }
);

const App = () => {
     const navigate = useNavigate();
     const { onLine } = navigator;
     !onLine &&
          toast.error("Connect to internet.", {
               icon: <WifiOff size={25} />
          });

     window.ononline = (event) => {
          toast.success("You're back online.", {
               icon: <Wifi size={25} />
          });
     };

     window.onoffline = (event) => {
          toast.error("No internet.", {
               icon: <WifiOff size={25} />
          });
     };

     return (
          <HeroUIProvider navigate={navigate} useHref={useHref} locale="en-IN">
               <Toaster
                    position="bottom-center"
                    toastOptions={{
                         duration: 5000,
                         style: {
                              color: "#ECEDEE",
                              backgroundColor: "#3f3f46"
                         },
                         success: {
                              style: {
                                   backgroundColor: "#12a150"
                              },
                              iconTheme: {
                                   primary: "#ECEDEE",
                                   secondary: "#12a150"
                              },
                              icon: <Check />
                         },
                         error: {
                              style: {
                                   backgroundColor: "#f31260"
                              },
                              iconTheme: {
                                   primary: "#ECEDEE",
                                   secondary: "#f31260"
                              },
                              icon: <X />
                         }
                    }}
               />
               <Routes>
                    <Route path="/" element={<Navigate to="/get-started" replace={true} />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="oauth-redirect" element={<OauthRedirect />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<Dashboard />}>
                         <Route path="insights" element={<Insights />} />
                         <Route path="*" element={<Navigate to="/dashboard/insights" replace={true} />} />
                    </Route>
                    <Route path="*" element={<GetStarted />} />
               </Routes>
          </HeroUIProvider>
     );
};

export default App;
