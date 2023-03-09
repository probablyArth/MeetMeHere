import { NextPage } from "next";
import { useState } from "react";
import Header from "~/components/Header/index";
import OverviewTab from "~/components/Tabs/Overview";
import PreviousMeetingsTab from "~/components/Tabs/PreviousMeetings";

const tabs = [<OverviewTab />, <PreviousMeetingsTab />];

const Dashboard: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<0 | 1 | 2>(0);

  return (
    <main className="relative flex w-screen flex-col items-center justify-center">
      <Header />
      {tabs[currentTab]}
    </main>
  );
};

export default Dashboard;
