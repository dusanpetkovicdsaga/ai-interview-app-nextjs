"use client";

import {  useMemo, useState } from "react";
import FailIcon from "@/assets/fail.png";
import PassIcon from "@/assets/success.png";
import Loader from "@/components/Loader";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import useInterviewStore from "@/store/useInterviewStore";
import { TScoreEntity } from "@/shared";

type TGradeInformation = {
  title: string;
  status: "pass" | "fail" | "not-found";
  icon?: any;
  description: string;
};

type TResultsPageProps = {
  score: TScoreEntity | null;
};

export function ResultsPage({ score }: TResultsPageProps) {
  const resetStore = useInterviewStore((state) => state.reset);
  const [isLoading] = useState<boolean>(false);

  const gradeInformation: TGradeInformation | null = useMemo(() => {
    if (!score) return null;

    console.log(score.questions, "score.questions");
    const maxScore = score.questions.length * 10;
    const scoreDescription = `${
      (score.totalScore / maxScore) * 100
    } ot of 100%, ${
      score.questions.filter((q) => q.score > 7).length
    } questions out of ${score.questions.length} have been answered correctly.`;

    if (score.totalScore >= maxScore * 0.7) {
      return {
        title: "Congratulations, you passed!",
        status: "pass",
        icon: PassIcon,
        description: scoreDescription,
      };
    } else {
      return {
        title: "Practice and try again soon.",
        status: "fail",
        icon: FailIcon,
        description: scoreDescription,
      };
    }
  }, [score]);

  console.log(gradeInformation, "gradeInformation");
  console.log(score, "score");

  return (
    <div
      className={`flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 animate-slideDown duration-500 ease-out border-solid border-4 border-gray-300`}
    >
      <Loader isLoading={isLoading}>
        {gradeInformation && (
          <div>
            <h1
              className={`py-3 font-bold pb-3 border-b-4 ${
                gradeInformation?.status === "pass"
                  ? `border-b-green-700`
                  : `border-b-red-700`
              }`}
            >
              {gradeInformation.title}
            </h1>
            <div className="py-3 flex justify-center">
              <img className="w-auto max-h-64" src={gradeInformation.icon} />
            </div>
            <div className="py-3 font-medium text-2xl">
              {gradeInformation.description.split(",").map((block, index) => (
                <p key={index}>{block}</p>
              ))}
            </div>
            {gradeInformation.status === "fail" && (
              <div className="py-3">
                <ButtonPrimary onClick={() => resetStore()}>
                  Start Over
                </ButtonPrimary>
              </div>
            )}
          </div>
        )}
      </Loader>
    </div>
  );
}
