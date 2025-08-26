import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyFoodie SignIn Page ",
  description: "This is MyFoodie Signin Page",
};

export default function SignIn() {
  return <SignInForm />;
}
