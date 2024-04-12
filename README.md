## InfogrAIphify: Create Infographics from Articles

This repository contains the code for InfogrAIphify, a web application that automatically generates infographics from article URLs, a version of the [Python script](https://github.com/phalkmin/InfogrAIphify) that uses FREE LLMs AND a submission for the [Cloudflare AI Challenge](https://dev.to/devteam/join-us-for-the-cloudflare-ai-challenge-3000-in-prizes-5f99).

Layout and code is a [Next.js](https://nextjs.org/) project bootstrapped with [`c3`](https://developers.cloudflare.com/pages/get-started/c3).

**Features:**

- Analyze website content and extract key points.
- Generate a visually appealing infographic.
- User-friendly interface for easy input and interaction.

## Demo

Demo can be [seen here](https://infograiphify-nodejs-edition.pages.dev/)

## Getting Started

To run InfogrAIphify locally, follow these steps:

1. **Clone the repository:**

   ```bash
     git clone https://github.com/phalkmin/InfogrAIphify-nodejs-edition/
    ```

2. **Install dependencies:**

  ```
    cd infogrAIphify
    npm install
  ```
3. **Create a CF Worker**

Get the file from WF folder, copy and paste on the worker you created

3. **Create a .env file**

  ```
  NEXT_PUBLIC_CF_WORKER=<WORKER URL YOU CREATED>
  ```

3. **Start the development server:**

npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cloudflare integration

Besides the `dev` script mentioned above `c3` has added a few extra scripts that allow you to integrate the application with the [Cloudflare Pages](https://pages.cloudflare.com/) environment, these are:
  - `pages:build` to build the application for Pages using the [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI
  - `preview` to locally preview your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
  - `deploy` to deploy your Pages application using the [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI

> __Note:__ while the `dev` script is optimal for local development you should preview your Pages application as well (periodically or before deployments) in order to make sure that it can properly work in the Pages environment (for more details see the [`@cloudflare/next-on-pages` recommended workflow](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md#recommended-workflow))


When deploying to CloudFlare Pages, remember to create the variable NEXT_PUBLIC_CF_WORKER before the first build
