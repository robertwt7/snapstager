/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { api } from "src/env";
import { prismaClient } from "src/services";
import Stripe from "stripe";
export async function POST(request: Request) {
  const stripe = new Stripe(api.STRIPE_SECRET_KEY);
  const endpointSecret = api.STRIPE_WEBHOOK_SECRET;

  const sig = request.headers.get("stripe-signature");

  let event;

  if (request.body !== null && sig !== null) {
    try {
      const reqBody = await request.text();
      event = stripe.webhooks.constructEvent(reqBody, sig, endpointSecret);
    } catch (err: any) {
      return NextResponse.json(`Webhook Error: ${err?.message}`, {
        status: 400,
      });
    }

    const fiveCredit = "prod_PgdIlJThwNAuPI";
    const twentyCredit = "prod_PgdM1VW89XiSLl";
    const hundredCredit = "prod_PgdJOKhLqFvNFM";
    const creditMap = {
      [fiveCredit]: 5,
      [twentyCredit]: 20,
      [hundredCredit]: 100,
    };
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSessionCompleted = event.data.object;
        const { id, client_reference_id, status, amount_total } =
          checkoutSessionCompleted;
        try {
          if (status === "complete" && client_reference_id !== null) {
            const { line_items } = await stripe.checkout.sessions.retrieve(id, {
              expand: ["line_items"],
            });

            await prismaClient.profile.update({
              where: {
                uid: client_reference_id,
              },
              data: {
                credit: {
                  increment:
                    creditMap[
                      line_items?.data[0].price
                        ?.product as keyof typeof creditMap
                    ] ?? 0,
                },
                Transactions: {
                  create: {
                    stripeCheckoutSessionId: id,
                    amount: amount_total ?? 0,
                  },
                },
              },
            });
          } else {
            throw new Error("client_reference_id is null");
          }
        } catch (e: any) {
          return NextResponse.json(
            `Error handling checkout session completed: ${e?.message}`,
            {
              status: 400,
            },
          );
        }
        break;
      }
      // ... handle other event types
      default: {
        console.log(`Unhandled event type ${event.type}`);
      }
    }
  }
  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
