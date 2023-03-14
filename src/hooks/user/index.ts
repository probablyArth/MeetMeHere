import { useRouter } from "next/router";
import {} from "next-auth/react";
import { api } from "~/utils/api";

export const useDeleteUser = () => {
  const context = api.useContext();

  const deleteUser = api.user.delete.useMutation({
    onSuccess: () => {
      context.invalidate();
    },
  });
  return () => {
    deleteUser.mutate();
  };
};

export const useAddUserRate = () => {
  const router = useRouter();
  const context = api.useContext();

  const addUserRate = api.user.addRate.useMutation({
    onSuccess: () => {
      context.invalidate().then(() => {
        router.reload();
      });
    },
  });

  return (rate: number) => {
    addUserRate.mutate(rate);
  };
};

export const useUserExistsByGmail = (gmail: string) => {
  return api.user.existsBygmail.useQuery(gmail, { enabled: false });
};
