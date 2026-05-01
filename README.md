# Market Kiosk PWA

A mobile-first single-page web app for taking and fulfilling farmer's market orders without a backend. It runs as a static site, stores data in `localStorage`, and can be hosted on GitHub Pages or used locally in a browser.

## Features

- Fast `Order Entry` screen with large touch controls
- One-category-at-a-time menu flow for quick scanning: `Plates`, `Hot Wraps`, `Cold Wraps`, `Drinks`
- `Queue` screen with per-item completion tracking and a simple active-order count
- Tap-anywhere item cards for faster order entry with a small remove button
- Sauce selection happens in the review step for `Hot Wraps` and `Cold Wraps`
- Review sheet before final order submission
- Per-item edit notes so kitchen-facing queue lines can show things like `No lettuce`
- Auto-generated order numbers and timestamps
- Auto-updating order status chip based on item completion
- Confirmation before sending out or clearing orders
- `Payments` tab with tap-to-reveal QR code panels
- Local persistence through `localStorage`
- PWA support with manifest and service worker for install/offline behavior on supported browsers

## Files

- [index.html](/C:/Files/Code/Kiosk/index.html)
- [styles.css](/C:/Files/Code/Kiosk/styles.css)
- [app.js](/C:/Files/Code/Kiosk/app.js)
- [manifest.webmanifest](/C:/Files/Code/Kiosk/manifest.webmanifest)
- [sw.js](/C:/Files/Code/Kiosk/sw.js)

## Customize the menu

Edit the `DEFAULT_MENU_ITEMS` array near the top of [app.js](/C:/Files/Code/Kiosk/app.js). Each item has:

```js
{ id: "unique-id", category: "Plates", name: "Display Name", price: 6.0 }
```

The current section names are:

- `Plates`
- `Hot Wraps`
- `Cold Wraps`
- `Drinks`

If you change section names, also update the `MENU_SECTIONS` array in [app.js](/C:/Files/Code/Kiosk/app.js).

## Replace the payment QR images

The `Payments` tab uses these placeholder files:

- [venmo-1.svg](/C:/Files/Code/Kiosk/payments/venmo-1.svg)
- [venmo-2.svg](/C:/Files/Code/Kiosk/payments/venmo-2.svg)
- [zelle.svg](/C:/Files/Code/Kiosk/payments/zelle.svg)

You can replace those files with your real QR images, or change the filenames in the `PAYMENT_OPTIONS` array in [app.js](/C:/Files/Code/Kiosk/app.js).

## Run locally

You can open [index.html](/C:/Files/Code/Kiosk/index.html) directly in a browser for the core app.

For full PWA behavior like service worker install and offline support, run it through a local web server instead of `file://`.

### Option 1: Python

```bash
python -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

### Option 2: VS Code Live Server

If you already use Live Server, serve the folder and open the local URL it provides.

## Deploy to GitHub Pages

Because this is a static app, GitHub Pages can host it directly.

1. Push this folder to a GitHub repository.
2. In GitHub, open `Settings` > `Pages`.
3. Set the source to deploy from your default branch root.
4. After Pages finishes publishing, open the site URL on your iPhone.

## Add to iPhone Home Screen

1. Open the deployed site or a localhost tunnel URL in Safari on iPhone.
2. Tap `Share`.
3. Tap `Add to Home Screen`.

Safari support for install prompts is more limited than Chrome, but the app is designed to work well when saved to the Home Screen.

## Data behavior

- Active orders are stored in `localStorage`.
- Sent-out orders move into a `completedOrders` list for history and totals logic.

## Notes

- No backend is required.
- No paid services are required.
- If you change the data structure later, you may want to clear browser storage once so old saved data does not conflict.
