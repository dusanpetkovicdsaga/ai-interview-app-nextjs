"use client";

import { useMemo, useState } from "react";
import FailIcon from "@/assets/fail.png";
import PassIcon from "@/assets/success.png";
import Loader from "@/components/Loader";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import useInterviewStore from "@/store/useInterviewStore";
import { TScoreEntity } from "@/shared";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PageContentBox } from "@/layout/PageContentBox";

type TGradeInformation = {
  title: string;
  status: "pass" | "fail" | "not-found";
  icon?: any;
  description: string;
  certificateId?: string;
};

type TResultsPageProps = {
  score: (TScoreEntity) | null;
};

export function ResultsPage({ score }: TResultsPageProps) {
  const resetStore = useInterviewStore((state) => state.reset);
  const { push } = useRouter();
  const [isLoading] = useState<boolean>(false);

  const gradeInformation: TGradeInformation | null = useMemo(() => {
    if (!score) return null;

    const maxScore = 10;
    const scoreDescription = `${score.totalScore * 10}% out of 100%, ${
      score.questions.filter((q) => q.score > 7).length
    } questions out of ${score.questions.length} have been answered correctly.`;

    if (score.totalScore >= maxScore * 0.7) {
      return {
        title: "Congratulations, you passed!",
        status: "pass",
        icon: PassIcon,
        description: scoreDescription,
        certificateId: "ABC123", // Replace with actual certificate ID
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

  return (
    <PageContentBox className="border-solid border-4 border-gray-300">
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
              <Image
                alt={gradeInformation.status}
                className="w-auto max-h-64"
                src={gradeInformation.icon}
              />
            </div>
            <div className="py-3 font-medium text-2xl text-center">
              {gradeInformation.description.split(",").map((block, index) => (
                <p
                  className={`${index === 0 ? "text-3xl pb-3" : ""}`}
                  key={index}
                >
                  {block}
                </p>
              ))}
            </div>
            {gradeInformation.status === "pass" && (
              <div className="py-3">
                <p className="text-xl text-center text-green-700">
                  Your certificate ID: {score?.certificateId}
                </p>
              </div>
            )}
            {gradeInformation.status === "fail" && (
              <div className="pt-10 flex justify-center">
                <div className="w-48 max-w-full">
                  <ButtonPrimary
                    onClick={() => {
                      resetStore();
                      push("/");
                    }}
                  >
                    Start Over
                  </ButtonPrimary>
                </div>
              </div>
            )}
          </div>
        )}
      </Loader>
    </PageContentBox>
  );
}
