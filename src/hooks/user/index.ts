import { useRouter } from "next/router";
import { api } from "~/utils/api";

export const useDeleteUser = () => {
  const router = useRouter();

  const deleteUser = api.user.delete.useMutation();
  return () => {
    deleteUser.mutate();
    router.reload();
  };
};

export const useAddUserRate = () => {
  const router = useRouter();
  const addUserRate = api.user.addRate.useMutation({
    onSuccess: () => {
      router.reload();
    },
  });

  return (rate: number) => {
    addUserRate.mutate(rate);
  };
};
