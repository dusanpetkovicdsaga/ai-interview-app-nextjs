import { SuccessPage } from "@/features/SuccessPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Success",
  description: "Pratice and get evaluated by AI.",
};

export default function success() {
  return <SuccessPage />;
}