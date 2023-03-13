import { signOut } from "next-auth/react";
import { FC, ReactNode } from "react";

const ProfileLink: FC<{
  colorClass: string;
  onClick: () => void;
  children: ReactNode;
}> = ({ colorClass, onClick, children }) => (
  <li>
    <button
      onClick={onClick}
      className={`duration-400 p-4 transition-colors hover:bg-slate-100 ${colorClass}`}
    >
      {children}
    </button>
  </li>
);
const ProfileMenu: FC = () => (
  <ul className=" absolute flex flex-col items-center divide-y rounded-md bg-white shadow-md">
    <ProfileLink colorClass="text-red-500" onClick={signOut}>
      logout
    </ProfileLink>
    <ProfileLink colorClass="text-red-500" onClick={signOut}>
      logout
    </ProfileLink>
  </ul>
);

export default ProfileMenu;
