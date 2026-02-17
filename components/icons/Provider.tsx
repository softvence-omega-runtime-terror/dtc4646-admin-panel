interface Props {
  isActive: boolean;
}

const Provider: React.FC<Props> = ({ isActive }) => {
  const strokeColor = isActive ? "white" : "#5835C0";

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center node */}
      <circle
        cx="12"
        cy="7.5"
        r="3"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Left node */}
      <circle
        cx="5"
        cy="17.5"
        r="2.5"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Right node */}
      <circle
        cx="19"
        cy="17.5"
        r="2.5"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Connections */}
      <path
        d="M10 9.5L6.5 15"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 9.5L17.5 15"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Base line */}
      <path
        d="M7.5 19.5H16.5"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Provider;
