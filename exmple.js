// reachinbox-onebox/
// ├── .env.example
// ├── .gitignore
// ├── docker-compose.yml
// ├── README.md
// ├── package.json
// ├── tsconfig.json
// ├── nodemon.json
// ├── scripts/
// │   ├── start.sh
// │   └── stop.sh
// ├── src/
// │   ├── index.ts                       # App bootstrap (Express + services start)
// │   ├── server/
// │   │   ├── app.ts                     # Express app, middleware, routes registration
// │   │   ├── routes/
// │   │   │   ├── accounts.routes.ts
// │   │   │   ├── emails.routes.ts
// │   │   │   └── rag.routes.ts
// │   │   └── controllers/
// │   │       ├── accounts.controller.ts
// │   │       ├── emails.controller.ts
// │   │       └── rag.controller.ts
// │   ├── config/
// │   │   ├── index.ts                   # config loader from process.env
// │   │   └── logger.ts                  # pino / winston logger setup
// │   ├── imap/
// │   │   ├── imapManager.ts             # Manage multiple IMAP connections & lifecycle
// │   │   ├── imapConnection.ts          # Single account connection (IDLE handling, watchdog)
// │   │   └── parser.ts                  # Parse ENVELOPE/BODYSTRUCTURE -> EmailDocument
// │   ├── persistence/
// │   │   ├── elastic/
// │   │   │   ├── esClient.ts
// │   │   │   ├── indexSetup.ts          # mapping creation
// │   │   │   └── emailsRepository.ts    # index, update, search helpers
// │   │   └── vector/
// │   │       ├── qdrantClient.ts
// │   │       └── vectorsRepository.ts
// │   ├── ai/
// │   │   ├── classifier.ts              # Calls Gemini/LLM for JSON categorization
// │   │   ├── embeddings.ts              # Embedding model wrapper
// │   │   └── rag.ts                     # RAG orchestration (retrieve + generate)
// │   ├── integrations/
// │   │   ├── slack.ts                   # Slack webhook sender
// │   │   └── webhookSite.ts             # generic webhook trigger
// │   ├── utils/
// │   │   ├── htmlToText.ts
// │   │   ├── backoff.ts                 # exponential backoff helper
// │   │   └── id.ts                      # unique id helper
// │   └── types/
// │       └── email.ts                   # EmailDocument interface + DTOs
// ├── frontend/
// │   ├── package.json
// │   ├── vite.config.ts or next.config.js
// │   ├── src/
// │   │   ├── App.tsx
// │   │   ├── index.tsx
// │   │   ├── components/
// │   │   │   ├── EmailList.tsx
// │   │   │   ├── EmailItem.tsx
// │   │   │   ├── Filters.tsx
// │   │   │   └── SuggestReplyModal.tsx
// │   │   └── api/
// │   │       └── apiClient.ts
// │   └── public/
// └── demos/
//     ├── demo-script.md
//     └── demo-recording.mp4 (optional)
