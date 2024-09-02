import { AccessPage } from "@/features/AccessPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Answer Questions",
  description: "Pratice and get evaluated by AI.",
};

export default function Access() {
  return <AccessPage />;
}