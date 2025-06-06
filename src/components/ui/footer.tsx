import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-auto print:hidden">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <Link 
              href="/contact" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
            <a 
              href="https://github.com/smic29" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Tools App | Created by{" "}
            <a 
              href="https://github.com/smic29" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Spicy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
} 