# Electric Shape Explorer

A web interface for exploring Shape queries to your Electric server. This tool provides a simple way to query Electric and visualize the results.

<img width="835" alt="Image" src="https://github.com/user-attachments/assets/dd59fb1b-a212-46c1-a1d1-e2ae3dcc3cc1" />

## Features

- **Simple Query Interface**: Enter table names and WHERE clauses to query your data
- **Real-time Results**: See your query results instantly
- **Keyboard Shortcuts**: Submit queries quickly with Cmd/Ctrl + Enter
- **Shareable URLs**: Share queries easily with URL-based state

## Use with Electric Cloud

Copy `.env.sample` to `.env` and then add your `SOURCE_ID` and `SOURCE_SECRET`.

## Why Electric SQL?

Electric SQL syncs subsets of your Postgres data into local apps and services, making manual data fetching obsolete. Here's what it solves:

### State Transfer
- Replaces APIs and data fetching with data sync
- Simplifies your code
- Eliminates loading spinners

### Cache Invalidation
- Replaces TTLs and expiry policies with realtime sync
- Automated invalidation
- No more stale data

### Scaling
- Takes query workload off your database
- Reduces compute workload on your cloud
- Lowers cloud bills

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to start exploring your Electric database

## Using Shape Explorer

1. Enter a table name in the "Table Name" field
2. Optionally add a WHERE clause to filter results
3. Click "Query" or press Cmd/Ctrl + Enter to execute
4. View results in the table below

## Environment Variables

- `ELECTRIC_URL`: Your Electric SQL service URL
- `ELECTRIC_SOURCE_SECRET`: Your Electric source secret
- `ELECTRIC_SOURCE_ID`: Your Electric source ID

## Learn More

- [Electric SQL Documentation](https://electric-sql.com/docs)
- [Shape API Reference](https://electric-sql.com/docs/api/shape)
