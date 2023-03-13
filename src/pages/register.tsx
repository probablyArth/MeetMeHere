import { NextPage } from "next";
import { MouseEvent, useState } from "react";
import { useAddUserRate } from "~/hooks/user";

const RegisterPage: NextPage = () => {
  const [rate, setRate] = useState<number>(0);
  const addUserRate = useAddUserRate();

  const handleSubmit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    addUserRate(rate);
  };

  return (
    <form action="" id="rateForm">
      <div>
        <h1 className="text-xl">MeetMeHere</h1>
        <div className="flex flex-col gap-2 rounded-md p-4 shadow-sm">
          <label htmlFor="rate">Your hourly rate</label>
          <div className="flex gap-3">
            <input
              className="rounded-sm bg-gray-100 px-2"
              type="number"
              placeholder="10"
              id="rate"
              value={rate}
              onChange={(e) => {
                setRate(parseInt(e.target.value));
              }}
            />
            <span>$/hr</span>
          </div>
          <button
            type="submit"
            className="rounded-sm bg-blue-600 text-white shadow-md transition-colors hover:bg-blue-500"
            form="rateForm"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Let's Go
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterPage;
