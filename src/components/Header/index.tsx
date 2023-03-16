import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import ProfileMenu from "./ProfileMenu";
import Image from "next/image";

const Header: FC = () => {
  const { data } = useSession();
  const [profileMenuClicked, setProfileMenuClicked] = useState<boolean>(false);
  return (
    <div className="flex h-[80px] w-full items-center justify-between rounded-md p-4 shadow-md md:h-[120px]">
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
          <Image
            src={data?.user.image as string}
            className="rounded-full border-2 border-zinc-900"
            alt={data?.user.name as string}
            width={64}
            height={64}
          />
        </button>
        {profileMenuClicked && <ProfileMenu />}
      </div>
    </div>
  );
};

export default Header;
