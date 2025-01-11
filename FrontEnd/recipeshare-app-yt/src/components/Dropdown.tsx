import React from 'react';

type DropdownProps = {
  styles?: string;
  options: string[];
  onClick: (value: string) => void;
  isRequired?: boolean;
};

const Dropdown = ({ styles, options, onClick, isRequired }: DropdownProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onClick(e.target.value);
  };

  return (
    <select onChange={handleChange} className={styles}>
      {isRequired && <option value="" disabled hidden>Select an option</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
