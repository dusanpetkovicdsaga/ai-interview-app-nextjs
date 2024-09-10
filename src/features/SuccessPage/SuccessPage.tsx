"use client"

import React from "react";
import successIcon from "../../assets/success-checkmark.svg"
import Image from "next/image";
import { PageContentBox } from "@/layout/PageContentBox";

export function SuccessPage() {
  return (
    <PageContentBox className=" border-blue-400 border-4">
      <div>
        <h1 className="flex text-[2.5rem] items-center mb-3">
          <Image alt="success" src={successIcon} className="w-12 mr-3" /> We are validating your answers.
        </h1>
      </div>
      <p className="text-[1.2rem] m-auto">Check your email for the results</p>
    </PageContentBox>
  );
}