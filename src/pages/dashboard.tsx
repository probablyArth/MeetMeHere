import { NextPage } from "next";
import Header from "~/components/Header/index";

const Dashboard: NextPage = () => {
  return (
    <main className="relative flex w-screen flex-col items-center justify-center">
      <Header />
    </main>
  );
};

export default Dashboard;
