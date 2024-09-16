"use client";

import * as Yup from "yup";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import Checkmark from "@/components/Checkmark";
import InputField from "@/components/InputField";
import { PageHeadline } from "@/components/PageHeadline";
import useInterviewStore, {
  TStore,
  TStoreActions,
} from "@/store/useInterviewStore";
import { useCallback, useState } from "react";
import Icon from "@/assets/ai.png";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

const MemoizedReCAPTCHA = React.memo(ReCAPTCHA);

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  firstName: Yup.string()
    .matches(/^[a-zA-Z]+$/, 'First name can only contain letters')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[a-zA-Z]+$/, 'Last name can only contain letters')
    .required('Last name is required'),
  recaptchaToken: Yup.string()
    .required('Please complete the reCAPTCHA'),
});

export function Step3({ onSubmit }: { onSubmit: () => void }) {


  const selectConfig = (state: TStore) => state.config;
  const selectSetConfig = (state: TStoreActions) => state.setConfig;
  const selectUser = (state: TStoreActions) => state.setUser;
  const selectUserData = (state: TStore) => state.user;


  const setConfig = useInterviewStore(selectSetConfig);
  const setUser = useInterviewStore(selectUser);
  const config = useInterviewStore(selectConfig);
  const user = useInterviewStore(selectUserData);
  const recaptchaToken = user.recaptchaToken;

  const setRecaptchaToken = (token: string) => {
    setUser({ recaptchaToken: token });
  };

  const [errors, setErrors] = useState<{ email?: string; recaptchaToken?: string; firstName?: string; lastName?: string }>({});



  const handleRecaptchaChange = useCallback(
    (value: string | null) => {
      if (!value) return;

      setRecaptchaToken(value);
    },
    [setRecaptchaToken]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate the form values
      await validationSchema.validate({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        recaptchaToken,
      }, { abortEarly: false });

      // Clear errors if validation is successful
      setErrors({});

      // Call the onSubmit function if validation is successful
      onSubmit();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: { email?: string; recaptchaToken?: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof typeof newErrors] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className=" bg-white mt-4  sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <div className="flex justify-center">
            <Image
              className="max-w-[100%] w-20"
              src={Icon}
              alt="AI Interviewer"
            />
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-lg mb-5">
            <PageHeadline>Who is taking the interview?</PageHeadline>
          </div>

          <InputField
            id="email"
            type="email"
            label="Email address"
            onChange={(e) => setUser({ email: e.target.value })}
            value={user.email || ""}
          />
          <div className="mt-1">
            <p className="text-xs">The results will be sent to your email address.</p>
          </div>
          {errors.email && (
            <div className="mt-1 text-red-600 text-sm animate-fadeIn">{errors.email}</div>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col">
            <InputField
              id="firstName"
              type="text"
              label="First Name"
              onChange={(e) => setUser({ firstName: e.target.value })}
              value={user.firstName || ""}
            />
            {errors.firstName && (
              <div className="mt-1 text-red-600 text-xs animate-fadeIn">{errors.firstName}</div>
            )}
          </div>
          <div className="flex flex-col">
            <InputField
              id="lastName"
              type="text"
              label="Last Name"
              onChange={(e) => setUser({ lastName: e.target.value })}
              value={user.lastName || ""}
            />
            {errors.lastName && (
              <div className="mt-1 text-red-600 text-xs animate-fadeIn">{errors.lastName}</div>
            )}
          </div>

        </div>

        {
          !recaptchaToken && (
            <MemoizedReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={handleRecaptchaChange}

            />
          )
        }
        <div>
          <ButtonPrimary >
            Start The Interview
          </ButtonPrimary>
        </div>
      </form >
    </div >
  );
}
