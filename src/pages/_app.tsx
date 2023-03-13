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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider>
        <Notifications />
        <Layout>
          <AppShell>
            <AuthWrapper>
              <Component {...pageProps} />
            </AuthWrapper>
          </AppShell>
        </Layout>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
