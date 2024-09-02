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

export function Step1({ onSubmit }: { onSubmit: () => void }) {
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
        <>
            <div className="flex justify-center">
                <Image
                    className="max-w-[100%] w-20"
                    src={Icon}
                    alt="AI Interviewer"
                />
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <PageHeadline>What position are you applying for?</PageHeadline>
            </div>

            <div className=" bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    className="space-y-6"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit()
                        // handleGenerateQuestions();
                    }}
                >


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
                        <div className="mb-3">
                            <ButtonPrimary className="mt-5">
                                Continue
                            </ButtonPrimary>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
