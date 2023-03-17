import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreatorView from "~/components/Meet/Creator";
import ParticipantView from "~/components/Meet/Participant";
import Room from "~/components/Meet/room";
import { ROLE } from "~/server/api/services/HMS";
import { api } from "~/utils/api";

const MeetPageSkeleton = () => {
  return <h1>Loading</h1>;
};

const getAuthToken = () => {};

const MeetPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  // const [role, setRole] = useState<ROLE>(ROLE.invitee);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const authTokenQuery = api.meeting.getAuthToken.useQuery(
    {
      meeting_id: router.query.id as string,
    },
    {
      enabled: false,
      onSuccess: () => {},
    }
  );
  const data = api.meeting.getByID.useQuery(
    {
      meetingId: router.query.id as string,
    },
    {
      onSuccess: () => {
        authTokenQuery.refetch();
      },
    }
  );
  useEffect(() => {
    const status = data.fetchStatus;
    if (status === "fetching" || !authTokenQuery.isFetched) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [data.fetchStatus, authTokenQuery.isFetched]);

  if (isConnected) return <Room />;

  if (loading) return <MeetPageSkeleton />;
  if (data.data === null || data.data === undefined) {
    return <h1>Meeting not found!</h1>;
  }
  if (authTokenQuery.data?.role === ROLE.creator) {
    return (
      <CreatorView
        meeting={data.data}
        authToken={authTokenQuery.data.authToken}
      />
    );
  }
  return <ParticipantView />;
};

export default MeetPage;
