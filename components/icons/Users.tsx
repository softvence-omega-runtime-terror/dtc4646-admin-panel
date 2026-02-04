interface Props {
  isActive: boolean;
}

const Users: React.FC<Props> = ({ isActive }) => {
  const strokeColor = isActive ? "white" : "#5835C0";

  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main user */}
      <path
        d="M12 11.5C14.2091 11.5 16 9.70914 16 7.5C16 5.29086 14.2091 3.5 12 3.5C9.79086 3.5 8 5.29086 8 7.5C8 9.70914 9.79086 11.5 12 11.5Z"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Left user */}
      <path
        d="M6.5 10.5C7.88071 10.5 9 9.38071 9 8C9 6.61929 7.88071 5.5 6.5 5.5C5.11929 5.5 4 6.61929 4 8C4 9.38071 5.11929 10.5 6.5 10.5Z"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Right user */}
      <path
        d="M17.5 10.5C18.8807 10.5 20 9.38071 20 8C20 6.61929 18.8807 5.5 17.5 5.5C16.1193 5.5 15 6.61929 15 8C15 9.38071 16.1193 10.5 17.5 10.5Z"
        stroke={strokeColor}
        strokeWidth="1.5"
      />

      {/* Group body */}
      <path
        d="M4 21.5C4 18.4624 7.58172 16 12 16C16.4183 16 20 18.4624 20 21.5"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Users;
