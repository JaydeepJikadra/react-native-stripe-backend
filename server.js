const express = require("express");
const app = express();
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const amount = process.env.AMOUNT;
const CURRENCY = process.env.CURRENCY;
app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());

app.get("/", (req, res) => {
  // Display checkout page
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // You should always calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  //default amount is 13$
  return amount * 100;
};

app.post("/create-payment", async (req, res) => {
  console.log("req ", req.body);
  const { number, exp_month, exp_year, cvc, items, currency } = req.body;
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
      },
    });
    const orderAmount = calculateOrderAmount(items);
    if (paymentMethod != null) {
      paymentMethodId = paymentMethod.id;
      console.log("id= " + paymentMethodId);
      // Create new PaymentIntent with a PaymentMethod ID from the client.
      intent = await stripe.paymentIntents.create({
        amount: orderAmount,
        currency: CURRENCY,
        payment_method: paymentMethodId,
        confirmation_method: "manual",
        confirm: true,
        // If a mobile client passes `useStripeSdk`, set `use_stripe_sdk=true`
        // to take advantage of new authentication features in mobile SDKs
        //use_stripe_sdk: useStripeSdk,
      });
      // After create, if the PaymentIntent's status is succeeded, fulfill the order.

      if (intent) {
        // console.log("intent: ", intent);
        //const re = generateResponse(intent);
        // console.log("RESPONSE: ", re);
        res.send(generateResponse(intent));
      }
    }
  } catch (error) {
    console.log("ERROR: ", error);
    res.send({ error: error.message });
  }
});

const generateResponse = (intent) => {
  // Generate a response based on the intent's status
  switch (intent.status) {
    case "requires_action":
    case "requires_source_action":
      // Card requires authentication
      return {
        requiresAction: true,
        clientSecret: intent.client_secret,
      };
    case "requires_payment_method":
    case "requires_source":
      // Card was not properly authenticated, suggest a new payment method
      return {
        error: "Your card was denied, please provide a new payment method",
      };
    case "succeeded":
      // Payment is complete, authentication not required
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log("💰 Payment received!");
      return { paymentId: intent.id, message: "💰 Payment received!" };
  }
};

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
