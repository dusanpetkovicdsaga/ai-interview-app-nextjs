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

  return score?.results;
}

export default async function Results({ params }: { params: { id: string } }) {
  const score = await getScore(params.id);

  console.log(score, "score");

  if (!score) return notFound();

  return <ResultsPage score={score} />;
}
