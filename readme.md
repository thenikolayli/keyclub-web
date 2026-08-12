# Key Club Website

This is the website for the Henry M. Jackson High School Key Club. Key Club is an international student-led volunteering organization, and this is the website for the chapter at the Henry M. Jackson High School. Its purpose is to highlight our club and be helpful to our members and officers via various tools featured on the website.

## My Role

I served as the Webmaster for my high school’s Key Club and led this project end-to-end from March 2025 to March 2026 (one officer term). I was responsible for system design, implementation, deployment, and maintenance. During the design phase, I collaborated with the club’s Editors to align the site’s visual design with the club’s identity, while independently making architectural and infrastructure decisions.

## The Stack

- Frontend - SvelteKit for the frontend and used the Node adapter, taking the Server Side Rendering approach instead of the Single Page App approach to improve SEO.
- Backend - SQLite for persistence due to its simplicity, low overhead, and suitability for the project’s scale.
- API - FastAPI for its performance, simplicity, and explicit control over request handling and authentication logic.
- Hosting - Self-hosted on a Linux home server using Docker Compose, with NGINX as a reverse proxy and Certbot for TLS.
- Auth - Implemented JWT-based auth with refresh token rotation; later began migrating toward session-based auth before the club transitioned to a third-party management system.

## Sync

```sh
npx supabase gen types typescript --linked > ./src/lib/db/schema.ts
```

## Auth Flow

1. `hooks.server.ts` loads the user profile and saves it to locals.
2. root `+layout.server.ts` pushes the cookies and profile down to the client files.
3. root `+layout.ts` creates the right supabase client for the request and pushes it.
4. You can now access cookies, profiles, supabase, and claims via `$props()`.

## Error Handling

I'm using Go-style error handling for this in the form of the `Result` type.
Essentially, all functions must return a `Result`, for simpler and more detailed error handling.
But, the API endpoints must return `toResponse(result)` instead.
The `toResponse()` function turns a `Result` object into a `Response` object.
