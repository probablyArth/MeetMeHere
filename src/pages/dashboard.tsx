import Button from "~/components/Common/Button";
import NewMeetingModal from "../components/NewMeetingModal";
import { useDisclosure } from "@mantine/hooks";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
  const [opened, handler] = useDisclosure();
  return (
    <>
      <Button style="inverted" onClick={handler.open}>
        Create a new meeting
      </Button>
      <NewMeetingModal
        opened={opened}
        onClose={handler.close}
        closeModal={handler.close}
      ></NewMeetingModal>
    </>
  );
};

export default Dashboard;
