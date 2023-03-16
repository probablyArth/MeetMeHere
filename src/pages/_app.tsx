import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import AuthWrapper from "~/components/AuthWrapper";
import Layout from "~/components/Layouts/layout";
import { MantineProvider } from "@mantine/core";
import AppShell from "~/components/Layouts/AppShell";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { HMSRoomProvider } from "@100mslive/react-sdk";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  console.log(router.pathname);
  return (
    <SessionProvider session={session}>
      <MantineProvider>
        <Notifications />
        <Layout>
          <AuthWrapper>
            <AppShell>
              {router.pathname === "/meet/[id]" ? (
                <HMSRoomProvider>
                  <Component {...pageProps} />
                </HMSRoomProvider>
              ) : (
                <Component {...pageProps} />
              )}
            </AppShell>
          </AuthWrapper>
        </Layout>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
