# Key Club Website

This is the website for the Henry M. Jackson High School Key Club. Key Club is an international student-led volunteering organization, and this is the website for the chapter at the Henry M. Jackson High School. Its purpose is to highlight our club and be helpful to our members and officers via various tools featured on the website.

## The Stack

- Sveltekit is used for the frontend and API. I'm using the Vercel adapter as this project is hosted on Vercel. This project also uses the experimental remote functions for safety and simplicity.
- Supabase is used for the database. There are two instances: one for development and one for production.
Review the sync and the pushing updates sections below.
- Supabase Auth is used for authentication. I wanted to go for the simplest solution and the smallest stack, so that's why I'm using Supabase Auth over something like Auth.js or BetterAuth or whatever.
- Vercel is used for hosting. It's a serverless platform and it's not blocked on school wifi, which is one of the main reasons.

## Sync

There are two sync endpoints, `/api/members/sync` and `/api/events/sync`.
They're public and not rate limited right now, but I'll add rate limiting and API-key based authentication in the future.
They will be called using Vercel or Github actions (since this is stateless).

Supabase should be the source of truth for the database schema. 
Run the following command to generate the schema types for the codebase:
```sh
npx supabase gen types typescript --linked > ./src/lib/db/schema.ts
```

## Pushing Updates

To push updates to the server, simply commit your changes and push to any branch and then create a pull request to merge into `master`.
Vercel will automatically deploy the changes and update the website to the latest commit if it has no build errors.

## Error Handling and Returning Data

I'm using Go-style error handling for this with the `Result` type.
Essentially, all functions must return a `Result`, for simpler and more detailed error handling.
But, the API endpoints must return `toResponse(result)` instead.
The `toResponse()` function turns a `Result` object into a `Response` object.

## Rotating Google API Credentials

The Google Service Account credentials are stored in the `google_key.json` file, once you get a new json credentials file, rename it to `google_key.json` and replace the old one.
Also, run 
```sh
cat google_key.json | base64
```
and copy and paste that into the `GOOGLE_KEY_BASE64` environment variable in the .env file.
