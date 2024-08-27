"use client";

import * as Yup from "yup";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import Checkmark from "@/components/Checkmark";
import InputField from "@/components/InputField";
import { PageHeadline } from "@/components/PageHeadline";
import { SelectField } from "@/components/SelectField";

import useInterviewStore, {
  TStore,
  TStoreActions,
} from "@/store/useInterviewStore";
import { useRouter } from "next/navigation";
import { SCHEMA, TExperienceLevelKeys, TInterviewRoleKeys } from "@/shared";
import Loader from "@/components/Loader";
import { useCallback, useState } from "react";
import { useGenerateQuestionsMutation } from "@/services/generateQuestions";
import {
  interviewRoles,
  experienceLevels,
  interviewQuestionsCount,
} from "@/constants";
import { PageContentBox } from "@/layout/PageContentBox";
import Icon from "@/assets/ai.png";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

const MemoizedReCAPTCHA = React.memo(ReCAPTCHA);

export function Step2({onSubmit}:{onSubmit:() => void}) {
  const { push: navigate } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const selectConfig = (state: TStore) => state.config;
  const selectSetConfig = (state: TStoreActions) => state.setConfig;
  const selectUser = (state: TStoreActions) => state.setUser;
  const selectUserData = (state: TStore) => state.user;
  const selectQuestions = (state: TStoreActions) => state.setQuestions;
  const selectErrors = (state: TStoreActions) => state.setErrors;

  const setConfig = useInterviewStore(selectSetConfig);
  const setUser = useInterviewStore(selectUser);
  const setQuestions = useInterviewStore(selectQuestions);

  const config = useInterviewStore(selectConfig);
  const user = useInterviewStore(selectUserData);

  const recaptchaToken = user.recaptchaToken;
  const setRecaptchaToken = (token: string) => {
    setUser({ recaptchaToken: token });
  };

  const setErrors = useInterviewStore(selectErrors);

  const { mutateAsync: generateQuestions } = useGenerateQuestionsMutation();

  const handleRecaptchaChange = useCallback(
    (value: string | null) => {
      if (!value) return;

      setRecaptchaToken(value);
    },
    [setRecaptchaToken]
  );

  const handleGenerateQuestions = async () => {
    try {
      if (!recaptchaToken) throw new Error("Please complete the recaptcha");
      setIsLoading(true);
      const { role, experienceLevel, questionsNum } =
        await SCHEMA.questionsQuerySchema
          .concat(
            Yup.object().shape({ sendResultsToEmail: Yup.bool().required() })
          )
          .validate({ ...config, recaptchaToken });

      const questions = await generateQuestions({
        recaptchaToken: recaptchaToken,
        role: role,
        experienceLevel: experienceLevel,
        questionsNum: questionsNum,
      });

      console.log(questions);

      if (questions) setQuestions(questions);

      // transition to the next page (INREVIEW PAGE)
      navigate("/qa");
    } catch (err) {
      console.log(err);
      setErrors([
        {
          message: "Something went wrong. Please try again later.",
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
     <>
       <div className="flex justify-center">
          <Image
            className="max-w-[100%] w-20"
            src={Icon}
            alt="AI Interviewer"
          />
        </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <PageHeadline>Tell us more about your interview</PageHeadline>
            </div>
      


        <div className=" bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit()
              //handleGenerateQuestions();
            }}
          >


            <div className="flex flex-col gap-5">
              <SelectField
                id="questionsNum"
                name="questionsNum"
                label="Questions"
                value={config.questionsNum?.toString() || undefined}
                options={interviewQuestionsCount.map((count) =>
                  count.toString()
                )}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setConfig({ questionsNum: parseInt(value) });
                  }
                }}
              />

              <SelectField
                id="timeLimitPerQuestion"
                name="timeLimitPerQuestion"
                label="Time Limit Per Question"
                value={config.timeLimitPerQuestion?.toString() || undefined}
                options={["5", "10", "15", "20"]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setConfig({ timeLimitPerQuestion: parseInt(value) });
                  }
                }}
              />
            </div>
            <ButtonPrimary>
              Continue
            </ButtonPrimary>
          </form>
        </div>
        </>
    
  );
}
