# Create GraphQL Starter Kit

A production-ready GraphQL backend starter kit built with **Node.js**.

Quickly scaffold a GraphQL API with a clean project structure, database integration, services, resolvers, queries, mutations, and TypeScript-friendly Prisma configuration.

## Features

* Express.js backend
* Apollo GraphQL Server
* Prisma ORM
* PostgreSQL support
* GraphQL queries and mutations
* Resolver/service separation
* User module included as an example
* Clean and scalable project structure
* Ready to extend with authentication, validation, and more

## Create a Project

Using npm:

```bash
npx create-graphql-starter-kit
```

Using pnpm:

```bash
pnpm create graphql-starter-kit
```

## Project Structure

```text
.
├── prisma/ (if installed)
│   └── schema.prisma
├── src/
│   ├── graphql/
│   │   ├── index.js
│   │   └── user/
│   │       ├── index.js
│   │       ├── mutations.js
│   │       ├── queries.js
│   │       ├── resolvers.js
│   │       └── typedefs.js
│   ├── lib/
│   │   ├── prisma.js
│   │   └── mongoose.js
│   ├── services/
│   │   └── user.js
│   └── index.js
├── prisma.config.ts
├── package.json
└── pnpm-lock.yaml
```

## GraphQL Structure

Each feature can be organized into its own GraphQL module:

```text
graphql/
└── user/
    ├── typedefs.js
    ├── queries.js
    ├── mutations.js
    └── resolvers.js
```

This keeps your schema definitions, queries, mutations, and resolvers separated and makes it easier to add new modules as your application grows.

## Services

Business logic is separated from GraphQL resolvers:

```text
services/
└── user.js
```

Resolvers call the service layer instead of putting business logic directly inside GraphQL resolvers.

## Database

The starter kit uses **Prisma** as the ORM and PostgreSQL as the default database.

Configure your database connection using your environment variables, then run:

```bash
pnpm prisma generate
```

For development migrations:

```bash
pnpm prisma migrate dev
```

## Running the Project

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

## Extending the Starter

You can add additional GraphQL modules following the same structure:

```text
graphql/
├── user/
├── product/
├── auth/
└── order/
```

Each module can contain its own:

* Type definitions
* Queries
* Mutations
* Resolvers
* Services

## Tech Stack

* **Node.js**
* **Express.js**
* **GraphQL**
* **Apollo Server**
* **Prisma**
* **PostgreSQL**

## npm

Package: `create-graphql-starter-kit`

Run it directly with:

```bash
npx create-graphql-starter-kit@latest
```

## License

MIT
