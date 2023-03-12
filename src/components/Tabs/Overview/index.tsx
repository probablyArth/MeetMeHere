import { FC, useState } from "react";
import Button from "~/components/Common/Button";
import NewMeetingModal from "./NewMeetingModal";
import { useDisclosure } from "@mantine/hooks";

const OverviewTab: FC = () => {
  const [opened, handler] = useDisclosure();
  return (
    <>
      <Button style="inverted" onClick={handler.open}>
        Create a new meeting
      </Button>
      <NewMeetingModal
        opened={opened}
        onClose={handler.close}
      ></NewMeetingModal>
    </>
  );
};

export default OverviewTab;
