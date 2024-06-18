import React from "react";
import {
  getAuthUserDetails,
  verifyAndAcceptInvitation,
} from "../../../lib/queries";
import Unauthorized from "@/components/unauthorized.tsx";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { state: string; code: string };
};

const SubAccountMainPage = async ({ searchParams }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) return <Unauthorized />;

  const user = await getAuthUserDetails();
  if (!user) return;

  const getFirstSubAccountWithAcess = user.Permissions.find(
    (permission) => permission.access === true
  );

  if (searchParams.state) {
    const statePath = searchParams.state.split("___")[0];
    const stateSubaccountId = searchParams.state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

  if (getFirstSubAccountWithAcess) {
    return redirect(`subaccount/${getFirstSubAccountWithAcess.subAccountId}`);
  }

  return <Unauthorized />;
};

export default SubAccountMainPage;
