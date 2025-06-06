# Tools App

A collection of useful office productivity tools built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Available Tools

- **PDF Generator**: Create professional billing and quotation PDFs with customizable templates
  - Generate invoices, quotations, and statements of account
  - Customize company information and document settings
  - Add multiple items with automatic calculations
  - Preview before generating
  - Support for cargo details and job descriptions
  - Automatic text wrapping for long addresses

- **Number to Words**: Convert numerical values into words for official documents and checks
  - Support for Philippine Peso and US Dollars
  - Real-time conversion
  - Maximum value protection
  - Clean and professional output

- **PDF Splitter**: Split PDF documents into multiple files
  - Split by page ranges
  - Preview page ranges
  - Support for large PDFs (up to 200 pages)
  - Multiple output formats

### Coming Soon

- **Document Converter**: Convert documents between different formats (PDF, Word, Excel)
- **Task Tracker**: Organize and track office tasks and projects

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **PDF Generation**: jsPDF
- **PDF Manipulation**: pdf-lib
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
│   │   │   ├── number-to-words/   # Number to Words tool
│   │   │   └── pdf-splitter/      # PDF Splitter tool
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── pdf-generator/  # PDF Generator components
│   │   ├── pdf-splitter/   # PDF Splitter components
│   │   └── number-to-words/ # Number to Words components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For more details, see our [Contributing Guide](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Spicy](https://github.com/smic29)

© 2025 Tools App | Created by Spicy
