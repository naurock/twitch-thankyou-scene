# Stream Danke

A minimalist OBS ending scene that thanks new followers and incoming raiders from the current stream. Includes paginated credits, raid viewer counts, a general thank-you page, and a charcoal/orange design.

## Setup

Requires **OBS Studio**, **streamer.bot**, and a connected **Twitch broadcaster account**. An **Elgato Stream Deck** is optional. No Twitch Affiliate features are required.

Extract the package into `Documents\Stream-Danke`, configure the four included C# actions, and add `overlay.html` as a 1920 × 1080 OBS Browser Source. Events are collected locally throughout the session. Earlier or missed events are not backfilled.

- **English:** [Read first](READ-FIRST-EN.md) · [Setup guide](GUIDE-EN.md)
- **Deutsch:** [Zuerst lesen](ZUERST-LESEN-DE.md) · [Anleitung](ANLEITUNG-DE.md)
- **Preview:** [Vorschau.html](Vorschau.html) — fictional sample data

The overlay text remains in German. Test your local setup before going live.

## License

Original code and documentation: [MIT](LICENSE). The personal channel logo (`logo.png`) is excluded; replace it for other channels and remove it before public redistribution unless separately authorized. See [NOTICE.txt](NOTICE.txt) and the guides for license scope, disclaimers, and data handling.
