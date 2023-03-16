import { FC, ReactNode, useState } from "react";
import Header from "../Header";
import SideMenu from "../SideMenu";
import { useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";

const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const { data } = useSession();
  const { pathname } = useRouter();
  if (
    data &&
    ["/dashboard", "/previousMeetings", "/upcomingMeetings"].includes(pathname)
  ) {
    return (
      <main className="relative flex h-screen w-screen flex-col gap-[20px] overflow-hidden p-[20px]">
        <Header />
        <div className="relative flex h-[calc(100vh-140px)] w-full gap-4 md:h-[calc(100vh-180px)]">
          <SideMenu />
          <div className="scrollbar flex h-full w-full flex-col items-center overflow-y-scroll rounded-md px-2 shadow-md">
            {children}
          </div>
        </div>
      </main>
    );
  }
  return <>{children}</>;
};

export default AppShell;
