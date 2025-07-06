import { showFormErrors } from "@/utils/utils";
import { Button, Card, CardBody, CardHeader, Divider, Input, Link } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import { Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const INPUT_VARIANT = "faded";
const INPUT_LABEL_LOCATION = "outside";

export default function ForgotPassword() {
     const [emailSent, setEmailSent] = useState(false);

     const forgotPasswordMutation = useMutation({
          mutationFn: async function ({ email }) {
               const response = await axios.post("/auth/forgot-password", {
                    email
               });
               return response;
          },
          onSuccess: function (response) {
               setEmailSent(true);
               toast.success("Email Sent");
          },
          onError: function (error) {
               showFormErrors(error, forgotPasswordValidation);
          }
     });

     const forgotPasswordValidation = useFormik({
          initialValues: {
               email: ""
          },
          enableReinitialize: true,
          onSubmit: (values) => {
               forgotPasswordMutation.mutate({
                    email: values.email
               });
          },
          validateOnMount: true
     });

     return (
          <div className="flex justify-center items-center h-screen">
               {!emailSent ? (
                    <Card className="m-5 w-96">
                         <CardHeader className="justify-center">
                              <h1 className="text-2xl">Forgot Password?</h1>
                         </CardHeader>
                         <Divider />
                         <CardBody className="flex flex-col gap-4 sm:p-unit-10">
                              <p className="text-sm">
                                   No worries, it happens. Enter the email address associated with your account, and we'll send you a link to reset
                                   your password.
                              </p>
                              <div className="flex flex-col gap-4">
                                   <Input
                                        label="Email"
                                        name="email"
                                        size="md"
                                        className="w-25"
                                        value={forgotPasswordValidation.values.email}
                                        placeholder="johndoe@example.com"
                                        labelPlacement={INPUT_LABEL_LOCATION}
                                        variant={INPUT_VARIANT}
                                        type="email"
                                        onChange={forgotPasswordValidation.handleChange}
                                        endContent={<Mail size={20} />}
                                        onFocus={forgotPasswordValidation.handleBlur}
                                        isInvalid={!!forgotPasswordValidation.errors?.email && forgotPasswordValidation.touched.email}
                                        errorMessage={forgotPasswordValidation.errors?.email}
                                   />
                                   <div className="flex gap-4">
                                        <Button color="default" className="w-full" as={Link} href="/get-started" variant="light">
                                             Go Back
                                        </Button>
                                        <Button
                                             color="primary"
                                             className="w-full"
                                             onPress={forgotPasswordValidation.handleSubmit}
                                             disabled={forgotPasswordMutation.isPending}
                                             isLoading={forgotPasswordMutation.isPending}
                                        >
                                             Reset Password
                                        </Button>
                                   </div>
                              </div>
                         </CardBody>
                    </Card>
               ) : (
                    <Card className="m-5 w-96">
                         <CardHeader className="justify-center">
                              <h1 className="text-2xl">Password Reset Email Sent</h1>
                         </CardHeader>
                         <Divider />
                         <CardBody className="flex flex-col gap-4 sm:p-unit-10">
                              <p className="text-sm">
                                   We've sent you an email with instructions to reset your password. Please check your inbox (and your spam or junk
                                   folder just in case).
                              </p>
                              <p className="text-sm">If you don't receive the email within a few minutes, try again or contact support.</p>
                              <Button color="primary" className="w-full" as={Link} href="/get-started">
                                   Back to Sign in
                              </Button>
                         </CardBody>
                    </Card>
               )}
          </div>
     );
}
