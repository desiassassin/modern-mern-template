import React from "react";
import { createRoot } from "react-dom/client";
import "@/index.scss";
import App from "@/App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryParamProvider, StringParam, withDefault } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import queryString from "query-string";
import CONSTANTS from "@/constants";

// create react query client
const queryClient = new QueryClient({
     defaultOptions: {
          queries: {
               refetchOnWindowFocus: false,
               retry: false,
               networkMode: "online"
          },
          mutations: {
               retry: false,
               networkMode: "online"
          }
     }
});

createRoot(document.getElementById("root")).render(
     <React.StrictMode>
          <QueryClientProvider client={queryClient}>
               <Router>
                    <QueryParamProvider
                         adapter={ReactRouter6Adapter}
                         options={{
                              searchStringToObject: queryString.parse,
                              objectToSearchString: queryString.stringify,
                              skipUpdateWhenNoChange: true,
                              removeDefaultsFromUrl: true,
                              params: {
                                   [CONSTANTS.SEARCH_PARAMS.SEARCH]: withDefault(StringParam, "")
                              },
                              includeKnownParams: true,
                              updateType: "replaceIn"
                         }}
                    >
                         <App />
                    </QueryParamProvider>
               </Router>
               <ReactQueryDevtools buttonPosition="bottom-left" position="bottom" initialIsOpen={false} />
          </QueryClientProvider>
     </React.StrictMode>
);
