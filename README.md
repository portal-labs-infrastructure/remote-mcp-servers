# Remote MCP Server Registry

A public, community-maintained registry of remote Model Context Protocol (MCP) servers. This web application displays a list of known MCP servers.

**Live Site:** https://remote-mcp-servers.com

**Registry JSON:** https://remote-mcp-servers.com/mcp-servers.json

## Purpose

The Model Context Protocol (MCP) enables applications to securely share contextual information with AI models. As the ecosystem of MCP-enabled services grows, this registry aims to:

- Provide a centralized, discoverable list of MCP servers that are hosted online and **DO NOT** require a local server.
- Encourage community contributions to keep the list up-to-date.

## Features

- **Displays MCP Servers:** Lists servers from a community-maintained JSON file.
- **Server Details:** Shows name, description, category, maintainer, MCP URL, and authentication types.
- **Contribution Link:** Easy link to the GitHub repository for contributing server information.

## Tech Stack

- **Framework:** [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [MUI Joy](https://mui.com/joy-ui/getting-started/)
- **Icons:** [Material Icons](https://mui.com/material-ui/material-icons/) (via MUI)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/portal-labs-infrastructure/remote-mcp-server-registry
    cd remote-mcp-server-registry
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running Locally

1.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will typically be available at `http://localhost:5173` (or another port if 5173 is busy).

## How to Contribute

Contributions to the MCP server list are highly welcome!

1.  **Fork and Edit:**
    - The primary list of servers is maintained in the `mcp-servers.json` file within the GitHub repository.
    - Fork this repository.
    - Edit the `mcp-servers.json` file in your fork to add new servers or update existing ones. Please ensure your additions conform to the existing schema.
2.  **Submit a Pull Request:**
    - Create a Pull Request from your fork back to the main repository's `main` branch.
    - Provide a clear description of your changes.

Your contributions help keep this registry accurate and valuable for the community!

## Future Enhancements (Ideas)

- More advanced filtering and sorting of servers.
- Schema validation for `mcp-servers.json` submissions (e.g., via GitHub Actions).

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
