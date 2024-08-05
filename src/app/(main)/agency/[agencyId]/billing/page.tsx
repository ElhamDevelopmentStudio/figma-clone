import { Separator } from "@/components/ui/separator";
import { addOnProducts, pricingCards } from "@/lib/constants";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import React from "react";
import PricingCard from "./_components/PricingCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  params: {
    agencyId: string;
  };
};

const BillingPage = async ({ params }: Props) => {
  // WIP: Create the addOn Products
  const addOns = await stripe.products.list({
    ids: addOnProducts.map((product) => product.id),
    expand: ["data.default_price"],
  });

  const agencySubscription = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    select: {
      customerId: true,
      Subscription: true,
    },
  });

  const prices = await stripe.prices.list({
    product: process.env.NEXT_PLURA_PRODUCT_ID,
    active: true,
  });

  const currentPlanDetails = pricingCards.find(
    (c) => c.priceId === agencySubscription?.Subscription?.priceId
  );

  const charges = await stripe.charges.list({
    limit: 50,
    customer: agencySubscription?.customerId,
  });

  const allCharges = [
    ...charges.data.map((charge) => ({
      description: charge.description,
      id: charge.id,
      date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(
        charge.created * 1000
      ).toLocaleDateString()}`,
      status: "Paid",
      amount: `$${charge.amount / 100}`,
    })),
  ];

  return (
    <>
      <h1 className="text-4xl p-4">Billing</h1>
      <Separator className="mb-6" />
      <h2 className="text-2xl p-4">Current Plan</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          planExists={agencySubscription?.Subscription?.active === true}
          prices={prices.data}
          customerId={agencySubscription?.customerId || ""}
          amt={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.price || "0$"
              : "0$"
          }
          buttonCta={
            agencySubscription?.Subscription?.active === true
              ? "Change Plan"
              : "Get Started"
          }
          highlightDescription="Want to modify your plan? You can do it here. If you have further questions contact support@plura.com"
          highlightTitle="Plan Options"
          description={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.description || "Let's get started!"
              : "Let's get started! pick a plan that works best for you."
          }
          duration="/ month"
          features={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.features ||
                pricingCards.find((pricing) => pricing.title === "Starter")
                  ?.features ||
                []
              : currentPlanDetails?.features ||
                pricingCards.find((pricing) => pricing.title === "Starter")
                  ?.features ||
                []
          }
          title={
            agencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.title || "Starter"
              : "Starter"
          }
        />
        {addOns.data.map((addOn) => (
          <PricingCard
            planExists={agencySubscription?.Subscription?.active === true}
            prices={prices.data}
            customerId={agencySubscription?.customerId || ""}
            key={addOn.id}
            amt={
              //@ts-ignore
              addOn.default_price?.unit_amount
                ? //@ts-ignore
                  `$${addOn.default_price.unit_amount / 100}`
                : "$0"
            }
            buttonCta="Subscribe"
            description="Dedicated support line & teams channel for support"
            duration="/ month"
            features={[]}
            title={"24/7 priority support"}
            highlightTitle="Get support now!"
            highlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))}
      </div>
      <h2 className="text-2xl mb-4">Payment History</h2>
      <Table className="bg-card rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Invoice ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!!allCharges.length &&
            allCharges.map((charge) => (
              <TableRow key={charge.id}>
                <TableCell>{charge.description}</TableCell>
                <TableCell>
                  {format(new Date(charge.date), "dd/MM/yyyy hh:mm a")}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn({
                      "bg-emerald-500 text-white":
                        charge.status.toLowerCase() === "paid",
                      "bg-orange-600 text-white":
                        charge.status.toLowerCase() === "pending",
                      "bg-destructive text-white":
                        charge.status.toLowerCase() === "failed",
                    })}
                  >
                    {charge.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{charge.amount + ".00"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {charge.id}
                </TableCell>
              </TableRow>
            ))}
          {!allCharges.length && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-14 text-muted-foreground"
              >
                No charges found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default BillingPage;
