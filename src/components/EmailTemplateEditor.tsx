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
  const handleInsertVariable = (variable: string) => {
    const cursorPosition = (document.getElementById('email-template') as HTMLTextAreaElement)?.selectionStart || 0;
    const textBefore = value.substring(0, cursorPosition);
    const textAfter = value.substring(cursorPosition);
    onChange(`${textBefore}{${variable}}${textAfter}`);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {availableVariables.map((variable) => (
          <button
            key={variable}
            type="button"
            onClick={() => handleInsertVariable(variable)}
            disabled={disabled}
            className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md ${
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
      
      <textarea
        id="email-template"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Hi {name}, 

Thanks for your interest in our products. We noticed you work at {company} and wanted to follow up about how we can help with your specific needs.

Best regards,
Your Name"
        className={`w-full px-4 py-3 border rounded-md h-64 font-mono text-sm ${
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