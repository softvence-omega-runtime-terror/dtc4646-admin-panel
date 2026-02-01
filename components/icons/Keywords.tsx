interface Props {
    isActive: boolean;
}
const Keywords: React.FC<Props> = ({ isActive }) => {
    const strokeColor = isActive ? "#0D1117" : "#00FFFF";
    return (<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 7.5H9.5C6.21252 7.5 4.56878 7.5 3.46243 8.40796C3.25989 8.57418 3.07418 8.75989 2.90796 8.96243C2 10.0688 2 11.7125 2 15C2 18.2875 2 19.9312 2.90796 21.0376C3.07418 21.2401 3.25989 21.4258 3.46243 21.592C4.56878 22.5 6.21252 22.5 9.5 22.5H14.5C17.7875 22.5 19.4312 22.5 20.5376 21.592C20.7401 21.4258 20.9258 21.2401 21.092 21.0376C22 19.9312 22 18.2875 22 15C22 11.7125 22 10.0688 21.092 8.96243C20.9258 8.75989 20.7401 8.57418 20.5376 8.40796C19.4312 7.5 17.7875 7.5 14.5 7.5Z" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" />
        <path d="M12 7.5V5.5C12 4.94772 12.4477 4.5 13 4.5C13.5523 4.5 14 4.05228 14 3.5V2.5" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7 12.5L8 12.5" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M11.5 12.5L12.5 12.5" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M16 12.5L17 12.5" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7 17.5L17 17.5" stroke={strokeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    )
}

export default Keywords;