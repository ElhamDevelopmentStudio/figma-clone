import BlurPage from "@/components/global/BlurPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { SubAccount, Contact, Ticket } from "@prisma/client";
import { format } from "date-fns/format";
import React from "react";
import CreateContactButton from "./_components/CreateContactButton";

type Props = {
  params: { subAccountId: string };
};

const ContactPage = async ({ params }: Props) => {
  type subAccountWithContacts = SubAccount & {
    Contact: (Contact & { Ticket: Ticket[] })[];
  };

  const contacts = (await db.subAccount.findUnique({
    where: { id: params.subAccountId },
    include: {
      Contact: {
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })) as subAccountWithContacts;

  const allContacts = contacts.Contact;

  const formatTotal = async (tickets: Ticket[]) => {
    if (!tickets || !tickets.length) return "$0.00";
    const amount = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    });

    const laneAmount = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    );

    return amount.format(laneAmount);
  };

  const allContactsWithTotals = await Promise.all(
    allContacts.map(async (contact) => ({
      ...contact,
      totalValue: await formatTotal(contact.Ticket),
    }))
  );

  return (
    <BlurPage>
      <h1 className="text-4xl p-4">Contacts</h1>
      <div className="p-2">
        <CreateContactButton subAccountId={params.subAccountId} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Email</TableHead>
            <TableHead className="w-[200px]">Active</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allContactsWithTotals.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback className="bg-primary text-white">
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {contact.totalValue === "$0.00" ? (
                  <Badge variant={"destructive"}>Inactive</Badge>
                ) : (
                  <Badge className="bg-emerald-700">Active</Badge>
                )}
              </TableCell>
              <TableCell>{format(contact.createdAt, "MM/dd/yyyy")}</TableCell>
              <TableCell className="text-right">
                {formatTotal(contact.Ticket)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlurPage>
  );
};

export default ContactPage;
