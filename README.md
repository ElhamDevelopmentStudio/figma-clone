# Projex

Projex is a multi-tenant agency CRM built with Next.js 14, Prisma, Clerk, Stripe, and UploadThing. It combines agency onboarding, client subaccounts, funnel publishing, sales pipelines, billing, media uploads, and team management in one codebase.


## Core capabilities

- Agency and subaccount workspaces with role-based access
- Clerk-based authentication and invitation-driven team onboarding
- Funnel management with a visual page editor and live subdomain publishing
- CRM pipeline boards with lanes, tickets, tags, and contacts
- Stripe billing, subscriptions, connected accounts, and dashboard metrics
- Media uploads through UploadThing

## Stack

- Next.js 14 App Router
- TypeScript
- Prisma with MySQL
- Clerk for auth
- Stripe and Stripe Connect
- UploadThing
- Tailwind CSS, Radix UI, and Tremor

## Project layout

```text
prisma/schema.prisma                      Prisma schema for agencies, subaccounts, funnels, CRM, and billing
src/app/site                              Public landing page
src/app/(main)/agency                     Agency onboarding, dashboard, billing, team, settings
src/app/(main)/subaccount                 Client workspace: funnels, pipelines, media, contacts, launchpad
src/app/[domain]                          Live funnel rendering based on subdomain routing
src/app/api/stripe                        Stripe customer, subscription, checkout, and webhook endpoints
src/app/api/uploadthing                   UploadThing file routes
src/lib/queries.ts                        Main server-side data access and mutations
src/providers/editor                      Funnel editor state management
```

## Main product areas

### Public site

- `/site` is the landing page.
- `/` rewrites to `/site` in middleware.

### Agency workspace

- `/agency` handles onboarding, invitation acceptance, and role-based redirects.
- `/agency/[agencyId]` shows agency metrics and Stripe-backed performance data.
- `/agency/[agencyId]/billing` manages plans, add-ons, and charge history.
- `/agency/[agencyId]/team` manages users and invitations.

### Subaccount workspace

- `/subaccount/[subAccountId]` shows subaccount revenue and funnel analytics.
- `/subaccount/[subAccountId]/funnels` manages funnels and funnel pages.
- `/subaccount/[subAccountId]/funnels/[funnelId]/editor/[funnelPageId]` opens the visual funnel editor.
- `/subaccount/[subAccountId]/pipelines` creates or opens the default CRM pipeline.

### Live funnel delivery

- Middleware rewrites subdomain traffic into `src/app/[domain]`.
- Funnel pages are resolved by `subDomainName` in the database and rendered through the same editor components in live mode.

## Data model

The Prisma schema centers around these entities:

- `Agency`, `SubAccount`, `User`, `Permissions`, `Invitation`, `Notification`
- `Funnel`, `FunnelPage`, `ClassName`
- `Pipeline`, `Lane`, `Ticket`, `Tag`, `Contact`
- `Subscription`, `AddOns`
- `Media`, `Trigger`, `Automation`, `Action`

## Prerequisites

- Node.js 18+ or 20+
- MySQL database
- Clerk project
- Stripe account and webhook configuration
- UploadThing app

## Environment variables

Create a `.env.local` file in the project root.

### Required variables observed in code

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma MySQL connection string |
| `NEXT_PUBLIC_URL` | Base app URL. Use a trailing slash because the code concatenates route segments directly. Example: `http://localhost:3000/` |
| `NEXT_PUBLIC_SCHEME` | Protocol prefix used for generated funnel links. Example: `http://` or `https://` |
| `NEXT_PUBLIC_DOMAIN` | Base host used by subdomain routing. Example: `localhost:3000` or `example.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client key |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_WEBHOOK_SECRET_LIVE` | Optional live webhook override |
| `NEXT_PUBLIC_STRIPE_CLIENT_ID` | Stripe Connect OAuth client id |
| `NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT` | Platform fee percent for connected-account subscriptions |
| `NEXT_PUBLIC_PLATFORM_ONETIME_FEE` | Platform fee for one-time connected-account payments |
| `NEXT_PUBLIC_PLATFORM_AGENY_PERCENT` | Required by the code as written. Note the typo in the variable name |
| `NEXT_PLURA_PRODUCT_ID` | Stripe product id for agency plan pricing. Legacy name preserved in code |

### Provider variables inferred from the integrations in this repo

These are not referenced with `process.env` in application code, but the integrations strongly imply they are required:

- Clerk publishable and secret keys for `@clerk/nextjs`
- UploadThing credentials for the configured UploadThing app

If you want to keep setup explicit, start with something like this and adjust to your provider dashboards:

```bash
DATABASE_URL="mysql://root:password@127.0.0.1:3306/projex"

NEXT_PUBLIC_URL="http://localhost:3000/"
NEXT_PUBLIC_SCHEME="http://"
NEXT_PUBLIC_DOMAIN="localhost:3000"

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_CLIENT_ID="ca_..."
NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT="10"
NEXT_PUBLIC_PLATFORM_ONETIME_FEE="10"
NEXT_PUBLIC_PLATFORM_AGENY_PERCENT="10"
NEXT_PLURA_PRODUCT_ID="prod_..."

# Inferred from Clerk usage
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Inferred from UploadThing usage
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

## Local development

Install dependencies:

```bash
npm install
```

Push the Prisma schema to your database:

```bash
npx prisma db push
```

Start the app:

```bash
npm run dev
```

Then open `http://localhost:3000`.

Optional:

```bash
npx prisma studio
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run Next.js linting |

There is no test script in the current repository.

## Subdomain routing notes

Funnels are published using `subDomainName` values stored in the database. The middleware splits the incoming host using `NEXT_PUBLIC_DOMAIN` and rewrites requests into the dynamic `[domain]` route.

For local development, set the base domain carefully and test with a hostname pattern your environment resolves correctly. A common setup is:

```bash
NEXT_PUBLIC_DOMAIN="localhost:3000"
NEXT_PUBLIC_SCHEME="http://"
NEXT_PUBLIC_URL="http://localhost:3000/"
```

Then access published funnels through a matching subdomain host such as `myfunnel.localhost:3000` if your local environment supports it.

## Stripe flow

- `/api/stripe/create-customer` creates Stripe customers
- `/api/stripe/create-subscription` creates or updates agency subscriptions
- `/api/stripe/create-checkout-session` creates embedded checkout sessions for connected subaccounts
- `/api/stripe/webhook` syncs subscription state back into Prisma

If you deploy this app, remember to register the webhook endpoint with Stripe.

## Deployment notes

- You need MySQL, Clerk, Stripe, and UploadThing configured in the target environment.
- Live funnel links depend on correct domain and protocol variables.
- Wildcard subdomain support is needed if you want public funnel URLs to work outside local development.
- `src/lib/utils.ts` currently hard-codes `metadataBase` to a Railway URL. Update that before production use.
- `next.config.mjs` explicitly allows images from UploadThing, Clerk, Stripe, and a placeholder `subdomain` host.

## Repository notes

- `package.json` still uses the name `figma-clone`.
- Some environment variable names still use legacy Projex predecessor naming.
- There are no Prisma migration files or seed scripts in the repository right now, only `prisma/schema.prisma`.

