interface Props {
  isActive: boolean;
}

const Profile: React.FC<Props> = ({ isActive }) => {
  const strokeColor = isActive ? "white" : "#5835C0";

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <path
        d="M12 12.5C14.4853 12.5 16.5 10.4853 16.5 8C16.5 5.51472 14.4853 3.5 12 3.5C9.51472 3.5 7.5 5.51472 7.5 8C7.5 10.4853 9.51472 12.5 12 12.5Z"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Body */}
      <path
        d="M4 21.5C4 18.1863 7.58172 15.5 12 15.5C16.4183 15.5 20 18.1863 20 21.5"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Profile;
