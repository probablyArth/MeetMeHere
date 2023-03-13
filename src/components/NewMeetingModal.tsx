import { Modal, ModalProps, Select, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { FC } from "react";
import Button from "~/components/Common/Button";
import { useCreateMeeting } from "~/hooks/meeting";

const NewMeetingModal: FC<ModalProps & { closeModal: () => void }> = (
  props
) => {
  const createMeeting = useCreateMeeting(props.closeModal);
  const form = useForm<{
    title: string;
    description: string;
    dateTime: DateValue;
    duration: "15" | "30";
  }>({
    initialValues: {
      title: "",
      description: "",
      dateTime: new Date(),
      duration: "15",
    },
    validate: {
      title: (value) => (value.length < 1 ? "Title must not be empty" : null),
      dateTime: (value) =>
        dayjs(value?.getTime()).diff(Date.now()) <= 0
          ? "That date already happened some time ago dumass"
          : null,
    },
  });

  return (
    <Modal {...props} centered title="Create a new meeting">
      <form
        onSubmit={form.onSubmit(async (e) => {
          console.log("here");
          createMeeting({
            dateTime: dayjs(e.dateTime).toDate(),
            title: e.title,
            description: e.description,
            duration: e.duration,
            invitees: [],
          });
        })}
        className="flex flex-col gap-4"
      >
        <TextInput
          label="Title"
          placeholder="A fking expensive meeting"
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          placeholder="This meeting is going to be so fucking expensive for real ahahaha."
          {...form.getInputProps("description")}
        />
        <DateTimePicker
          valueFormat="DD MMM YYYY hh:mm A"
          label="Pick date and time"
          placeholder="Pick date and time"
          mx="auto"
          dropdownType="modal"
          minDate={new Date()}
          {...form.getInputProps("dateTime")}
        />
        <Select
          label="Meeting Duration"
          placeholder="Pick one"
          data={["15", "30"]}
          {...form.getInputProps("duration")}
        />
        <Button style="inverted">Create</Button>
      </form>
    </Modal>
  );
};

export default NewMeetingModal;
