import React from 'react';

interface EmailTemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables: string[];
  availableVariables: string[];
  disabled?: boolean;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  value,
  onChange,
  variables,
  availableVariables,
  disabled = false
}) => {
  const handleInsertVariable = (variable: string, inputId: string) => {
    const input = document.getElementById(inputId) as HTMLTextAreaElement | HTMLInputElement;
    if (!input) return;

    const cursorPosition = input.selectionStart || 0;
    const textBefore = input.value.substring(0, cursorPosition);
    const textAfter = input.value.substring(cursorPosition);
    
    if (inputId === 'email-subject') {
      const newSubject = `${textBefore}{${variable}}${textAfter}`;
      // Extract subject and body from the current value
      const [, body] = value.split('\n---\n');
      onChange(`${newSubject}\n---\n${body || ''}`);
    } else {
      const [subject = '', ] = value.split('\n---\n');
      const newBody = `${textBefore}{${variable}}${textAfter}`;
      onChange(`${subject}\n---\n${newBody}`);
    }
  };

  // Split the value into subject and body
  const [subject = '', body = ''] = value.split('\n---\n');

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {availableVariables.map((variable) => (
          <button
            key={variable}
            type="button"
            onClick={() => handleInsertVariable(variable, 'email-template')}
            disabled={disabled}
            className={`inline-flex items-center px-2 py-1.5 border text-xs font-medium rounded-md ${
              disabled 
                ? 'text-gray-400 bg-gray-700 border-gray-600 cursor-not-allowed'
                : 'text-white bg-comerian-teal/20 border-comerian-teal/30 hover:bg-comerian-teal/30 transition-colors'
            }`}
          >
            Insert {'{' + variable + '}'}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-comerian-gray mb-2">
        Click the buttons above to insert variables into your template. Each variable will be replaced with data from your sheet.
      </p>

      {/* Subject line input */}
      <div className="mb-4">
        <label htmlFor="email-subject" className="block text-sm font-medium text-white mb-2">
          Email Subject
        </label>
        <div className="relative">
          <input
            id="email-subject"
            value={subject}
            onChange={(e) => {
              const newSubject = e.target.value;
              onChange(`${newSubject}\n---\n${body}`);
            }}
            disabled={disabled}
            placeholder="Enter your email subject here (you can use {variables})"
            className={`w-full px-4 py-2 border rounded-md font-mono text-sm ${
              disabled 
                ? 'bg-comerian-dark text-gray-400 border-gray-700'
                : 'bg-comerian-dark focus:ring-comerian-teal focus:border-comerian-teal border-card-border text-white'
            }`}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {availableVariables.slice(0, 2).map((variable) => (
              <button
                key={`subject-${variable}`}
                onClick={() => handleInsertVariable(variable, 'email-subject')}
                disabled={disabled}
                className={`px-1.5 py-0.5 text-xs rounded ${
                  disabled
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-comerian-teal/20 text-comerian-teal hover:bg-comerian-teal/30'
                }`}
              >
                {'{' + variable + '}'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Email body textarea */}
      <label htmlFor="email-template" className="block text-sm font-medium text-white mb-2">
        Email Body
      </label>
      <textarea
        id="email-template"
        value={body}
        onChange={(e) => {
          const newBody = e.target.value;
          onChange(`${subject}\n---\n${newBody}`);
        }}
        disabled={disabled}
        placeholder="Hi {name}, 

Thanks for your interest in our products. We noticed you work at {company} and wanted to follow up about how we can help with your specific needs.

Best regards,
Your Name"
        className={`w-full px-4 py-3 border rounded-md h-48 sm:h-64 font-mono text-sm ${
          disabled 
            ? 'bg-comerian-dark text-gray-400 border-gray-700'
            : 'bg-comerian-dark focus:ring-comerian-teal focus:border-comerian-teal border-card-border text-white'
        }`}
      />
      
      {variables.length > 0 && (
        <div className="mt-2 text-sm text-comerian-gray">
          Variables used: {variables.map(v => `{${v}}`).join(', ')}
        </div>
      )}
    </div>
  );
};

export default EmailTemplateEditor;