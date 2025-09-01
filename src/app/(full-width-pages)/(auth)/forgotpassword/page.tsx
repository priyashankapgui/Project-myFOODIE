
import { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
    title: "MyFoodie Forgot Password Page ",
    description: "This is MyFoodie Forgot Password Page",
};

export default function SignIn() {
    return <ForgotPasswordForm />;
}
