import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { AiFillRightSquare } from "react-icons/ai";
import Button from "./Common/Button";
import { useRouter } from "next/router";

const SideMenuButton: FC<{ children: ReactNode; onClick: () => void }> = ({
  children,
  onClick,
}) => (
  <Button style="inverted" className="w-3/5" onClick={onClick}>
    {children}
  </Button>
);

const SideMenu: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  return (
    <div
      className={`absolute top-0 left-0 flex h-full max-h-[800px] bg-transparent duration-300 ease-in-out md:sticky md:max-h-full`}
    >
      <div
        className={`relative w-[220px] rounded-md shadow-md transition-all sm:w-[300px] lg:min-w-[500px] ${
          !showSidebar && "-ml-[300px] md:-ml-0"
        }`}
      >
        <ul className="flex h-full flex-col items-center justify-center gap-4">
          <SideMenuButton
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Overview
          </SideMenuButton>
          <SideMenuButton
            onClick={() => {
              router.push("/previousMeetings");
            }}
          >
            Previous Meetings
          </SideMenuButton>
          <SideMenuButton
            onClick={() => {
              router.push("/upcomingMeetings");
            }}
          >
            Upcoming Meetings
          </SideMenuButton>
        </ul>
      </div>
      <button
        onClick={() => {
          setShowSidebar((show) => !show);
        }}
        className="absolute right-[-50px] top-[50%] z-10 md:hidden"
      >
        <AiFillRightSquare size={"50px"} />
      </button>
    </div>
  );
};

export default SideMenu;
