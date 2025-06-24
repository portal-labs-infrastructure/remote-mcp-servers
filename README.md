# Remote MCP Server Registry

A dynamic, community-driven registry of remote Model Context Protocol (MCP) servers. This web application allows users to discover, list, and submit MCP servers.

**Live Site:** https://remote-mcp-servers.com

## Purpose

The Model Context Protocol (MCP) enables applications to securely share contextual information with AI models. As the ecosystem of MCP-enabled services grows, this registry aims to:

- Provide a centralized, discoverable, and up-to-date list of MCP servers.
- Empower the community to contribute and maintain server listings through a user-friendly interface.
- Offer a dynamic API for accessing server information programmatically.

## Features

- **Dynamic Server Listings:** Displays MCP servers fetched from a live database.
- **User Accounts & Submission:** Users can sign up, log in, and submit their own MCP servers for inclusion in the registry (pending review).
- **Server Management Dashboard:** Logged-in users can view and manage their submitted servers.
- **Filtering & Pagination API:** A public API endpoint (`/api/servers`) allows fetching server data with support for filtering by various criteria (category, name/description query, official status, authentication type) and pagination.
- **Server Details:** Shows name, description, category, maintainer, MCP URL, authentication type, and other relevant metadata.

## MCP Server Registry API

### Main Endpoint

**GET** `/api/servers`

Returns a paginated and filterable list of approved MCP servers.

#### Example Usage

- Get default list (page 1, 10 items):  
  `/api/servers`
- Get page 2 with 5 items:  
  `/api/servers?page=2&limit=5`
- Filter by category "AI Agent":  
  `/api/servers?categories=AI%20Agent`
- Filter by multiple categories:  
  `/api/servers?categories=AI%20Agent,Utility`
- Search for "MyServer" in name or description:  
  `/api/servers?q=MyServer`
- Filter by official status:  
  `/api/servers?isOfficial=true`
- Filter by authentication type:  
  `/api/servers?authTypes=OAuth`
- Filter by multiple authentication types:  
  `/api/servers?authTypes=OAuth,APIKey`
- Combine filters:  
  `/api/servers?categories=Utility&q=secure&limit=15&isOfficial=true`

#### Supported Query Parameters

- `page` (number, default: 1): The page number for pagination.
- `limit` (number, default: 10, max: 100): The number of items per page.
- `q` (string): Search query (matches server name and description, case-insensitive).
- `categories` (string, comma-separated): Filter by one or more server categories.
- `authTypes` (string, comma-separated): Filter by one or more authentication types (e.g., "OAuth", "APIKey", "None").
- `dynamicClientRegistration` (boolean: `true` or `false`): Filter by support for dynamic client registration.
- `isOfficial` (boolean: `true` or `false`): Filter by official server status.

**Note:**

- For multi-value filters (`categories`, `authTypes`), provide a comma-separated list (e.g., `categories=AI,Utility`).

#### Response Format

```json
{
  "data": [
    /* array of server objects */
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 10,
    "totalItems": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Get All Categories

**GET** `/api/servers/categories`

Returns a sorted array of all unique categories in the registry.

Example Response:

```json
{ "categories": ["AI Agent", "Utility", "Productivity"] }
```

### Get All Authentication Types

**GET** `/api/servers/auth-types`

Returns a sorted array of all unique authentication types in the registry.

Example Response:

```json
{ "authTypes": ["OAuth", "APIKey", "None"] }
```

### Summary

Use `/api/servers` for paginated, filterable server lists.

Use `/api/servers/categories` and `/api/servers/auth-types` to power dynamic filter UIs.

All endpoints return JSON.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth:** [Supabase](https://supabase.io/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for validation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.io/) project.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/portal-labs-infrastructure/remote-mcp-servers
    cd remote-mcp-servers
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Supabase Environment Variables:**
    - Sign up for a free Supabase account at [supabase.com](https://supabase.com/) and create a new project.
    - In your Supabase project dashboard, go to "Project Settings" > "API".
    - You will need your **Project URL** and the **`anon` public API key**.
    - Create a `.env.local` file in the root of your cloned project.
    - Add your Supabase credentials to `.env.local`:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
      NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
      # For server-side actions that might need elevated privileges (like admin tasks, not typically user submissions if RLS is set up correctly)
      # SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
      ```
    - **Database Schema:** You will need to set up the `discoverable_mcp_servers` table in your Supabase database.
      Use the csv in `seed/output.csv` in the Supabase dashboard to create the table and populate it with the initial data.
    - **Run SQL Scripts:** Add created_at and status columns to the `discoverable_mcp_servers` table. You can run the following SQL in the Supabase SQL editor:
      ```sql
        UPDATE public.discoverable_mcp_servers
        SET created_at = NOW()
        WHERE created_at IS NULL;
      ```
      ```sql
        UPDATE public.discoverable_mcp_servers
        SET status = 'approved'
        WHERE status IS NULL OR status != 'approved';
      ```

### Running Locally

1.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will typically be available at `http://localhost:3000`.

## How to Contribute

We encourage contributions to expand the registry!

1.  **Sign Up / Log In:**
    - Visit the live site and create an account or log in if you already have one.
2.  **Submit Your Server:**
    - Navigate to your dashboard or the "Add New Server" page.
    - Fill out the form with your MCP server's details.
3.  **Review Process:**
    - Submitted servers will typically go into a "pending review" state.
    - Administrators will review submissions for accuracy and appropriateness before approving them to be publicly listed.

For code contributions (bug fixes, new features):

1.  **Fork the repository.**
2.  Create a new branch for your feature or fix.
3.  Make your changes.
4.  Commit your changes and push to your fork.
5.  **Submit a Pull Request** to the `main` branch of the original repository with a clear description of your changes.

## Future Enhancements (Ideas)

- Admin panel for reviewing and managing server submissions.
- User profiles and ability to edit submitted servers.
- Notifications for server submission status changes.
- Advanced search and sorting options on the frontend.
- MCP server to expose the server registry as an MCP server itself.
- Python client to expose the server registry discovery to LLMs.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```

```
