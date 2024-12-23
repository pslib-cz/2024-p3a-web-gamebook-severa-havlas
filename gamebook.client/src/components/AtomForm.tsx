import React, { useState } from 'react';

type AtomFormProps = {
  label?: string; // Optional label for the text input
  placeholder?: string; // Placeholder text for the input
  onSubmit: (value: string) => void; // Callback to handle form submission
  validationPattern?: RegExp; // Optional regex pattern for validation
  errorMessage?: string; // Error message to display if validation fails
};

const AtomForm: React.FC<AtomFormProps> = ({
  label = 'Enter text',
  placeholder = 'Type here...',
  onSubmit,
  validationPattern,
  errorMessage = 'Invalid input',
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (validationPattern && !validationPattern.test(value)) {
      setError(errorMessage);
      return;
    }

    setError(null); // Clear any validation error
    onSubmit(value); // Automatically submit valid input
  };

  return (
    <div className="atom-form">
      {label && <label className="atom-form-label">{label}</label>}
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="atom-form-input"
      />
      {error && <span className="atom-form-error">{error}</span>}
    </div>
  );
};

export default AtomForm;
