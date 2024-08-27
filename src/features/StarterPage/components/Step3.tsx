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

export function Step3({ onSubmit }: { onSubmit: () => void }) {
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


  return (

    <div className=" bg-white mt-10  sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit()
        }}
      >

        <div>
          <div className="flex justify-center">
            <Image
              className="max-w-[100%] w-20"
              src={Icon}
              alt="AI Interviewer"
            />
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-lg mb-10">
            <PageHeadline>Who is taking the interview?</PageHeadline>
          </div>

          <InputField
            id="email"
            type="email"
            required
            label="Email address"
            onChange={(e) => setUser({ email: e.target.value })}
            value={user.email || ""}
          />
        </div>

        <div>
          <Checkmark
            id="sendResultsToEmail"
            name="sendResultsToEmail"
            checked={config.sendResultsToEmail}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setConfig({
                  sendResultsToEmail: !config.sendResultsToEmail,
                });
              }
            }}
          >
            Send results to my email address after completion.
          </Checkmark>
        </div>

        <div className="mb-3">
          <ButtonPrimary disabled={!recaptchaToken}>
            Start The Interview
          </ButtonPrimary>
        </div>
        {!recaptchaToken && (
          <MemoizedReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={handleRecaptchaChange}

          />
        )}


      </form>
    </div>

  );
}
