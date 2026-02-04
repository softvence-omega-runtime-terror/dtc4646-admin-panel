interface Props {
  isActive: boolean;
}

const Form: React.FC<Props> = ({ isActive }) => {
  const strokeColor = isActive ? "white" : "#5835C0";

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Form container */}
      <rect
        x="4"
        y="3.5"
        width="16"
        height="18"
        rx="2"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Header line */}
      <path
        d="M8 7.5H16"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Input fields */}
      <path
        d="M8 11.5H16"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 15.5H13"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Checkbox */}
      <rect
        x="8"
        y="18"
        width="2.5"
        height="2.5"
        rx="0.5"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default Form;
