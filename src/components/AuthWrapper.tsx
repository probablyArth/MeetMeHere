import { FC, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AuthWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { data, status } = useSession();
  const router = useRouter();
  console.table({ data, status });
  useEffect(() => {
    if (data !== undefined) {
      if (status === "authenticated") {
        if (typeof data.user.rate === "number") {
          if (router.pathname === "/register") {
            router.push("/dashboard");
            return;
          }
        } else {
          if (router.pathname !== "/register") {
            router.push("/register");
            return;
          }
        }
      } else if (status === "unauthenticated" && router.pathname !== "/") {
        router.push("/");
      }
    }
  }, [router.pathname, data]);
  if (data === undefined) {
    return <h1>Loading</h1>;
  }
  return <>{children}</>;
};

export default AuthWrapper;
