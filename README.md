# Starbucks Demo

A small static front-end demo for a Starbucks-inspired browsing and ordering flow. The project separates discovery and ordering into two pages:

- `index.html` presents a clean homepage with featured drinks and a simple pickup flow.
- `order.html` contains a focused order builder with live pricing, pickup options, and confirmation feedback.

This project uses plain HTML, CSS, and JavaScript. There is no build step and no backend service.

## Features

- Two-page customer flow: browse on the homepage, customize on the order page
- Responsive navigation with a mobile menu toggle
- Featured menu cards for signature drinks
- Interactive order builder with:
  - drink selection
  - size selection
  - milk and temperature options
  - extras / add-ons
  - quantity stepper
  - pickup time and pickup mode
- Live order summary with subtotal, service fee, total, and stars estimate
- Inline confirmation state after placing an order
- Draft persistence with `localStorage`
- Scroll reveal animations for key sections

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (`Cormorant Garamond`, `Manrope`)

## Project Structure

```text
.
├── index.html
├── order.html
├── script.js
├── style.css
└── Logo.png
```

## Run Locally

Because this is a static site, you can run it in either of these ways:

1. Open `index.html` directly in a browser.
2. Serve the folder with a lightweight local server.

Example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## How The Demo Works

### Homepage

The homepage is designed as a lighter browsing surface. It highlights featured drinks, explains the pickup flow, and directs the user into the order builder when they are ready to customize.

### Order Page

The order page keeps the builder and ticket summary side by side. As the user changes the drink, size, milk, extras, quantity, or pickup details, the summary updates immediately.

When the form is submitted:

- the browser validates required fields
- a confirmation card is shown
- a simple order number is generated on the client

## Notes And Limitations

- This is a front-end demo only; no real order is submitted.
- Pricing, service fees, and stars values are hard-coded in `script.js`.
- Order state is stored only in the browser via `localStorage`.
- No payment, authentication, inventory, or backend integration is included.

## Future Improvements

- Connect the order flow to a backend API
- Persist real orders and customer profiles
- Add unit or end-to-end test coverage
- Add accessibility and cross-browser audit passes
- Introduce analytics or event tracking for the ordering funnel

## Disclaimer

This is an educational/demo project inspired by Starbucks-style ordering flows. It is not an official Starbucks product.
