# GitHub OAuth example in SvelteKit

1. [Original Repo](https://lucia-auth.com/tutorials/github-oauth/sveltekit) used SQLite.
2. We will be using Azure SQL Server with [Prisma ORM](https://www.prisma.io/docs/getting-started/quickstart-sqlite).
3. Rate limiting is implemented using JavaScript `Map`.

## Initialize project

1. Created WonderTax Labs a GitHub OAuth app named [WonderTax Labs OAuth](https://github.com/organizations/WonderTaxLabs/settings/applications/2768870) with the redirect URI pointed to `http://localhost:5173/login/github/callback`.

```bash
http://localhost:5173/login/github/callback
```

Pasted the client ID and secret into our `.env` file.

```bash
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET="
```

2. Install from naked cloned repo

```bash
npm npm install
```

3. see if it runs?

```bash
npm run dev
```

4. Server started on port 5174.

- updated GitHub OAuth app [WonderTax Labs OAuth](https://github.com/organizations/WonderTaxLabs/settings/applications/2768870) redirect to updated port 5174
- launch complained baout missing favicon. Created [static/favicon.png](static/favicon.png)
- Server presented a page with a Signin in via GitHub link
- followed link and was presented with an OAuth permission requet from GitHub!
- Holy S**t it worked out of the box!
- Server/terminal error "SqliteError: no such table: user" which makes sense - we're not using SQLite.

5. Repo instructions said to "Create `sqlite.db` and run `setup.sql`." We'll be skipping this because we are going to use Azure SQL

6. Setup new Azure SQL Database `msbuxley.database.windows.net`

<img alt="Miss Buxley" src="miss-buxley.png"/>

7. Created [T-SQL setup file](./setup-t-sql.sql)

8. Repo instructions want us to run: `sqlite3 sqlite.db` but we are not using SQLite. Now begins the implemention of [Prisma ORM](https://www.prisma.io/docs/getting-started/quickstart-sqlite) to connect to Azure SQL database `msbuxley.database.windows.net` :alien:

9. Quick deview of package.json seems to indicate this project is using `svelte ^4.2.7`

10. running `npx sv migrate svelte-5` now

## Notes

- TODO: Update redirect URI
