type TGoogleVerifyResponse = {
  success: boolean;
  "error-codes": string[];
};

export function apiVerifyRecaptcha(token: string) {
  const secret_key = process.env.RECAPTCHA_SECRET_KEY;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  return fetch(url, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((google_response: TGoogleVerifyResponse) => {
      return google_response;
    });
}
