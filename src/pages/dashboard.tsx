import { NextPage } from "next";
import { useState } from "react";
import Header from "~/components/Header/index";
import OverviewTab from "~/components/Tabs/Overview";
import PreviousMeetingsTab from "~/components/Tabs/PreviousMeetings";

const handleTabs = (currentTab: 0 | 1 | 2) => {
  switch (currentTab) {
    case 0:
      return <OverviewTab />;
    case 1:
      return <PreviousMeetingsTab />;
    case 2:
  }
};

const Dashboard: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<0 | 1 | 2>(0);

  return (
    <main className="relative flex w-screen flex-col items-center justify-center">
      <Header />
      {handleTabs(currentTab)}
    </main>
  );
};

export default Dashboard;
