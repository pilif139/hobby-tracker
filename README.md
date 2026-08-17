---
title: Hobby Tracker
description: A cross-platform application for tracking hobbies across web and Android.
tech:
  - React
  - TypeScript
  - Hono
  - Bun
  - Java
  - Cloudflare Workers
  - Cloudflare D1
  - Cloudflare KV
  - Prisma
  - TanStack Router
  - TanStack Query
  - Tailwind CSS
  - Android Studio
  - Vitest
  - React Testing Library
links:
  - label: GitHub
    href: https://github.com/pilif139/hobby-tracker
---

## About this project

Hobby Tracker is a cross-platform application made up of a React web app, a native Android app written in Java, and a TypeScript backend running on Cloudflare Workers. I started this project to learn how to design a larger application that spans multiple platforms, while experimenting with Cloudflare's ecosystem.

The idea is simple: imagine a mix of Twitter and a habit tracker, but focused entirely on hobbies. Users can:

- create hobbies that anyone can discover
- add hobbies created by other users to their own profile
- start hobby sessions to track how much time they spend on an activity
- attach notes, thoughts or photos to each session
- add friends
- see their friends' activity in a social feed, similar to Twitter or Facebook

## About the frontend

The frontend is built with React and the TanStack ecosystem: TanStack Router for routing and TanStack Query for server state, with Tailwind CSS handling styling.

One of my goals was to make the application feel responsive and easy to extend as new features are added. I also wrote tests with Vitest and React Testing Library to get more comfortable with frontend testing.

## About the backend

The backend runs on Hono and Cloudflare Workers. Data is stored in Cloudflare D1 using Prisma ORM, which gave me a chance to learn how Prisma works outside a traditional Node.js environment. Alongside D1, I used Cloudflare KV for fast session lookups — both are technologies I'd like to keep using in future projects.

Auth is built from scratch as a way to sharpen my security skills and understand how modern apps handle authentication. The system uses short-lived access tokens with long-lived refresh tokens, both stored as JWTs in cookies. Session state is cached in Cloudflare KV for fast lookups.

## About the mobile app

The mobile app is built in Android Studio using Java. I intentionally chose Java instead of Kotlin for more practice ahead of my vocational programming exams.

The goal isn't to build a different experience from the web app, but to provide the same core features in a native Android application.

## What I learned

This has been my biggest side project so far, and my first that targets web, backend and mobile at the same time.

Working on it helped me learn:

- how to structure a larger full-stack application
- how to share APIs between multiple clients
- how to use the TanStack ecosystem in a real project
- how to build APIs with Hono
- how Cloudflare Workers, D1 and KV fit together
- how to write tests for both frontend and backend code
- how to organize a project using pnpm, ESLint and Prettier
- what it's like to work on a group project, split work between teammates and collaborate using Git
