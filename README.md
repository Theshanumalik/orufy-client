# Orufy Client

Frontend application for Orufy, built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* React Query
* React Hook Form
* Zod
* Axios

## Prerequisites

Make sure the following are installed on your machine:

* Node.js (v20 or later)
* pnpm

## Installation

Clone the repository:

```bash
git clone https://github.com/Theshanumalik/orufy-client.git
```

Navigate to the project directory:

```bash
cd client
```

Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_URL=http://localhost:3000/api
```

Replace the value with your backend API URL when deploying.

## Running Locally

Start the development server:

```bash
pnpm dev
```

The application will be available at:

```txt
http://localhost:5173
```

## Building for Production

```bash
pnpm build
```

The production build will be generated inside the `dist` directory.

## Preview Production Build

```bash
pnpm preview
```

## Features

* OTP-based Authentication
* Product Management Dashboard
* Create Products
* Edit Products
* Delete Products
* Publish / Unpublish Products
* Product Image Uploads
* Product Filtering
* Protected Routes
* Form Validation with Zod
* API State Management using React Query

## Project Structure

```txt
src
├── components
├── context
├── hooks
├── lib
├── pages
├── schema
├── assets
└── main.tsx
```

## Scripts

```bash
pnpm dev
```

Runs the development server.

```bash
pnpm build
```

Creates a production build.

```bash
pnpm preview
```

Previews the production build locally.

```bash
pnpm lint
```

Runs ESLint.
