import React from 'react';

interface EmailTemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  variables: string[];
  availableVariables: string[];
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  value,
  onChange,
  variables,
  availableVariables
}) => {
  const handleInsertVariable = (variable: string) => {
    const cursorPosition = (document.getElementById('email-template') as HTMLTextAreaElement)?.selectionStart || 0;
    const textBefore = value.substring(0, cursorPosition);
    const textAfter = value.substring(cursorPosition);
    onChange(`${textBefore}{${variable}}${textAfter}`);
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {availableVariables.map((variable) => (
          <button
            key={variable}
            type="button"
            onClick={() => handleInsertVariable(variable)}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Insert {'{' + variable + '}'}
          </button>
        ))}
      </div>
      
      <textarea
        id="email-template"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hi {name}, 

Thanks for your interest in our products. We noticed you work at {company} and wanted to follow up about how we can help with your specific needs.

Best regards,
Your Name"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-64 font-mono"
      />
      
      {variables.length > 0 && (
        <div className="mt-2 text-sm text-gray-500">
          Variables used: {variables.map(v => `{${v}}`).join(', ')}
        </div>
      )}
    </div>
  );
};

export default EmailTemplateEditor;