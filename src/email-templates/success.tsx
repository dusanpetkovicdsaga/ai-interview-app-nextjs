import * as React from 'react';

interface EmailTemplateProps {
  resultLink: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  resultLink
}) => (
  <div>
    <h1>Your interview results!</h1>
    <p><a href={resultLink}>Click here</a></p>
  </div>
);