import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CompanyData } from './quote-generator';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export interface ReportStats {
  totalLeads: number;
  pendingLeads: number;
  totalViews: number;
  topProducts: { name: string; views: number }[];
  period: string;
}

export const generateExecutiveReportPDF = (stats: ReportStats, company: CompanyData) => {
  const doc = new jsPDF() as jsPDFWithPlugin;

  // --- CONFIGURACIÓN DE COLORES Y ESTILOS ---
  const primaryColor: [number, number, number] = [22, 163, 74]; // Verde B2B Empresas / Industrial
  const accentColor: [number, number, number] = [240, 187, 64]; // Dorado B2B
  const secondaryColor: [number, number, number] = [30, 41, 59]; // Slate 800

  // --- CABECERA ESTILO PREMIUM ---
  doc.setFillColor(...secondaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('REPORTE EJECUTIVO B2B', 15, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text(`PLATAFORMA: B2BEMPRESAS.COM | PERIODO: ${stats.period}`, 15, 32);

  // Logo Placeholder / Texto
  doc.setFillColor(...accentColor);
  doc.roundedRect(160, 10, 35, 20, 3, 3, 'F');
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(14);
  doc.text('B2B Empresas', 170, 23);

  // --- DATOS DE LA EMPRESA ---
  doc.setFontSize(12);
  doc.setTextColor(...secondaryColor);
  doc.text(company.name.toUpperCase(), 15, 55);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`RUC: ${company.ruc} | Sede: ${company.address}`, 15, 60);

  // --- RESUMEN DE INDICADORES (KPIs) ---
  const kpiY = 75;
  // Cuadros de KPI
  const drawKPI = (x: number, y: number, label: string, value: string, color: [number, number, number]) => {
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(x, y, 60, 30, 3, 3, 'F');
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(x, y + 25, x + 60, y + 25);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(label.toUpperCase(), x + 5, y + 10);
    
    doc.setFontSize(16);
    doc.setTextColor(...secondaryColor);
    doc.text(value, x + 5, y + 22);
  };

  drawKPI(15, kpiY, 'Total Leads', stats.totalLeads.toString(), primaryColor);
  drawKPI(80, kpiY, 'Leads Pendientes', stats.pendingLeads.toString(), accentColor);
  drawKPI(145, kpiY, 'Visualizaciones', stats.totalViews.toString(), [59, 130, 246]);

  // --- TABLA DE RENDIMIENTO DE PRODUCTOS ---
  doc.setFontSize(12);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUCTOS CON MAYOR TRACCIÓN', 15, 120);

  const tableData = stats.topProducts.map((p, i) => [
    i + 1,
    p.name,
    p.views,
    `${((p.views / stats.totalViews) * 100).toFixed(1)}%`
  ]);

  doc.autoTable({
    startY: 125,
    head: [['#', 'NOMBRE DEL PRODUCTO / EQUIPO', 'VIEWS', '% IMPACTO']],
    body: tableData,
    headStyles: { fillColor: secondaryColor, textColor: 255, fontSize: 10, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 100 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;

  // --- ANÁLISIS ESTRATÉGICO ---
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('RECOMENDACIONES DE OPTIMIZACIÓN', 15, finalY);
  doc.setLineWidth(0.2);
  doc.line(15, finalY + 2, 195, finalY + 2);

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  const reco = [
    '• Aumentar la frecuencia de actualización de stock para mejorar el ranking.',
    '• Los productos en el TOP 3 representan la mayor oportunidad de conversión inmediata.',
    '• Se recomienda activar "Promoción Destacada" para productos con menos de 10 views.'
  ];
  reco.forEach((line, i) => {
    doc.text(line, 15, finalY + 10 + (i * 6));
  });

  // --- PIE DE PÁGINA ---
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Este reporte es estrictamente confidencial y para uso interno de la gerencia.', 105, 280, { align: 'center' });
  doc.text(`Generado el: ${new Date().toLocaleString('es-PE')} | B2B Empresas Intelligence Unit`, 105, 285, { align: 'center' });

  // Guardar PDF
  doc.save(`Reporte_Ejecutivo_${company.name.replace(/\s/g, '_')}.pdf`);
};
