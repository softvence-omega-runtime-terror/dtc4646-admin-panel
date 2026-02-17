interface Props {
  isActive: boolean;
}

const Prompt: React.FC<Props> = ({ isActive }) => {
  const strokeColor = isActive ? "white" : "#5835C0";

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chat bubble */}
      <path
        d="M4 6.5C4 5.39543 4.89543 4.5 6 4.5H18C19.1046 4.5 20 5.39543 20 6.5V14.5C20 15.6046 19.1046 16.5 18 16.5H9L5 20.5V16.5H6C4.89543 16.5 4 15.6046 4 14.5V6.5Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Text lines */}
      <path
        d="M8 8.5H16"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 11.5H13"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Prompt;
