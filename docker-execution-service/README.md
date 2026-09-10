# Docker execution service

This service is the external backend for the existing Practical Hub. It exposes `POST /execute` with `{ "language": "python" | "sql", "code": string }` and returns `{ language, ok, output, error, durationMs, columns?, rows? }`.

The Python path runs user code in a fresh, network-disabled container with CPU, memory, process, timeout, read-only filesystem, dropped capabilities, and no-new-privileges. The SQL path runs one read-only query inside the PostgreSQL container and rolls the transaction back.

Run it with Docker Compose on a Docker-capable host. Point the Supabase Edge Function secret `DOCKER_EXECUTION_URL` at the executor service and use the same value as `DOCKER_EXECUTION_SERVICE_TOKEN` on both sides.
