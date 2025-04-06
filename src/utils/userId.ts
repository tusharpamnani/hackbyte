"use server"

import { auth } from '@clerk/nextjs/server';
export const UserId = async () => {
    const user = await auth();
    return user?.userId;
}