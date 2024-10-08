"use client";

import * as Yup from "yup";
import { ButtonPrimary } from "@/components/ButtonPrimary";
import { PageHeadline } from "@/components/PageHeadline";
import { SelectField } from "@/components/SelectField";
import useInterviewStore, {
    TStore,
    TStoreActions,
} from "@/store/useInterviewStore";
import { TExperienceLevelKeys, TInterviewRoleKeys } from "@/shared";
import { useState } from "react";
import {
    interviewRoles,
    experienceLevels,

} from "@/constants";
import Icon from "@/assets/ai.png";
import Image from "next/image";
import React from "react";



const validationSchema = Yup.object({
    position: Yup.string()
        .required('Position is required'),
    seniorityLevel: Yup.string()
        // .oneOf(['Junior', 'Mid', 'Senior', 'Lead'], 'Invalid seniority level')
        .required('Seniority level is required')
})


interface FormErrors {
    position?: string;
    seniorityLevel?: string;

}

export function Step1({ onSubmit }: { onSubmit: () => void }) {

    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const validate = async (): Promise<boolean> => {
        try {
            const formValues = { position: config.role, seniorityLevel: config.experienceLevel }
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

    const selectConfig = (state: TStore) => state.config;
    const selectSetConfig = (state: TStoreActions) => state.setConfig;
    const setConfig = useInterviewStore(selectSetConfig);
    const config = useInterviewStore(selectConfig);

    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = await validate();
        if (isValid) {
            onSubmit();
        }
    }

    return (
        <>
            <div className="flex justify-center ">
                <Image
                    className="max-w-[100%] w-20"
                    src={Icon}
                    alt="AI Interviewer"
                />
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-lg mb-5">
                <PageHeadline>What position are you applying for?</PageHeadline>
            </div>

            <div className=" bg-white mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmitForm}
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
                        {formErrors.position && (
                            <div className="mt-1 text-red-600 text-sm animate-fadeIn animate-slideDown">{formErrors.position}</div>
                        )}
                    </div>

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
                    {formErrors.seniorityLevel && (
                        <div className="mt-1 text-red-600 text-sm animate-fadeIn animate-slideDown">{formErrors.seniorityLevel}</div>
                    )}
                    <div className="">

                    </div>

                    <div className="mb-3 justify-self-end">
                        <ButtonPrimary >
                            Continue
                        </ButtonPrimary>
                    </div>

                </form >
            </div >
        </>
    );
}
