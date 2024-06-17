"use client";
import {
  deletedSubAccount,
  getSubaccountDetails,
  saveActivityLogsNotification,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  subAccountId: string;
};

const DeleteButton = ({ subAccountId }: Props) => {
  const router = useRouter();
  return (
    <div
      onClick={async () => {
        const response = await getSubaccountDetails(subAccountId);
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted a subaccount | ${response?.name}`,
          subAccountId: subAccountId,
        });
        await deletedSubAccount(subAccountId);
        router.refresh();
      }}
    >
      Delete Sub Account
    </div>
  );
};

export default DeleteButton;
