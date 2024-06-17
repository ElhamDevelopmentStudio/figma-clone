import { db } from "@/lib/db";
import React from "react";
import DataTable from "./DataTable";
import { PlusIcon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { columns } from "./Columns";
import SendInvitation from "@/components/forms/SendInvitation";

type Props = {
  params: {
    agencyId: string;
  };
};

const BillingPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      id: params.agencyId,
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!teamMembers) return null;

  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <PlusIcon size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    ></DataTable>
  );
};

export default BillingPage;
