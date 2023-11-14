import { InterviewPage } from "@/features/InterviewPage";
import { ResultsPage } from "@/features/ResultsPage";
import {
  makeQuestionsController,
  questionsController,
} from "@/server/controllers";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Results",
  description: "Score Results",
};

async function getScore(id: string) {
  const score = await questionsController.callGetResults({ resultId: id });

  return score;
}

export default async function Results({ params }: { params: { id: string } }) {
  const score = await getScore(params.id);

  if (!score) return notFound();

  return <ResultsPage score={score} />;
}
