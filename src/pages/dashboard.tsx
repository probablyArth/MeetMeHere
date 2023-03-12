import { NextPage } from "next";
import { useState } from "react";
import Header from "~/components/Header/index";
import SideMenu from "~/components/SideMenu";
import OverviewTab from "~/components/Tabs/Overview";
import PreviousMeetingsTab from "~/components/Tabs/PreviousMeetings";
import UpcomingMeetingsTab from "~/components/Tabs/UpcomingMeetings";

const tabs = [
  <OverviewTab />,
  <PreviousMeetingsTab />,
  <UpcomingMeetingsTab />,
];

export type tab = 0 | 1 | 2;

const Dashboard: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<tab>(0);

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-x-hidden">
      <Header />
      <div className="relative flex h-full w-full gap-4 p-4">
        <SideMenu setCurrentTab={setCurrentTab} />
        <div className="flex h-full w-full flex-col items-center rounded-md px-2 shadow-md">
          {tabs[currentTab]}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
