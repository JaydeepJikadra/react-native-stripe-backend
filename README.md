# Stripe BackEnd -Accepting a card payment

![Badge](https://img.shields.io/badge/Node.js-Stripe--backend-blue)

This sample includes implementations of the server in Node to perform Stripe payment via API.

## Requirements

- Node v10+

- Stripe account Is Required For this Project so if you don't have an account then create one first. You can find More info for how to setup account and retrieve your Publishable and Secret Keys from [Stripe](https://stripe.com/docs/development/quickstart#api-keys) Document.

## Installation

Download or clone this project.

Open This project with your suitable Code Editor like Visual Studio Code.

Open .env.example and rename to .env in the folder of the server and replace this variable values with your stripe keys.

```

STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>

STRIPE_SECRET_KEY=<replace-with-your-secret-key>

```

In the same file You can set your own Amount or currency code for below variables.

To see supported currency code by stripe you can review [stripe supported currencies](https://stripe.com/docs/currencies#presentment-currencies) doc.

```

CURRENCY=<replace-with-your-currency-code>

AMOUNT=<replace-with-your-amount>

```

Open the project in Terminal.

Run below command to install dependency and start your server.

Make sure you are in your project's root folder

```

npm install

npm start

```

You will see your development server running in terminal.

Happy Coding ..🎃 🥳
