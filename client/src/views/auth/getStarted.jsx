import {
     Button,
     Card,
     CardBody,
     CardFooter,
     CardHeader,
     Divider,
     Input,
     Link,
     Modal,
     ModalBody,
     ModalContent,
     ModalFooter,
     ModalHeader,
     Tab,
     Tabs,
     useDisclosure
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeClosed, Mail, UserRound } from "lucide-react";
import axios from "axios";
import { showFormErrors } from "@/utils/utils";

const INPUT_VARIANT = "faded";
const INPUT_LABEL_LOCATION = "outside";

const PROVIDERS = {
     google: {
          baseURL: "https://accounts.google.com/o/oauth2/v2/auth?",
          params: jsonToQueryString({
               client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
               redirect_uri: `${window.location.origin}/oauth-redirect`,
               scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile", "openid"].join(" "),
               state: "google",
               response_type: "code",
               // access_type: "offline",
               prompt: "consent",
               include_granted_scopes: true
          })
     }
};

const TABS = {
     REGISTER: "register",
     LOGIN: "login"
};

export default function GetStarted() {
     const navigate = useNavigate();
     const [searchParams, setSearchParams] = useSearchParams();
     const [selectedTab, setSelectedTab] = useState(TABS.LOGIN);
     const [showRegisterPassword, setShowRegisterPassword] = useState(false);
     const [showLoginPassword, setShowLoginPassword] = useState(false);

     const sessionExpired = searchParams.get("session_expired");

     const { isOpen: sessionExpiredModalIsOpen } = useDisclosure({ isOpen: sessionExpired === "true" });

     // mutations
     const registerMutation = useMutation({
          mutationFn: async function ({ name, email, password }) {
               const response = await axios.post("/auth/register-pw", {
                    name,
                    email,
                    password
               });
               return response;
          },
          onSuccess: function (response) {
               navigate("/dashboard/finances");
          },
          onError: function (error) {
               showFormErrors(error, registerValidation);
          }
     });

     const loginMutation = useMutation({
          mutationFn: async function ({ email, password }) {
               const response = await axios.post("/auth/login-pw", {
                    email,
                    password
               });
               return response;
          },
          onSuccess: function (response) {
               navigate("/dashboard/finances");
          },
          onError: function (error) {
               showFormErrors(error, loginValidation);
          }
     });

     // form validations
     const registerValidation = useFormik({
          initialValues: {
               name: "",
               email: "",
               password: ""
          },
          enableReinitialize: true,
          onSubmit: (values) => {
               registerMutation.mutate({
                    name: values.name,
                    email: values.email,
                    password: values.password
               });
          },
          validateOnMount: true
     });

     const loginValidation = useFormik({
          initialValues: {
               email: "",
               password: ""
          },
          enableReinitialize: true,
          onSubmit: (values) => {
               loginMutation.mutate({
                    email: values.email,
                    password: values.password
               });
          },
          validateOnMount: true
     });

     function navigateToGoogle() {
          window.location.href = `${PROVIDERS.google.baseURL}${PROVIDERS.google.params}`;
     }

     function closeSessionExpiredModal() {
          setSearchParams({});
     }

     function toggleRegisterPassword() {
          setShowRegisterPassword((previousValue) => !previousValue);
     }

     function toggleLoginPassword() {
          setShowLoginPassword((previousValue) => !previousValue);
     }

     function changeTab(key) {
          setSelectedTab(key);
     }

     return (
          <div className="flex justify-center items-center h-screen">
               {sessionExpiredModalIsOpen ? (
                    <Modal isOpen={sessionExpiredModalIsOpen} placement="center" backdrop="blur" isDismissable={false} hideCloseButton={true}>
                         <ModalContent className="text-center">
                              <ModalHeader className="text-danger justify-center">Session Expired</ModalHeader>
                              <ModalBody>Oops! Looks like your session has expired. Please login again to continue.</ModalBody>
                              <ModalFooter>
                                   <Button color="primary" className="w-full" onPress={closeSessionExpiredModal}>
                                        OK
                                   </Button>
                              </ModalFooter>
                         </ModalContent>
                    </Modal>
               ) : (
                    <Card className="m-5">
                         <CardHeader className="justify-center px-10">
                              <h1 className="text-2xl">Welcome to Your App</h1>
                         </CardHeader>
                         <Divider />
                         <CardBody className="flex flex-col gap-4 sm:p-unit-10 px-5">
                              <Tabs
                                   variant="bordered"
                                   color="primary"
                                   fullWidth
                                   radius="sm"
                                   aria-label="tabs"
                                   onSelectionChange={(key) => setSelectedTab(key)}
                                   disableAnimation
                                   selectedKey={selectedTab}
                              >
                                   <Tab key={TABS.REGISTER} title="Register" />
                                   <Tab key={TABS.LOGIN} title="Login" />
                              </Tabs>
                              {selectedTab === "register" && (
                                   <div className="flex flex-col gap-3">
                                        <Input
                                             label="Name"
                                             name="name"
                                             size="md"
                                             className="w-25"
                                             value={registerValidation.values.name}
                                             placeholder="John Doe"
                                             labelPlacement={INPUT_LABEL_LOCATION}
                                             variant={INPUT_VARIANT}
                                             type="text"
                                             onChange={registerValidation.handleChange}
                                             endContent={<UserRound size={20} />}
                                             onFocus={registerValidation.handleBlur}
                                             isInvalid={!!registerValidation.errors?.name && registerValidation.touched.name}
                                             errorMessage={registerValidation.errors?.name}
                                        />
                                        <Input
                                             label="Email"
                                             name="email"
                                             size="md"
                                             className="w-25"
                                             value={registerValidation.values.email}
                                             placeholder="johndoe@example.com"
                                             labelPlacement={INPUT_LABEL_LOCATION}
                                             variant={INPUT_VARIANT}
                                             type="email"
                                             onChange={registerValidation.handleChange}
                                             endContent={<Mail size={20} />}
                                             onFocus={registerValidation.handleBlur}
                                             isInvalid={!!registerValidation.errors?.email && registerValidation.touched.email}
                                             errorMessage={registerValidation.errors?.email}
                                        />
                                        <Input
                                             label="Password"
                                             name="password"
                                             size="md"
                                             className="w-25"
                                             value={registerValidation.values.password}
                                             placeholder="Password"
                                             labelPlacement={INPUT_LABEL_LOCATION}
                                             variant={INPUT_VARIANT}
                                             type={showRegisterPassword ? "text" : "password"}
                                             onChange={registerValidation.handleChange}
                                             endContent={
                                                  showRegisterPassword ? (
                                                       <Eye size={20} onClick={toggleRegisterPassword} className="cursor-pointer" />
                                                  ) : (
                                                       <EyeClosed size={20} onClick={toggleRegisterPassword} className="cursor-pointer" />
                                                  )
                                             }
                                             onFocus={registerValidation.handleBlur}
                                             isInvalid={!!registerValidation.errors?.password && registerValidation.touched.password}
                                             errorMessage={registerValidation.errors?.password}
                                        />
                                        <Button
                                             color="primary"
                                             className="w-full"
                                             onPress={registerValidation.handleSubmit}
                                             disabled={registerMutation.isPending}
                                             isLoading={registerMutation.isPending}
                                        >
                                             Register
                                        </Button>
                                   </div>
                              )}
                              {selectedTab === "login" && (
                                   <div className="flex flex-col gap-4">
                                        <Input
                                             label="Email"
                                             name="email"
                                             size="md"
                                             className="w-25"
                                             value={loginValidation.values.email}
                                             placeholder="johndoe@example.com"
                                             labelPlacement={INPUT_LABEL_LOCATION}
                                             variant={INPUT_VARIANT}
                                             type="email"
                                             onChange={loginValidation.handleChange}
                                             endContent={<Mail size={20} />}
                                             onFocus={loginValidation.handleBlur}
                                             isInvalid={!!loginValidation.errors?.email && loginValidation.touched.email}
                                             errorMessage={loginValidation.errors?.email}
                                        />
                                        <Input
                                             label="Password"
                                             name="password"
                                             size="md"
                                             className="w-25"
                                             value={loginValidation.values.password}
                                             placeholder="Password"
                                             labelPlacement={INPUT_LABEL_LOCATION}
                                             variant={INPUT_VARIANT}
                                             type={showLoginPassword ? "text" : "password"}
                                             onChange={loginValidation.handleChange}
                                             endContent={
                                                  showLoginPassword ? (
                                                       <Eye size={20} onClick={toggleLoginPassword} className="cursor-pointer" />
                                                  ) : (
                                                       <EyeClosed size={20} onClick={toggleLoginPassword} className="cursor-pointer" />
                                                  )
                                             }
                                             onFocus={loginValidation.handleBlur}
                                             isInvalid={!!loginValidation.errors?.password && loginValidation.touched.password}
                                             errorMessage={loginValidation.errors?.password}
                                        />
                                        <Link href="/forgot-password" className="text-sm underline ms-auto">
                                             Forgot Password?
                                        </Link>
                                        <Button
                                             color="primary"
                                             className="w-full"
                                             onPress={loginValidation.handleSubmit}
                                             disabled={loginMutation.isPending}
                                             isLoading={loginMutation.isPending}
                                        >
                                             Login
                                        </Button>
                                   </div>
                              )}
                         </CardBody>
                         <Divider />
                         <CardFooter className="flex flex-col gap-3 px-5">
                              <button className="gsi-material-button w-full" onClick={navigateToGoogle}>
                                   <div className="gsi-material-button-state"></div>
                                   <div className="gsi-material-button-content-wrapper">
                                        <div className="gsi-material-button-icon">
                                             <svg
                                                  version="1.1"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 48 48"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  style={{ display: "block" }}
                                             >
                                                  <path
                                                       fill="#EA4335"
                                                       d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                                  ></path>
                                                  <path
                                                       fill="#4285F4"
                                                       d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                                  ></path>
                                                  <path
                                                       fill="#FBBC05"
                                                       d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                                  ></path>
                                                  <path
                                                       fill="#34A853"
                                                       d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                                  ></path>
                                                  <path fill="none" d="M0 0h48v48H0z"></path>
                                             </svg>
                                        </div>
                                        <span className="gsi-material-button-contents">Continue with Google</span>
                                        <span style={{ display: "none" }}>Continue with Google</span>
                                   </div>
                              </button>

                              <p className="text-sm text-center mt-2">
                                   {selectedTab === "login" ? (
                                        <>
                                             Don't have an account?{" "}
                                             <span className="underline cursor-pointer" onClick={() => changeTab(TABS.REGISTER)}>
                                                  Sign up
                                             </span>
                                        </>
                                   ) : (
                                        <>
                                             Already have an account?{" "}
                                             <span className="underline cursor-pointer" onClick={() => changeTab(TABS.LOGIN)}>
                                                  Sign in
                                             </span>
                                        </>
                                   )}
                              </p>
                         </CardFooter>
                    </Card>
               )}
          </div>
     );
}

function jsonToQueryString(json) {
     return Object.entries(json)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join("&");
}
