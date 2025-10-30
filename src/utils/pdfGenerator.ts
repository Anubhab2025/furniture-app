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
  phone: string;
  email?: string;
}

export interface Product {
  id: string;
  title: string;
}

export function generateQuotationPDF(
  quotation: Quotation,
  customer: Customer | undefined,
  products: Product[] | undefined
) {
  const doc = new jsPDF();

  // === HEADER ===
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(26);
  doc.setFont(undefined, "bold");
  doc.text("QUOTATION", 105, 25, { align: "center" });

  // Line under header
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);

  // === INFO SECTION ===
  const infoY = 40;
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Quotation Details", 25, infoY);
  doc.text("Customer Information", 115, infoY);

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  const leftStart = 25;
  const rightStart = 115;
  const rowGap = 6;
  const startY = infoY + 8;

  const leftData = [
    `Quotation ID: ${quotation.id}`,
    `Date: ${new Date(quotation.createdAt).toLocaleDateString()}`,
    `Status: ${quotation.status}`,
  ];

  const rightData = [
    `Name: ${customer?.name || "Unknown"}`,
    `Phone: ${customer?.phone || "N/A"}`,
    `Email: ${customer?.email || "N/A"}`,
  ];

  leftData.forEach((text, i) => {
    doc.text(text, leftStart, startY + i * rowGap);
  });
  rightData.forEach((text, i) => {
    doc.text(text, rightStart, startY + i * rowGap);
  });

  // Separator line
  doc.setLineWidth(0.5);
  doc.line(20, startY + rowGap * 3 + 3, 190, startY + rowGap * 3 + 3);

  // === ITEMS TABLE ===
  const tableStartY = startY + rowGap * 4 + 12;
  doc.setFont(undefined, "bold");
  doc.setFontSize(11);
  doc.text("Items", 20, tableStartY - 6);

  // Table Headers
  doc.setFontSize(9);
  const headers = ["Item", "Qty", "Price", "Discount", "Total"];
  const xPositions = [25, 120, 140, 160, 180];
  headers.forEach((header, i) => {
    doc.text(header, xPositions[i], tableStartY);
  });

  // Header line
  doc.setLineWidth(0.5);
  doc.line(20, tableStartY + 2, 190, tableStartY + 2);

  // === ITEMS ===
  let y = tableStartY + 10;
  quotation.items.forEach((item, index) => {
    const product = products?.find((p) => p.id === item.productId);
    const title = product?.title || item.customTitle || "Custom Item";
    const itemTotal = item.price * item.quantity - (item.discount || 0);

    // Item photo (optional)
    if (item.customPhoto) {
      try {
        doc.rect(22, y - 5, 20, 20);
        doc.addImage(item.customPhoto, "JPEG", 23, y - 4, 18, 18);
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(title, 70);
        lines.forEach((line, i) => {
          doc.text(line, 45, y + i * 4);
        });
      } catch {
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(title, 80);
        lines.forEach((line, i) => doc.text(line, 25, y + i * 4));
      }
    } else {
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(title, 80);
      lines.forEach((line, i) => doc.text(line, 25, y + i * 4));
    }

    // Numbers
    doc.text(item.quantity.toString(), 120, y);
    doc.text(`₹${item.price.toLocaleString()}`, 140, y);
    doc.text(`₹${(item.discount || 0).toLocaleString()}`, 160, y);
    doc.setFont(undefined, "bold");
    doc.text(`₹${itemTotal.toLocaleString()}`, 180, y);

    y += 20;

    if (y > 260) {
      doc.addPage();
      y = 30;
    }
  });

  // === SUMMARY SECTION ===
  const summaryY = y + 10;
  doc.setDrawColor(0, 0, 0);
  doc.rect(20, summaryY, 170, 50);

  doc.setFont(undefined, "bold");
  doc.setFontSize(11);
  doc.text("Summary", 105, summaryY + 8, { align: "center" });

  const labelX = 40;
  const valueX = 180;
  let lineY = summaryY + 20;
  const lineGap = 8;

  const addRow = (label: string, value: string, bold = false) => {
    doc.setFont(undefined, bold ? "bold" : "normal");
    doc.text(label, labelX, lineY);
    doc.text(value, valueX, lineY, { align: "right" });
    lineY += lineGap;
  };

  addRow("Subtotal:", `₹${quotation.subtotal.toLocaleString()}`);
  addRow("Tax (18%):", `₹${quotation.tax.toLocaleString()}`);
  if (quotation.discount > 0)
    addRow("Discount:", `-₹${quotation.discount.toLocaleString()}`);
  doc.line(40, lineY - 4, 170, lineY - 4);
  addRow("TOTAL:", `₹${quotation.total.toLocaleString()}`, true);

  // === FOOTER ===
  const footerY = 285;
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.text("Thank you for your business!", 105, footerY - 5, {
    align: "center",
  });
  doc.text(`Generated on ${new Date().toLocaleString()}`, 105, footerY, {
    align: "center",
  });
  doc.setFont(undefined, "bold");
  doc.text("Powered by botivste", 105, footerY + 5, { align: "center" });

  // Save
  doc.save(`quotation-${quotation.id}.pdf`);
}

