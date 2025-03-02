import axios from 'axios';

interface DraftEmail {
  to: string;
  subject: string;
  message: string;
}

export const createGmailDraft = async (accessToken: string, email: DraftEmail): Promise<void> => {
  if (!accessToken) {
    throw new Error('Authentication required. Please sign in again.');
  }

  try {
    // Create the email content in RFC 2822 format
    const emailContent = [
      `To: ${email.to}`,
      `Subject: ${email.subject}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      email.message
    ].join('\r\n');

    // Encode the email content as base64
    const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Create the draft using Gmail API
    const response = await axios.post(
      'https://gmail.googleapis.com/gmail/v1/users/me/drafts',
      {
        message: {
          raw: encodedEmail
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating draft:', error);
    const errorMessage = error.response?.data?.error?.message || 'Failed to create email draft';
    throw new Error(errorMessage);
  }
};