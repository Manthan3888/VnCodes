This is a [Next.js](https://nextjs.org) project with a Node.js/Express backend and MongoDB.  
Frontend lives in **Client** and backend in **Server**.

## Full-Stack Setup

1. **Backend (API)**  
   - In `Server/`: copy `Server/.env.example` to `Server/.env`, set `MONGO_URI`, `JWT_SECRET`, `JWT_ADMIN_SECRET`, `FRONTEND_URL`.  
   - Run MongoDB, then: `cd Server && npm install && npm run dev` (API on port 5000).

2. **Frontend**  
   - In `Client/`: copy `Client/.env.example` to `Client/.env` and set `NEXT_PUBLIC_API_URL=http://localhost:5000`.  
   - Run: `cd Client && npm install && npm run dev` (app on port 3000).

3. **Default admin**  
   - Set in `Server/.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD`. First run creates this admin if none exist.

See `Server/README.md` for API details.

## Getting Started (Frontend only)

From the **Client** folder:

```bash
cd Client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

You can start editing the page by modifying `Client/app/page.tsx`. The page auto-updates as you edit the file.

## Project structure

- **Client/** – Next.js app (app/, lib/, public/, config files)
- **Server/** – Express API (routes, controllers, models, middleware)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
