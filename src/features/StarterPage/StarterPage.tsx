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
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";


const MemoizedReCAPTCHA = React.memo(ReCAPTCHA);

export function StarterPage() {
  const { push: navigate } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1)

  const renderCurrentStep = () => {
    if (currentStep === 1) {
      return <Step1 onSubmit={() => { setCurrentStep(2) }}></Step1>
    } else if (currentStep === 2) {
      return <Step2 onSubmit={() => { setCurrentStep(3) }}></Step2>
    } else if (currentStep === 3) {
      return <Step3 onSubmit={() => { handleGenerateQuestions() }}></Step3>
    }
  }

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
    <Loader isLoading={isLoading}>
      <PageContentBox className=" border-blue-400 border-4 h-screen">
        
          <div>
            {renderCurrentStep()}
          </div>
        
      </PageContentBox>
      </Loader>


    </>
  );
}
