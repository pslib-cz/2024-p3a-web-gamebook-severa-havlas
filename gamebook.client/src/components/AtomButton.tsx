import React from 'react';

// Define the type for the button props
interface ButtonProps {
  label: string; // Text to display on the button
  onClick: () => void; // Function to handle button click
  color?: string; // Background color (optional)
  size?: 'small' | 'medium' | 'large'; // Button size (optional)
}

const Button: React.FC<ButtonProps> = ({ label, onClick, color = 'blue', size = 'medium' }) => {
  // Style object to customize the button based on props
  const buttonStyles = {
    backgroundColor: color,
    padding: size === 'large' ? '12px 24px' : size === 'small' ? '6px 12px' : '8px 16px',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    fontSize: size === 'large' ? '16px' : size === 'small' ? '12px' : '14px',
    transition: 'background-color 0.3s ease',
  };

  // Handle mouse hover effect
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = `dark${color}`;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = color;
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {label}
    </button>
  );
};

export default Button;
