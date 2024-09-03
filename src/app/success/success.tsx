import { SuccessPage } from "@/features/SuccessPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Answer Questions",
  description: "Pratice and get evaluated by AI.",
};

export default function succes() {
  return <SuccessPage />;
}