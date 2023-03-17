import { useHMSActions } from "@100mslive/react-sdk";
import { Meeting } from "@prisma/client";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { api } from "~/utils/api";

const CreatorView: FC<{ meeting: Meeting; authToken: string | null }> = ({
  meeting,
  authToken,
}) => {
  const context = api.useContext();
  const session = useSession();
  const updateMeetingStatus = api.meeting.setMeetingStatus.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });

  const hmsActions = useHMSActions();

  if (authToken === null) {
    return (
      <div>
        <h1 className="text-2xl">{meeting.title}</h1>
        <button
          className="rounded-md bg-black p-4 text-white shadow-md"
          onClick={() => {
            updateMeetingStatus.mutate({
              meetingId: meeting.id,
              status: "ongoing",
            });
          }}
        >
          Start
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>{meeting.title}</h1>
      <button
        className="rounded-md bg-black p-4 text-white shadow-md"
        onClick={async () => {
          const config = {
            authToken,
            userName: "l",
          };
          console.log({ config });
          await hmsActions.join(config);
        }}
      >
        Join
      </button>
    </div>
  );
};

export default CreatorView;
