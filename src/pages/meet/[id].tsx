import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const MeetPageSkeleton = () => {
  return <h1>Loading</h1>;
};

const MeetPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const data = api.meeting.getByID.useQuery({
    meetingId: router.query.id as string,
  });
  console.log(data.fetchStatus);
  useEffect(() => {
    const status = data.fetchStatus;
    if (status === "fetching") {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [data.fetchStatus]);

  if (loading) return <MeetPageSkeleton />;
  if (data.data === null || data.data === undefined) {
    return <h1>Meeting not found!</h1>;
  }
  return <h1>Meeting: {data.data.id}</h1>;
};

export default MeetPage;
