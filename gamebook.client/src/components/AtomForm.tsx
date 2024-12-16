import React, { useState, FormEvent } from 'react';

type AtomFormProps = {
  label?: string; // Optional label for the text input
  placeholder?: string; // Placeholder text for the input
  onSubmit: (value: string) => void; // Callback to handle form submission
  validationPattern?: RegExp; // Optional regex pattern for validation
  errorMessage?: string; // Error message to display if validation fails
}

const AtomForm: React.FC<AtomFormProps> = ({
  label = 'Enter text',
  placeholder = 'Type here...',
  onSubmit,
  validationPattern,
  errorMessage = 'Invalid input',
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (validationPattern && !validationPattern.test(inputValue)) {
      setError(errorMessage);
      return;
    }

    setError(null); // Clear any previous errors
    onSubmit(inputValue);
    setInputValue(''); // Reset input field after submission
  };

  return (
    <form onSubmit={handleSubmit} className="atom-form">
      {label && <label className="atom-form-label">{label}</label>}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="atom-form-input"
      />
      {error && <span className="atom-form-error">{error}</span>}
      <button type="submit" className="atom-form-button">
        Submit
      </button>
    </form>
  );
};

export default AtomForm;

