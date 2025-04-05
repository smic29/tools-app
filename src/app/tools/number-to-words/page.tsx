import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function NumberToWords() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Number to Words</h1>
              <p className="text-muted-foreground mt-2">
                Convert numerical values into words for official documents and checks
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Tools
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Number to Words Converter</CardTitle>
            <CardDescription>
              Enter a number to convert it to words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Number</Label>
                  <Input 
                    id="number" 
                    type="number" 
                    placeholder="Enter a number (e.g., 1234.56)" 
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <div className="p-3 border rounded-md bg-muted min-h-[60px]">
                    <p id="result" className="text-foreground">
                      {/* Result will be displayed here */}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  Convert
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
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