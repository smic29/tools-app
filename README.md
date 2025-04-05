# Tools App

A collection of useful office productivity tools built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Available Tools

- **PDF Generator**: Create professional billing and quotation PDFs with customizable templates
- **Number to Words**: Convert numerical values into words for official documents and checks

### Coming Soon

- **Document Converter**: Convert documents between different formats (PDF, Word, Excel)
- **Task Tracker**: Organize and track office tasks and projects

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/smic29/tools-app.git
   cd tools-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
tools-app/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router
│   │   ├── tools/       # Tool pages
│   │   │   ├── pdf-generator/     # PDF Generator tool
│   │   │   └── number-to-words/   # Number to Words tool
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable components
│   │   └── ui/          # shadcn/ui components
│   └── lib/             # Utility functions
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created by [Spicy](https://github.com/smic29)

© 2025 Tools App | Created by Spicy
