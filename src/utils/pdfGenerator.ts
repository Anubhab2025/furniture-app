import jsPDF from "jspdf";

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
    const margin = 20;
    let y = 25;

    // Helper: Add horizontal line
    const addLine = (yPos: number, style: "solid" | "dashed" = "solid") => {
      doc.setDrawColor(0);
      doc.setLineWidth(style === "dashed" ? 0.3 : 0.5);
      if (style === "dashed") {
        doc.setLineDashPattern([1, 1], 0);
      }
      doc.line(margin, yPos, pageWidth - margin, yPos);
      if (style === "dashed") doc.setLineDashPattern([], 0);
    };

    // === HEADER ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("curioushues", pageWidth / 2, y, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Professional Design Services", pageWidth / 2, y + 7, { align: "center" });

    doc.setFontSize(9);
    const companyDetails = [
      "123 Design Street, Creative City, NY 10001",
      "Phone: +1 (555) 123-4567",
      "Email: contact@curioushues.com"
    ];
    companyDetails.forEach((line, i) => {
      doc.text(line, pageWidth / 2, y + 14 + i * 4, { align: "center" });
    });

    y += 27;

    // === QUOTE INFO ===
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Quote #: ${quotation.quoteNumber || quotation.id}`, pageWidth - margin, y, { align: "right" });
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString("en-GB")}`, pageWidth - margin, y + 5, { align: "right" });
    if (quotation.expirationDate) {
      doc.text(`Valid Until: ${new Date(quotation.expirationDate).toLocaleDateString("en-GB")}`, pageWidth - margin, y + 10, { align: "right" });
    }

    y += 25;

    // === BILL TO ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Bill To", margin, y);
    addLine(y + 2, "dashed");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 8;

    const customerLines = [
      customer?.name || "Customer Name",
      customer?.company,
      customer?.addressLine1,
      customer?.addressLine2,
      `${[customer?.city, customer?.state, customer?.zip].filter(Boolean).join(", ")}`,
      customer?.country,
      `Phone: ${customer?.phone || "N/A"}`,
      customer?.email ? `Email: ${customer.email}` : ""
    ].filter(Boolean);

    customerLines.forEach(line => {
      doc.text(line, margin, y);
      y += 5;
    });

    y += 15;

    // === ITEMS TABLE HEADER ===
    const tableTop = y;
    const col1 = margin;
    const col2 = margin + 22; // photo + gap
    const colQty = pageWidth - margin - 55;
    const colPrice = pageWidth - margin - 30;
    const colTotal = pageWidth - margin - 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Description", col2, y + 6);
    doc.text("Qty", colQty, y + 6);
    doc.text("Price", colPrice, y + 6, { align: "right" });
    doc.text("Total", colTotal, y + 6, { align: "right" });

    addLine(y + 10);

    y += 15;
    doc.setFont("helvetica", "normal");

    // === ITEMS ROWS ===
    quotation.items.forEach((item, index) => {
      const product = products?.find(p => p.id === item.productId);
      const title = product?.title || item.customTitle || "Custom Item";
      const itemTotal = item.price * item.quantity - (item.discount || 0);
      const hasPhoto = !!item.customPhoto;

      const rowHeight = 18;
      const rowY = y;

      // Photo placeholder
      if (hasPhoto) {
        try {
          doc.addImage(item.customPhoto!, "JPEG", col1, y, 16, 16);
        } catch {
          doc.setDrawColor(180);
          doc.rect(col1, y, 16, 16, "S");
          doc.setFontSize(6);
          doc.text("IMG", col1 + 3, y + 8);
          doc.setFontSize(10);
        }
      } else {
        doc.setDrawColor(200);
        doc.rect(col1, y, 16, 16, "S");
        doc.setFontSize(6);
        doc.text("—", col1 + 6, y + 9);
        doc.setFontSize(10);
      }

      // Title (auto-wrap)
      const titleLines = doc.splitTextToSize(title, pageWidth - margin - 80);
      doc.text(titleLines, col2, y + 6);

      // Values
      doc.text(item.quantity.toString(), colQty, y + 6);
      doc.text(`₹${item.price.toLocaleString("en-IN")}`, colPrice, y + 6, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(`₹${itemTotal.toLocaleString("en-IN")}`, colTotal, y + 6, { align: "right" });
      doc.setFont("helvetica", "normal");

      y += Math.max(rowHeight, titleLines.length * 5 + 8);

      // Alternating row separator
      if (index < quotation.items.length - 1) {
        doc.setDrawColor(220);
        doc.setLineWidth(0.2);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
      }

      // Page break
      if (y > pageHeight - 80) {
        doc.addPage();
        y = 30;
      }
    });

    // === SUMMARY ===
    const summaryStartY = y + 10;
    const summaryRight = pageWidth - margin - 5;
    const labelX = pageWidth - margin - 60;

    addLine(summaryStartY - 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    let sy = summaryStartY + 8;

    doc.text("Subtotal", labelX, sy);
    doc.text(`₹${quotation.subtotal.toLocaleString("en-IN")}`, summaryRight, sy, { align: "right" });
    sy += 6;

    doc.text("Tax", labelX, sy);
    doc.text(`₹${quotation.tax.toLocaleString("en-IN")}`, summaryRight, sy, { align: "right" });
    sy += 6;

    if (quotation.discount > 0) {
      doc.text("Discount", labelX, sy);
      doc.text(`-₹${quotation.discount.toLocaleString("en-IN")}`, summaryRight, sy, { align: "right" });
      sy += 6;
    }

    // Total
    doc.setDrawColor(0);
    doc.setLineWidth(0.8);
    doc.line(pageWidth - margin - 80, sy, pageWidth - margin, sy);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL", labelX, sy + 8);
    doc.text(`₹${quotation.total.toLocaleString("en-IN")}`, summaryRight, sy + 8, { align: "right" });

    // === TERMS ===
    const termsY = Math.max(sy + 25, pageHeight - 100);
    if (termsY < pageHeight - 60) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Terms & Conditions", margin, termsY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);

      const terms = [
        "Valid for 30 days from quotation date.",
        "50% advance payment required to begin work.",
        "Balance due upon final delivery.",
        "Timeline: 2–3 weeks after design approval.",
      
        "Ownership transfers upon full payment.",
        "1-year warranty on materials and execution."
      ];

      terms.forEach((term, i) => {
        doc.text(`• ${term}`, margin, termsY + 8 + i * 4.5);
      });
    }

    // === FOOTER ===
    const footerY = pageHeight - 25;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Thank you for choosing Curioushues.", pageWidth / 2, footerY, { align: "center" });

    doc.setFontSize(8);
    doc.text(quotation.companyEmail || "contact@curioushues.com", pageWidth / 2, footerY + 5, { align: "center" });

    doc.setFontSize(7);
    doc.text("Powered by Botivate", pageWidth / 2, footerY + 10, { align: "center" });

    // Final line
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);

    // === OUTPUT ===
    const pdfBlob = doc.output("blob");
    resolve(pdfBlob);
  });
}