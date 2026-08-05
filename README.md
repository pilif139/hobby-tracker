---
title: Hobby Tracker
description: A cross-platform application for tracking hobbies across web and Android.
tech:
  - React
  - TypeScript
  - Vitest
  - Hono
  - Bun
  - Android Studio
  - Cloudflare Workers
  - Java
links:
  - label: GitHub
    href: https://github.com/pilif139/hobby-tracker
---

## About this project

Hobby Tracker is a cross-platform application made up of a React web app, a native Android app written in Java, and a TypeScript backend running on Cloudflare Workers. I started this project mainly to learn how to design a larger application that spans multiple platforms while experimenting with Cloudflare's ecosystem.

The idea is pretty simple - imagine a mix of Twitter and a habit tracker, but focused entirely on hobbies.

## About Frontend

The frontend is built with React and the TanStack ecosystem. I used TanStack Router for routing and TanStack Query for handling server state, while Tailwind CSS takes care of the styling.

One of my goals was to make the application feel responsive and easy to extend as new features are added. I also spent some time writing tests with Vitest and React Testing Library to get more comfortable with frontend testing.

### Frontend stack

- React
- TypeScript
- TanStack Router
- TanStack Query
- Tailwind CSS
- Vitest
- React Testing Library

## About Backend

The backend is built with Hono and runs on Cloudflare Workers. Data is stored in Cloudflare D1 using Prisma ORM, which gave me a chance to learn how Prisma works outside of a traditional Node.js environment.

This project was also my playground for learning Cloudflare's developer platform. Besides Workers, I experimented with services like D1 and KV, since these are technologies I'd like to keep using in future projects.

I decided to build the auth system from scratch as a way to sharpen my security skills and understand how modern apps handle authentication. I ended up building a system that uses short-lived access tokens paired with long-lived refresh tokens, using JWTs stored in cookies with session state managed via Cloudflare KV for fast lookups.

### Backend stack

- Hono
- Bun
- TypeScript
- Prisma ORM
- Cloudflare D1
- Cloudflare Workers
- Cloudflare KV
- Vitest

## About Mobile App

The mobile app is being developed in Android Studio using Java. I intentionally chose Java instead of Kotlin because I wanted more practice for my vocational programming exams.

The goal isn't to build a completely different experience from the web app, but to provide the same core features in a native Android application.

### Mobile stack

- Java
- Android Studio

## Project Idea

The app is built around sharing hobbies and tracking the time you spend on them.

Users can:

- create hobbies that anyone can discover
- add hobbies created by other users to their own profile
- start hobby sessions to track how much time they spend on an activity
- attach notes, thoughts or photos to each session
- add friends
- see their friends' activity in a social feed, similar to Twitter or Facebook

## What I Learned

This has been my biggest side project so far and my first project that targets web, backend and mobile at the same time.

Working on it helped me learn:

- how to structure a larger full-stack application
- how to share APIs between multiple clients
- how to use the TanStack ecosystem in a real project
- how to build APIs with Hono
- how Cloudflare Workers, D1 and KV fit together
- how to write tests for both frontend and backend code
- how to organize a project using pnpm, ESLint and Prettier
- what it's like to work on a group project, split work between teammates and collaborate using Git
