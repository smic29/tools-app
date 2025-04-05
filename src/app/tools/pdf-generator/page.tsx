import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function PDFGenerator() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">PDF Generator</h1>
              <p className="text-muted-foreground mt-2">
                Create professional billing and quotation PDFs
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
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Billing/Quotation Form</CardTitle>
            <CardDescription>
              Fill in the details below to generate your PDF document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Enter company name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Company Address</Label>
                    <Input id="company-address" placeholder="Enter company address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone Number</Label>
                    <Input id="company-phone" placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input id="company-email" type="email" placeholder="Enter email address" />
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name</Label>
                    <Input id="client-name" placeholder="Enter client name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-address">Client Address</Label>
                    <Input id="client-address" placeholder="Enter client address" />
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Document Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="document-type">Document Type</Label>
                    <select id="document-type" className="w-full rounded-md border border-input bg-background px-3 py-2">
                      <option value="invoice">Invoice</option>
                      <option value="quotation">Quotation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document-number">Document Number</Label>
                    <Input id="document-number" placeholder="Enter document number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document-date">Date</Label>
                    <Input id="document-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Items</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-description">Description</Label>
                      <Input id="item-description" placeholder="Item description" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-quantity">Quantity</Label>
                      <Input id="item-quantity" type="number" placeholder="Qty" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-price">Unit Price</Label>
                      <Input id="item-price" type="number" placeholder="Price" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-total">Total</Label>
                      <Input id="item-total" type="number" placeholder="Total" disabled />
                    </div>
                  </div>
                  <Button type="button" variant="outline" className="w-full">
                    Add Another Item
                  </Button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Enter any additional notes" rows={4} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto">
                  Generate PDF
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