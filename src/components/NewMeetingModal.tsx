import { Modal, ModalProps, Select, TextInput, Textarea } from "@mantine/core";
import { DateTimePicker, DateValue } from "@mantine/dates";
import { useForm } from "@mantine/form";
import dayjs from "dayjs";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import Button from "~/components/Common/Button";
import { useCreateMeeting } from "~/hooks/meeting";
import { useUserExistsByGmail } from "~/hooks/user";
import { IoMdAddCircle } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { useSession } from "next-auth/react";

const Invitees = (
  invitees: string[],
  setInvitees: Dispatch<SetStateAction<string[]>>
) => {
  return (
    <div className="flex">
      {invitees.map((invitee, key) => {
        return (
          <div
            className="flex items-center justify-start gap-2 rounded-md p-4 text-xs shadow-md outline outline-1 outline-slate-600"
            key={key}
          >
            {invitee}
            <button
              onClick={() => {
                setInvitees((invitees) => {
                  const newInvitees = [...invitees];
                  newInvitees.splice(key, 1);
                  return newInvitees;
                });
              }}
            >
              <TiDelete size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const NewMeetingModal: FC<ModalProps & { closeModal: () => void }> = (
  props
) => {
  const [inviteeError, setInviteeError] = useState<string>("");
  const [invitees, setInvitees] = useState<string[]>([]);
  const [currInvitee, setCurrInvitee] = useState<string>("");
  const { refetch, isFetching } = useUserExistsByGmail(currInvitee);
  const session = useSession();

  const handleInviteeAddition = () => {
    if (currInvitee.trim() === "") {
      setInviteeError("Empty string dawg");
      return false;
    }
    if (currInvitee === session.data?.user.email) {
      setInviteeError("Can't invite your own ass");
      return;
    }
    refetch().then((data) => {
      if (data.data) {
        setInvitees((invitees) => [...invitees, currInvitee]);
        setInviteeError("");
        setCurrInvitee("");
        return;
      }
      setInviteeError("User not found");
      return;
    });
  };

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
      description: (value) =>
        value.length < 3 ? "Give it atleast 3 character of thought smh" : null,
    },
  });

  return (
    <Modal {...props} centered title="Create a new meeting">
      <div className="flex flex-col gap-4">
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
        <div className="flex w-full items-center justify-between">
          <form
            id="InviteeForm"
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              handleInviteeAddition();
            }}
          >
            <div className="flex flex-col">
              {inviteeError && (
                <span className="text-red-500">{inviteeError}</span>
              )}
              <TextInput
                placeholder="probablyarth@gmail.com"
                label="Enter gmail of registered users to invite them"
                value={currInvitee}
                onChange={(e) => {
                  setCurrInvitee(e.target.value);
                }}
                disabled={isFetching}
              />
            </div>
          </form>
          <button form="InviteeForm">
            <IoMdAddCircle
              size={46}
              className="rounded-full transition-opacity duration-300 hover:opacity-80"
            />
          </button>
        </div>
        {Invitees(invitees, setInvitees)}
        <Button
          style="inverted"
          onClick={(e) => {
            const result = form.validate();
            if (invitees.length < 1)
              return setInviteeError("Can't meet alone ffs");
            if (!result.hasErrors && !isFetching) {
              createMeeting({
                dateTime: dayjs(form.values.dateTime).toDate(),
                title: form.values.title,
                description: form.values.description,
                duration: form.values.duration,
                invitees,
              });
            }
          }}
        >
          Create
        </Button>
      </div>
    </Modal>
  );
};

export default NewMeetingModal;
