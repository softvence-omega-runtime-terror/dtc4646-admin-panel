interface Props {
    isActive: boolean;
}
const Content: React.FC<Props> = ({ isActive }) => {
    const strokeColor = isActive ? "#0D1117" : "#00FFFF";
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5995 19.4737L7.63427 20.7672C6.2983 21.0153 5.63031 21.1393 5.24549 20.7545C4.86067 20.3697 4.98471 19.7016 5.2328 18.3656L6.52621 11.4001C6.73362 10.2831 6.83732 9.72463 7.20549 9.38719C7.57365 9.04975 8.24697 8.98389 9.59359 8.85218C10.8915 8.72524 12.1197 8.28032 13.4 7L19 12.6005C17.7197 13.8808 17.2746 15.1083 17.1474 16.4062C17.0155 17.753 16.9495 18.4264 16.6121 18.7945C16.2747 19.1626 15.7163 19.2663 14.5995 19.4737Z" stroke={strokeColor} stroke-width="1.5" stroke-linejoin="round" />
            <path d="M13 15.2105C12.4405 15.1197 11.9289 14.8763 11.5263 14.4737M11.5263 14.4737C11.1237 14.0711 10.8803 13.5595 10.7895 13M11.5263 14.4737L6 20" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" />
            <path d="M13.5 7C14.1332 6.06586 15.4907 4.16107 16.7613 4.00976C17.6287 3.90648 18.3472 4.62499 19.7842 6.06202L19.938 6.2158C21.375 7.65283 22.0935 8.37135 21.9902 9.23867C21.8389 10.5092 19.9341 11.8668 19 12.5" stroke={strokeColor} stroke-width="1.5" stroke-linejoin="round" />
            <path d="M2 4H8" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" />
        </svg>
    );
};

export default Content;
