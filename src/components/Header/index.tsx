import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import ProfileMenu from "./ProfileMenu";

const Header: FC = () => {
  const { data } = useSession();
  const [profileMenuClicked, setProfileMenuClicked] = useState<boolean>(false);
  return (
    <div className="sticky top-2 z-50 m-2 flex max-h-[20vw] w-[95%] items-center justify-between rounded-md p-4 shadow-md">
      <h1>MeetMeHere</h1>
      <div className="relative">
        <button
          className={`duration-400 transition-opacity hover:opacity-60 ${
            profileMenuClicked && "opacity-60"
          }`}
          onClick={() => {
            setProfileMenuClicked((clicked) => !clicked);
          }}
        >
          <img
            src={data?.user.image as string}
            className="w-[64px] rounded-full border-2 border-zinc-900"
            alt=""
          />
        </button>
        {profileMenuClicked && <ProfileMenu />}
      </div>
    </div>
  );
};

export default Header;
