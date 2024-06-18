import { db } from "@/lib/db";
import React from "react";
import DataTable from "./DataTable";

type Props = {
  params: {
    agencyId: string;
  };
};

const BillingPage = async ({ params }: Props) => {
  const authUser = await db.user.findMany({
    where: {
      id: params.agencyId,
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
    include: { SubAccount: true },
  });

  if (!agencyDetails) return;

  return <DataTable></DataTable>;
};

export default BillingPage;
