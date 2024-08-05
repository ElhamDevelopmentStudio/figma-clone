import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStripeOAuthLink(
  accountType: "agency" | "subaccount",
  state: string
) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}${accountType}&state=${state}`;
}

export function constructMetadata({
  title = "Projex - run your agency",
  description = "Project - run your agency in just one place",
  image = "/assets/preview.png",
  icons = "/assets/plura-logo.svg",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@denvudd",
    },
    icons,
    metadataBase: new URL(
      "https://digital-hippo-production-denvudd.up.railway.app"
    ),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export const ADD_ONS = [
  {
    title: "Priority Support",
    // Product 3: Priority Support
    id: "prod_PeTaCp1HBRmIun",
  },
];

