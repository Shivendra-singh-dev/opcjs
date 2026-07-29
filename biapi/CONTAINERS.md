# Lightweight local database

This project now runs the API and a persistent MySQL database with Compose. MySQL creates `opc_db` on its first start. When the API starts, `db.js` creates the `users` and `contacts` tables and safely adds its known user columns to existing installations.

## Recommended on Windows without Docker Desktop

Use the Podman CLI with its WSL-backed machine. It does not require Docker Desktop or its always-running desktop app. Install Podman from its official Windows installer, then run once:

```powershell
podman machine init
podman machine start
```

From this folder, create your private settings and start the stack:

```powershell
Copy-Item .env.docker.example .env.docker
podman compose --env-file .env.docker up -d --build
```

If you already have a Docker-compatible engine, use the equivalent command:

```powershell
docker compose --env-file .env.docker up -d --build
```

API: `http://localhost:5000`  
Logs: `podman compose logs -f api`  
Stop: `podman compose down`  
Stop and remove database data: `podman compose down -v`

The named `mysql_data` volume keeps the database when the stack is stopped or updated. Do not use `down -v` unless you intentionally want a new empty database.