export function generatePDFBlob(
  quotation: Quotation,
  customer: Customer | undefined,
  products: Product[] | undefined
): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF();

    // === HEADER ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(26);
    doc.setFont(undefined, "bold");
    doc.text("QUOTATION", 105, 25, { align: "center" });

    // Line under header
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);

    // === INFO SECTION ===
    const infoY = 40;
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Quotation Details", 25, infoY);
    doc.text("Customer Information", 115, infoY);

    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    const leftStart = 25;
    const rightStart = 115;
    const rowGap = 6;
    const startY = infoY + 8;

    const leftData = [
      `Quotation ID: ${quotation.id}`,
      `Date: ${new Date(quotation.createdAt).toLocaleDateString()}`,
      `Status: ${quotation.status}`,
    ];

    const rightData = [
      `Name: ${customer?.name || "Unknown"}`,
      `Phone: ${customer?.phone || "N/A"}`,
      `Email: ${customer?.email || "N/A"}`,
    ];

    leftData.forEach((text, i) => {
      doc.text(text, leftStart, startY + i * rowGap);
    });
    rightData.forEach((text, i) => {
      doc.text(text, rightStart, startY + i * rowGap);
    });

    // Separator line
    doc.setLineWidth(0.5);
    doc.line(20, startY + rowGap * 3 + 3, 190, startY + rowGap * 3 + 3);

    // === ITEMS TABLE ===
    const tableStartY = startY + rowGap * 4 + 12;
    doc.setFont(undefined, "bold");
    doc.setFontSize(11);
    doc.text("Items", 20, tableStartY - 6);

    // Table Headers
    doc.setFontSize(9);
    const headers = ["Item", "Qty", "Price", "Discount", "Total"];
    const xPositions = [25, 120, 140, 160, 180];
    headers.forEach((header, i) => {
      doc.text(header, xPositions[i], tableStartY);
    });

    // Header line
    doc.setLineWidth(0.5);
    doc.line(20, tableStartY + 2, 190, tableStartY + 2);

    // === ITEMS ===
    let y = tableStartY + 10;
    quotation.items.forEach((item, index) => {
      const product = products?.find((p) => p.id === item.productId);
      const title = product?.title || item.customTitle || "Custom Item";
      const itemTotal = item.price * item.quantity - (item.discount || 0);

      // Item photo (optional)
      if (item.customPhoto) {
        try {
          doc.rect(22, y - 5, 20, 20);
          doc.addImage(item.customPhoto, "JPEG", 23, y - 4, 18, 18);
          doc.setFontSize(9);
          const lines = doc.splitTextToSize(title, 70);
          lines.forEach((line, i) => {
            doc.text(line, 45, y + i * 4);
          });
        } catch {
          doc.setFontSize(9);
          const lines = doc.splitTextToSize(title, 80);
          lines.forEach((line, i) => doc.text(line, 25, y + i * 4));
        }
      } else {
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(title, 80);
        lines.forEach((line, i) => doc.text(line, 25, y + i * 4));
      }

      // Numbers
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`₹${item.price.toLocaleString()}`, 140, y);
      doc.text(`₹${(item.discount || 0).toLocaleString()}`, 160, y);
      doc.setFont(undefined, "bold");
      doc.text(`₹${itemTotal.toLocaleString()}`, 180, y);

      y += 20;

      if (y > 260) {
        doc.addPage();
        y = 30;
      }
    });

    // === SUMMARY ===
    const summaryY = y + 10;
    doc.setDrawColor(0, 0, 0);
    doc.rect(20, summaryY, 170, 50);

    doc.setFont(undefined, "bold");
    doc.setFontSize(11);
    doc.text("Summary", 105, summaryY + 8, { align: "center" });

    const labelX = 40;
    const valueX = 180;
    let lineY = summaryY + 20;
    const lineGap = 8;

    const addRow = (label: string, value: string, bold = false) => {
      doc.setFont(undefined, bold ? "bold" : "normal");
      doc.text(label, labelX, lineY);
      doc.text(value, valueX, lineY, { align: "right" });
      lineY += lineGap;
    };

    addRow("Subtotal:", `₹${quotation.subtotal.toLocaleString()}`);
    addRow("Tax (18%):", `₹${quotation.tax.toLocaleString()}`);
    if (quotation.discount > 0)
      addRow("Discount:", `-₹${quotation.discount.toLocaleString()}`);
    doc.line(40, lineY - 4, 170, lineY - 4);
    addRow("TOTAL:", `₹${quotation.total.toLocaleString()}`, true);

    // === FOOTER ===
    const footerY = 285;
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.text("Thank you for your business!", 105, footerY - 5, {
      align: "center",
    });
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, footerY, {
      align: "center",
    });
    doc.setFont(undefined, "bold");
    doc.text("Powered by botivste", 105, footerY + 5, { align: "center" });

    // Return blob instead of saving
    const pdfBlob = doc.output('blob');
    resolve(pdfBlob);
  });
}
