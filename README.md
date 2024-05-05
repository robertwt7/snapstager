# [SnapStager](https://snapstager.com) - Virtual Staging with AI

This is the source code of SnapStager.com (a paid SaaS product). Feel free to play around with and use the code in your project.

[![SnapStager](./public/screenshot.png)](https://snapstager.com)

## How it works

It uses a custom ML model called hosted on replicate similar to Stable Diffusion Inpainting. SnapStager gives you the ability to upload a photo of any room, mask the room in the web using canvas, then send both the original Image and Mask through the ML Model using a Next.js API route, and return your staged room.

Tech stack used for this app are:
- [Replicate](https://replicate.com/) to host the ML Model
- [Supabase](https://supabase.com/) to host the DB and Auth
- [Cloudflare](https://developers.cloudflare.com/images/) to host and serve both the original and final image.
- [Vercel](https://vercel.com) to host the NextJS App
- [Prisma](https://www.prisma.io/) for the ORM
- [Stripe] to handle payments

## Running Locally

### Cloning the repository the local machine.

```bash
git clone https://github.com/robertwt7/snapstager.git
```

### Storing the API keys in .env

Copy `env.example` to `.env` at the root of the project to start filling in the API keys

### Creating a account on Replicate to get an API key.

1. Go to [Replicate](https://replicate.com/) to make an account.
2. Click on your profile picture in the top left corner, and click on "API Tokens".
3. Here you can find your API token. Copy it.
4. Store it in the .env file

### Create a free account on Supabase and get the API key.

1. Go to [Supabase](https://supabase.com)
2. Create a new organisation and project.
3. Go to "Project Settings" at the bottom left, click on "API" under configuration
4. Copy the **URL** and **anon key** under Project API Keys.
5. Store it in the .env file

Next you need to store the database env which is located at `prisma/env.example`, copy this file to `prisma/.env`

1. Go to "Project Settings" at the bottom left, click on "Database" under configuration
2. Copy the connection string for the **Session** mode ending with port `:5432` to the `DIRECT_URL` env
3. Copy the connection string for the **Transaction** mode ending with port `:6543` to the `DATABASE_URL` env, then add this query param at the end of the connection string: `?pgbouncer=true&connection_limit=1`
4. Open your db in the DB Client like [Dbeaver](https://dbeaver.io/), open **Databases**, create a new database with the name `shadow_postgres` as the [shadow db](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/shadow-database) for prisma
5. Repeat step 2 for the `SHADOW_DATABASE_URL` and change the db after `5432/postgres` to `5432/shadow_postgres`

### Create an account at cloudflare (Need subscription)
1. Go to [Cloudflare](https://www.cloudflare.com/en-gb/) and create an account
2. Login to dashboard
3. Go to "Images" at the sidebar, then click "Overview" (you have to subscribe for this)
4. Copy the "Account ID" on the right and add it to the environment file under `CLOUDFLARE_ACCOUNT_ID`
5. Click **Use API** and click get API Token
6. Create a new one and copy it to the environment file under `CLOUDFLARE_TOKEN`

### Create a stripe account
1. Go to [Stripe](https://dashboard.stripe.com/)
2. Create an account
3. Follow the guide to create a [product catalogue](https://docs.stripe.com/products-prices/getting-started)
4. Go to each product and copy the ID at the top right to each environment var that starts with `STRIPE_PRICE_ID_<YOUR-VARIANT>`
5. Finally click "Developers" on the top right menu, then find your API key and create a webhook key with the correct endpoint at `https://yourdomain.com/api/stripe-webhook` and copy it to the environment file.


### Installing the dependencies.

```bash
yarn
```

### Running the application.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
yarn dev
```

## License

This repo is MIT licensed.
