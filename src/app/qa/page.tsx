import { InterviewPage } from "@/features/InterviewPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview",
  description: "Interview",
};

export default function Interview() {
  return <InterviewPage />;
}
