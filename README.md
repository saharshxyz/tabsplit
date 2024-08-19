This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## TODO

- [ ] Use Hash Arguments (URL Fragments) instead of Search Params
- [ ] Refactor codebase
- [ ] Use consistent copy/naming across site (are we going by 'bill' or 'check' or what)
- [ ] Create favicon/logo
- [ ] Update OG image to use logo
- [ ] Share button on form
- [ ] Clear form button
- [ ] Come up with a way not to have submit form button at bottom as that's inconvenient for longer forms
- [ ] For the individual splits, display the amount the individual payed for each item in the receipt-like format (so they won't show in the card description but instead as a table row)

Example: [Random bill](https://multisplit.saharsh.xyz/?checkName=Friday+Night+Dinner+at+Gourmet+Fusion&taxAmount=15.75&tipAmount=31.5&tipBeforeTax=true&items=%5B%7B%22name%22%3A%22Truffle+Infused+Risotto%22%2C%22price%22%3A24.99%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Alice%22%7D%2C%7B%22name%22%3A%22Bob%22%7D%2C%7B%22name%22%3A%22Charlie%22%7D%5D%7D%2C%7B%22name%22%3A%22Seared+Ahi+Tuna%22%2C%22price%22%3A28.5%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Diana%22%7D%2C%7B%22name%22%3A%22Eve%22%7D%5D%7D%2C%7B%22name%22%3A%22Wagyu+Beef+Sliders%22%2C%22price%22%3A18.75%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Frank%22%7D%2C%7B%22name%22%3A%22George%22%7D%2C%7B%22name%22%3A%22Hannah%22%7D%5D%7D%2C%7B%22name%22%3A%22Lobster+Mac+and+Cheese%22%2C%22price%22%3A22.99%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Alice%22%7D%2C%7B%22name%22%3A%22Charlie%22%7D%2C%7B%22name%22%3A%22Eve%22%7D%2C%7B%22name%22%3A%22Isaac%22%7D%5D%7D%2C%7B%22name%22%3A%22Grilled+Vegetable+Platter%22%2C%22price%22%3A15.5%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Bob%22%7D%2C%7B%22name%22%3A%22Diana%22%7D%2C%7B%22name%22%3A%22Hannah%22%7D%5D%7D%2C%7B%22name%22%3A%22Artisanal+Cheese+Board%22%2C%22price%22%3A19.99%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Alice%22%7D%2C%7B%22name%22%3A%22Bob%22%7D%2C%7B%22name%22%3A%22Charlie%22%7D%2C%7B%22name%22%3A%22Diana%22%7D%2C%7B%22name%22%3A%22Eve%22%7D%2C%7B%22name%22%3A%22Frank%22%7D%2C%7B%22name%22%3A%22George%22%7D%2C%7B%22name%22%3A%22Hannah%22%7D%2C%7B%22name%22%3A%22Isaac%22%7D%5D%7D%2C%7B%22name%22%3A%22Crispy+Calamari%22%2C%22price%22%3A16.5%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Charlie%22%7D%2C%7B%22name%22%3A%22Frank%22%7D%2C%7B%22name%22%3A%22Isaac%22%7D%5D%7D%2C%7B%22name%22%3A%22Miso+Glazed+Black+Cod%22%2C%22price%22%3A32%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Diana%22%7D%2C%7B%22name%22%3A%22George%22%7D%5D%7D%2C%7B%22name%22%3A%22Truffled+Pommes+Frites%22%2C%22price%22%3A9.99%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Alice%22%7D%2C%7B%22name%22%3A%22Bob%22%7D%2C%7B%22name%22%3A%22Charlie%22%7D%2C%7B%22name%22%3A%22Diana%22%7D%2C%7B%22name%22%3A%22Eve%22%7D%2C%7B%22name%22%3A%22Frank%22%7D%2C%7B%22name%22%3A%22George%22%7D%2C%7B%22name%22%3A%22Hannah%22%7D%2C%7B%22name%22%3A%22Isaac%22%7D%5D%7D%2C%7B%22name%22%3A%22Chocolate+Lava+Cake%22%2C%22price%22%3A11.99%2C%22eaters%22%3A%5B%7B%22name%22%3A%22Alice%22%7D%2C%7B%22name%22%3A%22Eve%22%7D%2C%7B%22name%22%3A%22Hannah%22%7D%2C%7B%22name%22%3A%22Isaac%22%7D%5D%7D%5D&eaters=%5B%7B%22name%22%3A%22Alice%22%7D%2C%7B%22name%22%3A%22Bob%22%7D%2C%7B%22name%22%3A%22Charlie%22%7D%2C%7B%22name%22%3A%22Diana%22%7D%2C%7B%22name%22%3A%22Eve%22%7D%2C%7B%22name%22%3A%22Frank%22%7D%2C%7B%22name%22%3A%22George%22%7D%2C%7B%22name%22%3A%22Hannah%22%7D%2C%7B%22name%22%3A%22Isaac%22%7D%5D)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
