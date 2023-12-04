# Confab ( Let's see what do we have on a website)

(Work In Progress)

A tool that will take site URL and gather the following about it , which can be used for planning - Total number of Pages based on Sitemap - Pages included / excluded from robots - CDN being used - TTLs for different asset types - Multi Lingual / Multi Region sites and their site page numbers - Project Complexity Score
○ https://wiki.corp.adobe.com/display/WEM/Session+8%3A+Project+complexity - LHS Score of Mobile, Desktop - Breakpoints in use - CMS being used - Google Tag Manager usage
○ Add action to create function to be added to delayed.js - Adobe Launch usage
○ Add action to create function to be added to delayed.js - Cookie Consent ( OneTrust) - Hubspot integration - Vimeo - Youtube - Metadata Fields being used - Cross domain requests - Custom Data layer
○ Window.digitalData
Functional Domain of the website ( Finance, Medical, Retail etc.)

## Environments

- Preview: https://main--confab--kmurugulla.hlx.page/
- Live: https://main--confab--kmurugulla.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/aem-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
