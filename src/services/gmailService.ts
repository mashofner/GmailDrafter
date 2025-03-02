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
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          raw: encodedEmail
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create draft');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating draft:', error);
    throw new Error('Failed to create email draft. Please try again.');
  }
};