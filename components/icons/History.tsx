interface Props {
    isActive: boolean;
}
const History: React.FC<Props> = ({ isActive }) => {
    const strokeColor = isActive ? "#0D1117" : "#00FFFF";
    return (
        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 21.5C5.47711 21.5 1 17.0228 1 11.5C1 5.97715 5.47715 1.5 11 1.5C15.4776 1.5 19.2257 4.44289 20.5 8.5H18" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11 7.5V11.5L13 13.5" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M20.9551 12.5C20.9848 12.1709 21 11.8373 21 11.5M14 21.5C14.3416 21.3876 14.6753 21.2564 15 21.1078M19.7906 16.5C19.9835 16.1284 20.1555 15.7433 20.305 15.3462M17.1925 19.7292C17.5369 19.4441 17.8631 19.1358 18.1688 18.8065" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )

}

export default History;