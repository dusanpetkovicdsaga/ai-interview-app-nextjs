import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '@/email-templates/success';
import { Resend } from 'resend';
import { User } from '@/store/useInterviewStore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function apiSendSuccessMail(resultLink: string, user: User) {

  if (!user.email) {
    return false
  }



  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [user.email],
    subject: 'Hello world',
    react: EmailTemplate({ resultLink }),
  });

  return true

}