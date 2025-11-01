import jsPDF from "jspdf";

// ===== Interfaces =====
export interface Quotation {
  id: string;
  customerId: string;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  status: string;
  quoteNumber?: string;
  expirationDate?: string;
  preparedBy?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
}

export interface QuotationItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  customTitle?: string;
  customPhoto?: string;
}

export interface Customer {
  id: string;
  name: string;
  company?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone: string;
  email?: string;
}

export interface Product {
  id: string;
  title: string;
}

// ===== Public API =====
export async function generateQuotationPDF(
  quotation: Quotation,
  customer: Customer | undefined,
  products: Product[] | undefined
) {
  const blob = await generatePDFBlob(quotation, customer, products);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quotation-${quotation.quoteNumber || quotation.id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

// ===== PDF Generator =====
export function generatePDFBlob(
  quotation: Quotation,
  customer: Customer | undefined,
  products: Product[] | undefined
): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 20;

    // ---- Background Header Section - Light Beige ----
    doc.setFillColor(240, 235, 230);
    doc.rect(0, 0, pageWidth, 60, "F");

    // ---- Header Section ----
    // Company Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(48);
    doc.setTextColor(80, 80, 80);
    doc.text("Curiouslhues", margin, y + 5);

    // LOGO text (right side)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(80, 80, 80);
    doc.text("LOGO", pageWidth - margin - 25, y + 12);

    y += 22;

    // QUOTATION
    doc.setFont("helvetica", "normal");
    doc.setFontSize(24);
    doc.setTextColor(120, 120, 120);
    doc.text("QUOTATION", margin, y);

    y = 70;

    // ---- BILL TO Section with Light Beige Background ----
    doc.setFillColor(240, 235, 230);
    doc.rect(margin - 5, y - 8, pageWidth - 2 * margin + 10, 38, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("BILL TO:", margin, y);

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    if (customer) {
      doc.text(`Name :- ${customer.name}`, margin, y);
      y += 7;
      doc.text(`Phone No.:- ${customer.phone}`, margin, y);
      y += 7;
      if (customer.email) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Email :- ${customer.email}`, margin, y);
        y += 7;
      }
      const addressParts = [];
      if (customer.addressLine1) addressParts.push(customer.addressLine1);
      if (customer.city) addressParts.push(customer.city);
      if (customer.state) addressParts.push(customer.state);
      if (customer.zip) addressParts.push(customer.zip);

      if (addressParts.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Address:- ${addressParts.join(", ")}`, margin, y);
      }
    } else {
      doc.text("Name :- Pratap Verma", margin, y);
      y += 7;
      doc.text("Phone No.:- 7000041821", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Email :- hello@reallygreatsite.com", margin, y);
      y += 7;
      doc.text("Address:- 123 Anywhere St., Any City, ST 12345", margin, y);
    }

    // Date and Invoice NO on right side of background
    const rightX = pageWidth - margin - 60;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);

    const quoteDate = quotation.createdAt
      ? new Date(quotation.createdAt).toLocaleDateString("en-GB")
      : "15/08/2028";
    doc.text(`Date: ${quoteDate}`, rightX, 78);
    doc.text(`Invoice NO. ${quotation.quoteNumber || "2000-15"}`, rightX, 88);

    y = 125;

    // ---- FROM Section ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text("FROM:", margin, y);

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Wardiere Inc.", margin, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("hello@reallygreatsite.com", margin, y);

    y += 6;
    doc.text("123 Anywhere St., Any City, ST 12345", margin, y);

    y = 155;

    // ---- Items Table Header with Light Beige Background ----
    doc.setFillColor(240, 235, 230);
    doc.rect(margin - 5, y - 7, pageWidth - 2 * margin + 10, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const colImage = margin;
    const colDescription = margin + 20;
    const colQty = pageWidth - margin - 75;
    const colPrice = pageWidth - margin - 55;
    const colGst = pageWidth - margin - 33;
    const colTotal = pageWidth - margin - 10;

    doc.text("(WITH IMAGE)DESCRIPTION", colDescription, y);
    doc.text("QTY", colQty, y);
    doc.text("PRICE", colPrice, y);
    doc.text("GST(%)", colGst, y);
    doc.text("TOTAL", colTotal, y);

    y += 12;

    // Map actual items or use sample data
    const itemsToDisplay =
      quotation.items.length > 0
        ? quotation.items.map((item, index) => {
            const product = products?.find((p) => p.id === item.productId);
            const itemTotal = item.quantity * item.price - item.discount;
            return {
              description:
                item.customTitle || product?.title || `Item ${index + 1}`,
              qty: item.quantity,
              price: item.price,
              gst: 18, // You can add GST field to your interface if needed
              total: itemTotal,
            };
          })
        : [
            {
              description: "Graphic design consultation",
              qty: 2,
              price: 100.0,
              gst: 5,
              total: 200.0,
            },
            {
              description: "Logo design",
              qty: 1,
              price: 700.0,
              gst: 6,
              total: 700.0,
            },
            {
              description: "Social media templates",
              qty: 1,
              price: 600.0,
              gst: 7,
              total: 600.0,
            },
            {
              description: "Revision",
              qty: 2,
              price: 300.0,
              gst: 18,
              total: 600.0,
            },
          ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    itemsToDisplay.forEach((item, index) => {
      // Image placeholder box
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.rect(colImage, y - 5, 14, 12, "S");

      // Item details
      doc.text(item.description, colDescription, y);
      doc.text(item.qty.toString(), colQty + 3, y);
      doc.text(Number(item.price).toFixed(2), colPrice - 2, y);
      doc.text(item.gst.toString(), colGst + 5, y);
      doc.text(Number(item.total).toFixed(2), colTotal - 10, y);

      y += 10;

      if (index < itemsToDisplay.length - 1) {
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
        y += 2;
      }
    });

    y += 10;

    // ---- Total Amount with Light Beige Background ----
    doc.setFillColor(240, 235, 230);
    doc.rect(margin - 5, y - 6, pageWidth - 2 * margin + 10, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("Total amount", colTotal - 50, y);
    doc.text(Number(quotation.total).toFixed(2), colTotal - 10, y);

    y += 20;

    // ---- Terms & Conditions ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text("TEARMS & CONDITION", margin, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);

    const terms = [
      "Valid for 30 days from quotation date.",
      "50% advance payment required to begin work.",
      'Balance due upon final delivery."',
      "Timeline: 2-3 weeks after design approval.",
      "Ownership transfers upon full payment.",
      "1-year warranty on materials and execution.",
    ];

    terms.forEach((term) => {
      doc.text("• " + term, margin + 2, y);
      y += 6;
    });

    // ---- Footer Section - Light Beige ----
    doc.setFillColor(240, 235, 230);
    doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(22);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you!", pageWidth / 2, pageHeight - 13, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(130, 130, 130);
    doc.text("Powered By Botivate", pageWidth / 2, pageHeight - 6, {
      align: "center",
    });

    // ---- Output ----
    const pdfBlob = doc.output("blob");
    resolve(pdfBlob);
  });
}
