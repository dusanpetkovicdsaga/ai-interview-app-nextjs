import { InterviewPage } from "@/features/InterviewPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Answer Questions",
  description: "Pratice and get evaluated by AI.",
};

export default function Interview() {
  return <InterviewPage />;
}
