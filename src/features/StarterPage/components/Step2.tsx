"use client";

import * as Yup from "yup";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { PageHeadline } from "@/components/PageHeadline";
import { SelectField } from "@/components/SelectField";
import { useState } from "react";
import useInterviewStore, {
  TStore,
  TStoreActions,
} from "@/store/useInterviewStore";
import {
  interviewQuestionsCount,
} from "@/constants";
import Icon from "@/assets/ai.png";
import Image from "next/image";
import React from "react";

const validationSchema = Yup.object({
  questionsNum: Yup.number()
    .required('Questions are required'),
  timeLimitPerQuestion: Yup.number()
    .required('Time limit is required'),

});

interface FormErrors {
  questionsNum?: string;
  timeLimitPerQuestion?: string;

}

export function Step2({ onSubmit }: { onSubmit: () => void }) {


  const selectConfig = (state: TStore) => state.config;
  const selectSetConfig = (state: TStoreActions) => state.setConfig;
  const setConfig = useInterviewStore(selectSetConfig);
  const config = useInterviewStore(selectConfig);
  const [formErrors, setFormErrors] = useState<FormErrors>({});




  const validate = async (): Promise<boolean> => {
    try {
      const formValues = { questionsNum: config.questionsNum, timeLimitPerQuestion: config.timeLimitPerQuestion }
      await validationSchema.validate(formValues, { abortEarly: false });
      setFormErrors({});
      return true;
    } catch (error: any) {
      const newErrors: FormErrors = {};
      error.inner.forEach((err: Yup.ValidationError) => {
        newErrors[err.path as keyof FormErrors] = err.message;
      });
      setFormErrors(newErrors);
      return false;
    }
  };


  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = await validate();
    if (isValid) {
      onSubmit();
    }
  }


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
          className="space-y-6 "
          onSubmit={
            handleSubmitForm
          }
        >
          <div >
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
            {formErrors.questionsNum && (
              <div className="mt-1  text-red-600 text-sm animate-fadeIn animate-slideDown">{formErrors.questionsNum}</div>
            )}
          </div>
          <div>
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
            {formErrors.timeLimitPerQuestion && (
              <div className="mt-1 text-red-600 text-sm animate-fadeIn animate-slideDown">{formErrors.timeLimitPerQuestion}</div>
            )}
          </div>
          <ButtonPrimary>
            Continue
          </ButtonPrimary>
        </form>
      </div>
    </>
  );
}
