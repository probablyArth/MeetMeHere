import { FC } from "react";

const LoadingSkeleton: FC = () => {
  return (
    <div className="z-[-1] flex h-[250px] w-full flex-col justify-center gap-[50px] rounded-md p-8 shadow-sm">
      <div className="flex animate-pulse flex-col gap-2">
        <div className="h-[30px] w-[80%] rounded-sm bg-slate-100"></div>
        <div className="h-[25px] w-[60%] rounded-sm bg-slate-100"></div>
      </div>
      <div className="flex w-full  animate-pulse justify-between">
        <div className="h-[64px] w-[64px] rounded-full bg-slate-100"></div>
        <div className="flex">
          <div className="h-[64px] w-[64px] rounded-full bg-slate-200"></div>
          <div className="ml-[-20px] h-[64px] w-[64px] rounded-full bg-slate-100"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
