import { NextPage } from "next";
import { api } from "~/utils/api";
import Link from "next/link";
import LoadingSkeleton from "~/components/upcomingMeetings/LoadingSkeleton";
import UpcomingMeetingCard from "~/components/upcomingMeetings/Card";

const UpcomingMeetings: NextPage = () => {
  const upcomingMeetings = api.meeting.getUpcoming.useQuery();

  if (upcomingMeetings.status === "loading") {
    return (
      <>
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </>
    );
  }
  if (upcomingMeetings.status === "error") {
    return <h1>An Error Occurred</h1>;
  }
  if (
    upcomingMeetings.status === "success" &&
    upcomingMeetings.data.length === 0
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1>Looks like you don't have anything to look forward to!</h1>
        <Link
          href={"/dashboard"}
          className="rounded-md text-blue-900 underline hover:opacity-70"
        >
          Create a meeting
        </Link>
      </div>
    );
  }
  return (
    <>
      {upcomingMeetings.data.map((meeting, idx) => {
        return <UpcomingMeetingCard meeting={meeting} key={idx} />;
      })}
    </>
  );
};

export default UpcomingMeetings;
