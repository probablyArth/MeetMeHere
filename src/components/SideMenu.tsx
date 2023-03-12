import { Dispatch, FC, ReactNode, SetStateAction, useState } from "react";
import { AiFillRightSquare } from "react-icons/ai";
import { tab } from "~/pages/dashboard";
import Button from "./Common/Button";

const SideMenuButton: FC<{ children: ReactNode; onClick: () => void }> = ({
  children,
  onClick,
}) => (
  <Button style="inverted" className="w-3/5" onClick={onClick}>
    {children}
  </Button>
);

const SideMenu: FC<{ setCurrentTab: Dispatch<SetStateAction<tab>> }> = ({
  setCurrentTab,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div
      className={`absolute top-0 left-0 flex h-full max-h-[800px] bg-transparent duration-300 ease-in-out md:sticky md:max-h-full`}
    >
      <div
        className={`relative w-[300px] rounded-md shadow-md transition-all ${
          !showSidebar && "-ml-[300px] md:-ml-0"
        }`}
      >
        <ul className="flex h-full flex-col items-center justify-center gap-4">
          <SideMenuButton
            onClick={() => {
              setCurrentTab(0);
            }}
          >
            Overview
          </SideMenuButton>
          <SideMenuButton
            onClick={() => {
              setCurrentTab(1);
            }}
          >
            Previous Meetings
          </SideMenuButton>
          <SideMenuButton
            onClick={() => {
              setCurrentTab(2);
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
        className="absolute right-[-50px] top-[50%] md:hidden"
      >
        <AiFillRightSquare size={"50px"} />
      </button>
    </div>
  );
};

export default SideMenu;
