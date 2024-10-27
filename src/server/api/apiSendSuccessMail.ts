import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "@/email-templates/success";
import { Resend } from "resend";
import { User } from "@/store/useInterviewStore";
import { captureInfo } from "taglog-nextjs-client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function apiSendSuccessMail(resultLink: string, user: User) {
  if (!user.email) {
    return false;
  }

  const { data, error } = await resend.emails.send({
    from: "Ai Bot <mail@email.dsaga.dev>",
    to: [user.email],
    subject: "AI Bot - Your interview results",
    react: EmailTemplate({ resultLink }),
  });
  captureInfo("sending success email", { data, error });
  return true;
}
