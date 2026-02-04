interface Props {
  isActive: boolean;
}

const Model: React.FC<Props> = ({ isActive }) => {
  const strokeColor = isActive ? "white" : "#5835C0";

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Brain outline */}
      <path
        d="M8.5 4.5C6.29086 4.5 4.5 6.29086 4.5 8.5C4.5 9.61639 4.96339 10.6241 5.70711 11.2929C4.96339 11.9617 4.5 12.9694 4.5 14.0858C4.5 16.295 6.29086 18.0858 8.5 18.0858"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M15.5 4.5C17.7091 4.5 19.5 6.29086 19.5 8.5C19.5 9.61639 19.0366 10.6241 18.2929 11.2929C19.0366 11.9617 19.5 12.9694 19.5 14.0858C19.5 16.295 17.7091 18.0858 15.5 18.0858"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Center line */}
      <path
        d="M12 4.5V18.0858"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />

      {/* Neural nodes */}
      <circle cx="9" cy="9.5" r="0.75" fill={strokeColor} />
      <circle cx="15" cy="9.5" r="0.75" fill={strokeColor} />
      <circle cx="12" cy="13.5" r="0.75" fill={strokeColor} />
    </svg>
  );
};

export default Model;
