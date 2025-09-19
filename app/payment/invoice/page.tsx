"use client"

import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/layout/protected-route"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { Download, PrinterIcon as Print, ArrowLeft } from "lucide-react"

export default function InvoicePage() {
  const router = useRouter()
  const { user } = useAuth()

  const invoiceData = {
    invoiceNumber: "INV-2024-001",
    date: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    plan: "Pro Plan",
    amount: 49.0,
    tax: 4.41,
    total: 53.41,
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const content = `
LEGALWISE INVOICE

Invoice #: ${invoiceData.invoiceNumber}
Date: ${invoiceData.date}
Due Date: ${invoiceData.dueDate}

Bill To:
${user?.name}
${user?.email}

Description: ${invoiceData.plan}
Amount: $${invoiceData.amount.toFixed(2)}
Tax: $${invoiceData.tax.toFixed(2)}
Total: $${invoiceData.total.toFixed(2)}

Thank you for your business!
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-${invoiceData.invoiceNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between print:hidden">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrint}>
                <Print className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <Card className="print:shadow-none print:border-none">
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">LW</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900">LegalWise</span>
                  </div>
                  <p className="text-gray-600">Professional Legal Platform</p>
                  <p className="text-gray-600">123 Legal Street, Law City, LC 12345</p>
                </div>
                <div className="text-right">
                  <CardTitle className="text-2xl mb-2">INVOICE</CardTitle>
                  <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <div className="text-gray-600">
                    <p className="font-medium">{user?.name}</p>
                    <p>{user?.email}</p>
                    <p className="capitalize">{user?.role} Account</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Date:</span>
                      <span>{invoiceData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span>{invoiceData.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-green-600 font-medium">Paid</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Description</th>
                      <th className="text-right p-4 font-medium text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{invoiceData.plan}</p>
                          <p className="text-sm text-gray-600">Monthly subscription</p>
                        </div>
                      </td>
                      <td className="p-4 text-right">${invoiceData.amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${invoiceData.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (9%):</span>
                      <span>${invoiceData.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${invoiceData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t text-center text-gray-600">
                <p className="mb-2">Thank you for your business!</p>
                <p className="text-sm">For questions about this invoice, please contact support@legalwise.com</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
