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
import { useState } from "react";
import { useGenerateQuestionsMutation } from "@/services/generateQuestions";
import {
  interviewRoles,
  experienceLevels,
  interviewQuestionsCount,
} from "@/constants";
import { PageContentBox } from "@/layout/PageContentBox";
import Icon from "@/assets/ai.png";
import Image from "next/image";

export function StarterPage() {
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

  const setErrors = useInterviewStore(selectErrors);

  const { mutateAsync: generateQuestions } = useGenerateQuestionsMutation();

  const handleGenerateQuestions = async () => {
    try {
      setIsLoading(true);
      const { role, experienceLevel, questionsNum } =
        await SCHEMA.questionsQuerySchema
          .concat(
            Yup.object().shape({ sendResultsToEmail: Yup.bool().required() })
          )
          .validate(config);

      const questions = await generateQuestions({
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
          message: err
            ? err.toString()
            : "Something went wrong. Please try again later.",
          type: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContentBox className=" border-blue-400 border-4 ">
      <Loader isLoading={isLoading}>
        <div className="flex justify-center">
          <Image className="max-w-[100%] w-20" src={Icon} alt="AI Interviewer" />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <PageHeadline>What position are you applying for?</PageHeadline>
        </div>

        <div className=" bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateQuestions();
            }}
          >
            <div>
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
              <SelectField
                id="position"
                name="position"
                label="Position"
                value={config.role || ""}
                options={Object.entries(interviewRoles).map(([key, value]) => ({
                  key,
                  label: value,
                }))}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value in interviewRoles) {
                    setConfig({ role: value as TInterviewRoleKeys });
                  }
                }}
              />
            </div>

            <div>
              <SelectField
                id="seniorityLevel"
                name="seniorityLevel"
                label="Seniority Level"
                value={config.experienceLevel || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value in experienceLevels) {
                    setConfig({
                      experienceLevel: value as TExperienceLevelKeys,
                    });
                  }
                }}
                options={Object.entries(experienceLevels).map(
                  ([key, value]) => ({
                    key,
                    label: value,
                  })
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
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

            <div>
              <ButtonPrimary>Start The Interview</ButtonPrimary>
            </div>
          </form>
        </div>
      </Loader>
    </PageContentBox>
  );
}
