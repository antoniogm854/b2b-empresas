import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extendiendo jsPDF con autotable para TypeScript
interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface CompanyData {
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface LeadData {
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  items: ProductItem[];
  createdAt: string;
}

export const generateQuotePDF = (lead: LeadData, company: CompanyData) => {
  const doc = new jsPDF() as jsPDFWithPlugin;

  // --- CONFIGURACIÓN DE COLORES Y ESTILOS ---
  const primaryColor = [41, 128, 185]; // Azul Industrial
  const secondaryColor = [44, 62, 80]; // Gris Oscuro

  // --- CABECERA ---
  // Rectángulo decorativo superior
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 15, 'F');

  // Nombre de la Empresa y Título del Documento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(company.name.toUpperCase(), 15, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text(`RUC: ${company.ruc}`, 15, 35);
  doc.text(company.address, 15, 40);
  doc.text(`Telf: ${company.phone} | Email: ${company.email}`, 15, 45);

  // Cuadro de Cotización (Derecha)
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(140, 25, 55, 25);
  doc.setFontSize(14);
  doc.text('COTIZACIÓN', 147, 33);
  doc.setFontSize(10);
  doc.text(`N°: Q-${Math.floor(Date.now() / 1000)}`, 147, 40);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-PE')}`, 147, 45);

  // --- DATOS DEL CLIENTE ---
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('DATOS DEL CLIENTE', 15, 60);
  doc.setLineWidth(0.2);
  doc.line(15, 62, 195, 62);

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Atención: ${lead.customerName}`, 15, 68);
  doc.text(`Empresa: ${lead.customerCompany}`, 15, 73);
  doc.text(`Email: ${lead.customerEmail}`, 15, 78);

  // --- TABLA DE PRODUCTOS ---
  const tableData = lead.items.map((item, index) => [
    index + 1,
    item.name,
    item.description || 'Cumple estándar industrial v1.0',
    item.quantity,
    `S/ ${item.price.toFixed(2)}`,
    `S/ ${(item.quantity * item.price).toFixed(2)}`
  ]);

  const total = lead.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  doc.autoTable({
    startY: 85,
    head: [['ITM', 'DESCRIPCIÓN TÉCNICA', 'ESPECIFICACIONES', 'CANT', 'P. UNIT', 'TOTAL']],
    body: tableData,
    headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 50 },
      2: { cellWidth: 60 },
      3: { cellWidth: 15 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 }
    },
    styles: { overflow: 'linebreak' }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totales
  doc.setFont('helvetica', 'bold');
  doc.text('SUBTOTAL:', 150, finalY);
  doc.text(`S/ ${(total / 1.18).toFixed(2)}`, 180, finalY);
  doc.text('IGV (18%):', 150, finalY + 5);
  doc.text(`S/ ${(total - (total / 1.18)).toFixed(2)}`, 180, finalY + 5);
  doc.setFontSize(12);
  doc.text('TOTAL GENERAL:', 140, finalY + 12);
  doc.text(`S/ ${total.toFixed(2)}`, 180, finalY + 12);

  // --- TÉRMINOS Y CONDICIONES ---
  const termsY = finalY + 30;
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('TÉRMINOS Y CONDICIONES', 15, termsY);
  doc.setLineWidth(0.1);
  doc.line(15, termsY + 2, 100, termsY + 2);

  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Vigencia de oferta: 07 días calendario.', 15, termsY + 8);
  doc.text('2. Tiempo de entrega: Inmediato / sujeto a stock.', 15, termsY + 12);
  doc.text('3. Forma de pago: Contado / Transferencia bancaria.', 15, termsY + 16);
  doc.text('4. Garantía: 01 año por desperfecto de fábrica.', 15, termsY + 20);

  // Firma
  doc.line(140, termsY + 20, 190, termsY + 20);
  doc.text('Firma y Sello del Proveedor', 148, termsY + 25);

  // Pie de página
  doc.setFontSize(7);
  doc.text('Documento generado por B2BEMPRESAS.COM - Plataforma de Gestión Industrial', 105, 290, { align: 'center' });

  // Guardar PDF
  doc.save(`Cotizacion_${lead.customerCompany.replace(/\s/g, '_')}.pdf`);
};
