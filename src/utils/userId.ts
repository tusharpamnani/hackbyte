import { useUser } from '@clerk/nextjs';

export const UserId = () => {
    const { user } = useUser();
    const userId : string = user?.id;
  return userId;
}