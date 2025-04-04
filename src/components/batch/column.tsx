"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Define the type for the subscription data
export type SubscriptionColumn = {
  userId: string;
  id: string;
  name: string;
  userName: string;
  email: string;
  image: string;
  price: number;
  startDate: string;
  endDate: string;
};

// Subscription Table Component
const SubscriptionTable = ({ subscriptions }: { subscriptions: SubscriptionColumn[] }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border border-gray-300 text-left">Name</th>
            <th className="p-3 border border-gray-300 text-left">Email</th>
            <th className="p-3 border border-gray-300 text-left">Price</th>
            <th className="p-3 border border-gray-300 text-left">Start Date</th>
            <th className="p-3 border border-gray-300 text-left">End Date</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.id} className="border border-gray-200">
              <td className="p-3 flex items-center gap-3 border border-gray-300">
                <Link href={`/profile/${subscription.userName}`}>
                  <div className="flex items-center gap-3 hover:underline cursor-pointer">
                    <Image
                      src={
                        subscription.image ||
                        `https://avatar.iran.liara.run/username?username=${subscription.name}`
                      }
                      alt="user"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <h2 className="font-semibold uppercase text-zinc-700 dark:text-zinc-100">
                      {subscription.name}
                    </h2>
                  </div>
                </Link>
              </td>
              <td className="p-3 border border-gray-300 text-zinc-700 dark:text-zinc-100 font-semibold">
                {subscription.email}
              </td>
              <td className="p-3 border border-gray-300 text-zinc-700 dark:text-zinc-100 font-semibold">
                ₹{subscription.price.toFixed(2)}
              </td>
              <td className="p-3 border border-gray-300 text-zinc-700 dark:text-zinc-100 font-semibold">
                {subscription.startDate}
              </td>
              <td className="p-3 border border-gray-300 text-zinc-700 dark:text-zinc-100 font-semibold">
                {subscription.endDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable;
