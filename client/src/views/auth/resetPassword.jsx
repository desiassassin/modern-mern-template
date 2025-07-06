import { showFormErrors } from "@/utils/utils";
import {
     Button,
     Card,
     CardBody,
     CardHeader,
     Divider,
     Input,
     Link,
     Modal,
     ModalBody,
     ModalContent,
     ModalFooter,
     ModalHeader,
     useDisclosure
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import Axios from "axios";
import { useFormik } from "formik";
import { StatusCodes } from "http-status-codes";
import { Eye, EyeClosed, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";

const INPUT_VARIANT = "faded";
const INPUT_LABEL_LOCATION = "outside";

export default function ResetPassword() {
     const [searchParams, setSearchParams] = useSearchParams();
     const [showLoginPassword, setShowLoginPassword] = useState(false);
     const [resetIdError, setResetIdError] = useState(false);
     const [passwordResetSuccessful, setPasswordResetSuccessful] = useState(false);
     const { isOpen: sessionExpiredModalIsOpen } = useDisclosure({ isOpen: resetIdError });

     const resetId = searchParams.get("reset_id");

     const resetPasswordMutation = useMutation({
          mutationFn: async function ({ password, confirm_password, reset_id }) {
               const response = await Axios.post("/auth/reset-password", {
                    password,
                    confirm_password,
                    reset_id
               });
               return response;
          },
          onSuccess: function (response) {
               toast.success("Password reset successfully.");
               setPasswordResetSuccessful(true);
          },
          onError: function (error) {
               showFormErrors(error, resetPasswordValidation);
          }
     });

     const resetPasswordValidation = useFormik({
          initialValues: {
               password: "",
               confirm_password: ""
          },
          enableReinitialize: true,
          // validationSchema: Yup.object().shape({
          //      password: Yup.string().required("Password is required"),
          //      confirm_password: Yup.string()
          //           .required("Please confirm your password")
          //           .oneOf([Yup.ref("password"), null], "Passwords must match")
          // }),
          onSubmit: (values) => {
               resetPasswordMutation.mutate({
                    password: values.password,
                    confirm_password: values.confirm_password,
                    reset_id: resetId
               });
          },
          validateOnMount: true
     });

     function toggleLoginPassword() {
          setShowLoginPassword((previousValue) => !previousValue);
     }

     useEffect(() => {
          // reset id is not available then just set error
          if (!resetId) {
               setResetIdError(true);
               return;
          }

          // reset id is available, check it, if found not ok then set error
          (async function () {
               try {
                    await Axios.get("/auth/validate-reset-token", { params: { reset_id: resetId || "" } });
               } catch (error) {
                    if (error.response.status === StatusCodes.UNPROCESSABLE_ENTITY) {
                         setResetIdError(true);
                    }
               }
          })();
     }, [resetId]);

     return (
          <div className="flex justify-center items-center h-screen">
               {(function () {
                    if (resetIdError)
                         return (
                              <Modal
                                   isOpen={sessionExpiredModalIsOpen}
                                   placement="center"
                                   backdrop="blur"
                                   isDismissable={false}
                                   hideCloseButton={true}
                              >
                                   <ModalContent className="text-center">
                                        <ModalHeader className="text-danger justify-center">Invalid or Expired Link</ModalHeader>
                                        <ModalBody>
                                             The password reset link you used is invalid or has already expired. Please request a new one to continue.
                                        </ModalBody>
                                        <ModalFooter>
                                             <Button color="default" className="w-full" as={Link} href="/get-started" variant="light">
                                                  Back to Sign in
                                             </Button>
                                             <Button color="primary" className="w-full" as={Link} href="/forgot-password">
                                                  Request new link
                                             </Button>
                                        </ModalFooter>
                                   </ModalContent>
                              </Modal>
                         );

                    if (passwordResetSuccessful)
                         return (
                              <Card className="m-5 w-96">
                                   <CardHeader className="justify-center">
                                        <h1 className="text-2xl">Password Updated</h1>
                                   </CardHeader>
                                   <Divider />
                                   <CardBody className="flex flex-col gap-4 sm:p-unit-10">
                                        <p className="text-sm">Your password has been updated. You can now log in with your new credentials.</p>
                                        <Button color="primary" className="w-full" as={Link} href="/get-started">
                                             Go to Login
                                        </Button>
                                   </CardBody>
                              </Card>
                         );

                    return (
                         <Card className="m-5 w-96">
                              <CardHeader className="justify-center">
                                   <h1 className="text-2xl">Reset Your Passwod</h1>
                              </CardHeader>
                              <Divider />
                              <CardBody className="flex flex-col gap-4 sm:p-unit-10">
                                   <p className="text-sm">For your security, please choose a strong password that you haven't used before.</p>
                                   <div className="flex flex-col gap-4">
                                        <Input
                                             label="Password"
                                             name="password"
                                             size="md"
                                             className="w-25"
                                             value={resetPasswordValidation.values.password}
                                             placeholder="Password"
                                             labelPlacement={INPUT_LABEL_LOCATION}
                                             variant={INPUT_VARIANT}
                                             type={showLoginPassword ? "text" : "password"}
                                             onChange={resetPasswordValidation.handleChange}
                                             endContent={
                                                  showLoginPassword ? (
                                                       <Eye size={20} onClick={toggleLoginPassword} className="cursor-pointer" />
                                                  ) : (
                                                       <EyeClosed size={20} onClick={toggleLoginPassword} className="cursor-pointer" />
                                                  )
                                             }
                                             onFocus={resetPasswordValidation.handleBlur}
                                             isInvalid={!!resetPasswordValidation.errors?.password && resetPasswordValidation.touched.password}
                                             errorMessage={resetPasswordValidation.errors?.password}
                                        />
                                        <Input
                                             label="Confirm Password"
                                             name="confirm_password"
                                             size="md"
                                             className="w-25"
                                             value={resetPasswordValidation.values.confirm_password}
                                             placeholder="Confirm Password"
                                             labelPlacement={INPUT_LABEL_LOCATION}
                                             variant={INPUT_VARIANT}
                                             type={showLoginPassword ? "text" : "password"}
                                             onChange={resetPasswordValidation.handleChange}
                                             onFocus={resetPasswordValidation.handleBlur}
                                             isInvalid={
                                                  !!resetPasswordValidation.errors?.confirm_password &&
                                                  resetPasswordValidation.touched.confirm_password
                                             }
                                             errorMessage={resetPasswordValidation.errors?.confirm_password}
                                        />
                                        <div className="flex gap-4">
                                             <Button
                                                  color="primary"
                                                  className="w-full"
                                                  onPress={resetPasswordValidation.handleSubmit}
                                                  disabled={resetPasswordMutation.isPending}
                                                  isLoading={resetPasswordMutation.isPending}
                                             >
                                                  Reset Password
                                             </Button>
                                        </div>
                                   </div>
                              </CardBody>
                         </Card>
                    );
               })()}
          </div>
     );
}
