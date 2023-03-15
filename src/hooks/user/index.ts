import { api } from "~/utils/api";

export const useAddUserRate = () => {
  const addUserRate = api.user.addRate.useMutation();

  return (rate: number) => {
    addUserRate.mutate(rate);
  };
};

export const useUserExistsByGmail = (gmail: string) => {
  return api.user.existsBygmail.useQuery(gmail, { enabled: false });
};
