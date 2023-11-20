"use client";

import { ButtonPrimary } from "@/components/ButtonPrimary";
import InputField from "@/components/InputField";
import Loader from "@/components/Loader";
import { PageHeadline } from "@/components/PageHeadline";
import { Timer, TimerRef } from "@/components/Timer";
import useInterviewStore from "@/store/useInterviewStore";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEvaluateAnswersMutation } from "@/services/evaluateAnswers";
import { PageContentBox } from "@/layout/PageContentBox";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

const MemoizedReCAPTCHA = React.memo(ReCAPTCHA);

export function InterviewPage() {
  const { push } = useRouter();
  const timerRef = useRef<TimerRef | null>(null);
  const [myAnswer, setMyAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: sendAnswers } = useEvaluateAnswersMutation();

  const getFirstUnansweredQuestion = useInterviewStore(
    (store) => store.getFirstUnansweredQuestion
  );

  const answered = useInterviewStore((store) => store.answered);

  const unansweredQuestion = useMemo(
    () => getFirstUnansweredQuestion(),
    [answered]
  );

  const config = useInterviewStore((store) => store.config);
  const user = useInterviewStore((store) => store.user);
  const setUser = useInterviewStore((store) => store.setUser);
  const setAnswer = useInterviewStore((store) => store.setAnswer);

  
  const recaptchaToken = user.recaptchaToken_evaluate;
  const setRecaptchaToken = (token: string) => {
    setUser({ recaptchaToken_evaluate: token });
  };

  const handleRecaptchaChange = useCallback(
    (value: string | null) => {
      if (!value) return;

      setRecaptchaToken(value);
    },
    [setRecaptchaToken]
  );


  const handleSendAnswers = async () => {
    // if no more questions, submit
    const { questions, answered } = useInterviewStore.getState();

    const score = await sendAnswers({
      recaptchaToken: user.recaptchaToken_evaluate!,
      answers: answered,
      questions: questions,
      config: config,
      user,
    });

    // set results to state
    push(`/results/${score.resultId}`);
  };

  const handleSubmitAnswer = async () => {
    if (unansweredQuestion) {
      // add loader
      setIsLoading(true);
      // update timelimit to corerctly set based on elapsed time
      setAnswer(
        unansweredQuestion.id,
        myAnswer,
        timerRef.current && config.timeLimitPerQuestion
          ? config.timeLimitPerQuestion * 60 - timerRef.current?.getTime()
          : 0
      );

      setTimeout(() => {
        setMyAnswer("");
      }, 0);

      // if last question
      if (answered.length + 1 === config.questionsNum) {
        setTimeout(async () => {
          await handleSendAnswers();
          setIsLoading(false);
        }, 0);
      } else {
        // if not last question
        // remove loader
        setIsLoading(false);
      }
    }
  };

  const isLastQuestion = answered.length + 1 === config.questionsNum;

  return (
    <PageContentBox className="border-blue-400 border-4">
      <Loader isLoading={Boolean(!unansweredQuestion || isLoading)}>
        {unansweredQuestion && (
          <section>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <p className="my-5 text-left text-1  text-gray-600">
                Question {answered.length + 1} of {config.questionsNum}
              </p>
              <PageHeadline>{unansweredQuestion.questionText}</PageHeadline>
              <p className="my-5 text-left text-1  text-gray-600">
                Answer with as much detail as possible for a better grade.
              </p>
              <Timer
                key={unansweredQuestion?.id}
                ref={timerRef}
                timeMin={config.timeLimitPerQuestion!}
                onExpired={handleSubmitAnswer}
              />
            </div>

            <div className=" bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitAnswer();
                }}
              >
                <div>
                  <InputField
                    value={myAnswer}
                    id="answer"
                    type="textarea"
                    required
                    label="Your answer"
                    onChange={(e) => setMyAnswer(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <ButtonPrimary disabled={isLastQuestion && !recaptchaToken}>
                    Submit
                  </ButtonPrimary>
                 
                </div>
                {isLastQuestion && !recaptchaToken && (
                    <MemoizedReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      onChange={handleRecaptchaChange}
                    />
                  )}
              </form>
            </div>
          </section>
        )}
      </Loader>
    </PageContentBox>
  );
}
