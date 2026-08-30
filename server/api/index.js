// Explicit Vercel serverless function entry point.
//
// This removes any ambiguity about what Vercel actually runs in production:
// server.js (which calls app.listen()) is only used for local development —
// Vercel's Node.js runtime never executes app.listen()-based bootstrap code.
// Instead, Vercel imports this file (because it lives under api/) and calls
// its default export as a request handler. An Express app is itself a valid
// (req, res) => {} handler, so exporting it directly here is sufficient —
// no extra wrapping is needed.
//
// The actual MongoDB connection is ensured per-request inside app.js's own
// middleware (see src/app.js), not here — this file only wires up the
// entry point itself.

import app from '../src/app.js'

export default app