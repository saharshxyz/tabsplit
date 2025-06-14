# TabSplit

> A privacy-focused bill splitting utility that performs all calculations client-side and uses URL hash for state sharing.

[![Live Site](https://img.shields.io/badge/Live%20Site-tabsplit.xyz-blue)](https://tabsplit.xyz)

## Overview

TabSplit helps you split bills and shared expenses with ease. It performs all calculations in your browser and uses the URL hash to store and share state, eliminating the need for a database and ensuring complete privacy. The application supports both manual data entry and automated receipt processing using OpenAI's API.

## Features

- 🧾 **Manual & Automated Entry** - Input bill details manually or upload a receipt image for automatic data extraction
- 🔒 **Privacy First** - No user or bill data stored on servers, entirely stateless operation
- 🧮 **Client-Side Calculations** - All splitting logic, including tax and tip, executed in-browser
- 🔗 **Secure Sharing** - Split details encoded into self-contained URLs for easy sharing
- 💅 **Modern UI** - Responsive interface built with Next.js, React, and shadcn/ui
- 📊 **Visual Breakdown** - Split details presented in both tabular and chart formats

## Tech Stack

- **Framework:** Next.js / React
- **UI Components:** shadcn/ui, Tailwind CSS
- **State Management:** React Hook Form, URL hash-based state
- **Validation:** Zod

## Architecture

### Client-Centric Design

The application operates entirely client-side with all calculations, data manipulation, and state management happening in the user's browser. This ensures no sensitive information is ever transmitted to or stored on a server.

### Stateless Data Handling

Instead of a traditional database, the application state is serialized and stored in the URL's hash fragment:

1. User inputs data in the TabForm
2. Form state (TabSchema) is serialized to a query string
3. String is appended to the URL hash (/split#...)
4. On page load, useHash hook parses and validates the hash data

### API Routes

Two serverless API routes support optional features:

- `/api/processReceiptUpload` - Handles receipt scanning via OpenAI API
- `/api/og` - Generates dynamic social media preview images

## Getting Started

### Prerequisites

- Node.js
- npm (or yarn/pnpm)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/saharshxyz/tabsplit
   cd tabsplit
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   # Create .env.local and add:
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start development server
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

### Testing

Run the test suite:
```bash
npm test
```  