# Contributing to n8n-nodes-insim

Thanks for your interest in contributing! This guide will help you get set up.

## Development Setup

### Prerequisites

- Node.js 18+
- An inSIM account with API access ([insim.app](https://www.insim.app))
- n8n installed locally (`npx n8n`)

### Install from source

```bash
git clone https://github.com/ReachTechnologies/n8n-nodes-insim.git
cd n8n-nodes-insim
npm install
npm run build
```

### Run locally with n8n

```bash
npm run dev
```

This starts n8n with the node loaded and hot reload enabled.

## Adding a New Resource or Operation

This node uses n8n's **declarative style**. Each resource is defined in `nodes/Insim/resources/<resource>/index.ts`.

1. Create a new directory under `nodes/Insim/resources/<resource>/`
2. Define the resource with operations following the existing pattern
3. Register it in `nodes/Insim/Insim.node.ts`
4. All API calls use the shared `preSend` hook in `nodes/Insim/shared/preSend.ts`

### Key conventions

- All inSIM API endpoints are POST-only
- Auth credentials (login + accessKey) are injected via `preSend.ts`
- Empty parameters are filtered automatically
- Use `routing.send.preSend` to hook into request preparation

## Code Style

- TypeScript strict mode
- Use declarative style (JSON-based operation definitions)
- Run `npm run lint` before submitting

## Pull Request Process

1. Fork the repo and create a feature branch
2. Make your changes and build (`npm run build`)
3. Test with a local n8n instance
4. Submit a PR with a clear description

## Reporting Issues

Open an issue at [github.com/ReachTechnologies/n8n-nodes-insim/issues](https://github.com/ReachTechnologies/n8n-nodes-insim/issues).

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
