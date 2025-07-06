import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.scss";
import { StatusCodes } from "http-status-codes";
import { useMutation } from "@tanstack/react-query";

export default function OauthRedirect() {
     const navigate = useNavigate();
     const searchParams = new URLSearchParams(window.location.search);
     const abortController = new AbortController();

     const [code, provider] = ["code", "state"].map((item) => searchParams.get(item));
     const [message, setMessage] = useState({ show: false, content: "We are redirecting to your account." });

     const loginMutation = useMutation({
          mutationFn: async function () {
               const response = await Axios.post(`/auth/oauth`, { provider, code }, { signal: abortController.signal });
               return response.data;
          },
          onSuccess: function () {
               navigate("/dashboard/finances");
          },
          onError: function (error) {
               if (error.response?.status === StatusCodes.INTERNAL_SERVER_ERROR) {
                    setMessage({ show: true, content: "Internal Server Error. Redirecting to login..." });
                    setTimeout(() => {
                         navigate("/get-started", { replace: true });
                    }, 5000);
               } else if (error.response?.status === StatusCodes.BAD_REQUEST) {
                    navigate("/get-started", { replace: true });
               }
          }
     });

     useEffect(function () {
          loginMutation.mutate();

          return function () {
               abortController.abort();
          };
     }, []);

     return (
          <div className="oauth-redirect">
               <p>Please do not close or refresh this page.</p>
               <p className={message.show ? "error" : ""}>{message.content}</p>
          </div>
     );
}
