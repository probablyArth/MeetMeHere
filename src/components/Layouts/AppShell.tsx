import { FC, ReactNode, useState } from "react";
import Header from "../Header";
import SideMenu from "../SideMenu";
import { useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";

export type tab = 0 | 1 | 2;

const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<tab>(0);
  const { data } = useSession();
  const { pathname } = useRouter();
  if (
    data &&
    ["/dashboard", "/previousMeetings", "/upcomingMeetings"].includes(pathname)
  ) {
    return (
      <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-x-hidden">
        <Header />
        <div className="relative flex h-full w-full gap-4 p-4">
          <SideMenu setCurrentTab={setCurrentTab} />
          <div className="flex h-full w-full flex-col items-center rounded-md px-2 shadow-md">
            {children}
          </div>
        </div>
      </main>
    );
  }
  return <>{children}</>;
};

export default AppShell;
