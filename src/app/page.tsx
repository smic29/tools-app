import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const tools = [
    {
      title: "PDF Generator",
      description: "Create professional billing and quotation PDFs with customizable templates",
      status: "Available",
      href: "/tools/pdf-generator",
    },
    {
      title: "Number to Words",
      description: "Convert numerical values into words for official documents and checks",
      status: "Available",
      href: "/tools/number-to-words",
    },
    {
      title: "Document Converter",
      description: "Convert documents between different formats (PDF, Word, Excel)",
      status: "Coming Soon",
      href: "#",
    },
    {
      title: "Task Tracker",
      description: "Organize and track office tasks and projects",
      status: "Coming Soon",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Office Tools Hub</h1>
          <p className="text-muted-foreground mt-2">
            Your all-in-one solution for office productivity tools
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${tool.status === "Available" ? "text-green-600" : "text-muted-foreground"}`}>
                    {tool.status}
                  </span>
                  {tool.status === "Available" ? (
                    <Link href={tool.href}>
                      <Button variant="default">Launch</Button>
                    </Link>
                  ) : (
                    <Button variant="outline" disabled>
                      Launch
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
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
      </footer>
    </div>
  );
}
