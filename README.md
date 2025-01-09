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
## Running a server test
- Install json-server
```
npm install -g json-server
# or, if you prefer local installation
npm install json-server --save-dev
```

- Start json server
```
json-server --watch public/db.json --port 8000
```