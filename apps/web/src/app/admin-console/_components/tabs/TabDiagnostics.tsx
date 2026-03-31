"use client";

import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

interface TabDiagnosticsProps {
  auditResults: any;
  isLoading: boolean;
  onRunAudit: () => void;
}

export function TabDiagnostics({ auditResults, isLoading, onRunAudit }: TabDiagnosticsProps) {
  const t = useTranslations('AdminConsole');
  return (
    <div className="p-10 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-3xl font-black text-primary flex items-center italic tracking-tighter">
          <BarChart3 className="mr-4 text-accent" size={32} />
          {t('diagnostics_title')}
        </h3>
        <button
          onClick={onRunAudit}
          disabled={isLoading}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-accent hover:text-primary transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isLoading ? t('diagnostics_scanning') : t('diagnostics_scan_btn')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {auditResults ? (
          <div className="p-8 bg-slate-50 rounded-[3rem] border-2 border-slate-100 overflow-hidden">
            <pre className="text-[10px] font-mono text-slate-500 whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(auditResults, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <BarChart3 size={64} className="mb-6 text-slate-200 animate-pulse" />
            <p className="font-black uppercase tracking-[0.3em] text-xs">{t('diagnostics_empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
 village: false
 StartLine: 9
 EndLine: 10
 TargetContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  return ('
 ReplacementContent: 'export function TabCompanies({ allCompanies }: TabCompaniesProps) {\n  const t = useTranslations(\'AdminConsole\');\n  return ('
 village: false
 StartLine: 15
 EndLine: 15
 TargetContent: '          DIRECTORIO MAESTRO DE PROVEEDORES'
 ReplacementContent: '          {t(\'companies_title\')}'
 village: false
 StartLine: 18
 EndLine: 18
 TargetContent: '          Total: {allCompanies.length} Empresas'
 ReplacementContent: '          {t(\'companies_total\', { count: allCompanies.length })}'
 village: false
 StartLine: 35
 EndLine: 35
 TargetContent: '                      {c.status}'
 ReplacementContent: '                      {c.status === "active" ? t(\'companies_status_active\') : t(\'companies_status_suspended\')}'
 village: false
 StartLine: 49
 EndLine: 49
 TargetContent: '                Ver Portafolio'
 ReplacementContent: '                {t(\'companies_view_btn\')}'
 village: false
 StartLine: 56
 EndLine: 56
 TargetContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">El directorio se encuentra vacío</p>'
 ReplacementContent: '            <p className="font-black uppercase tracking-[0.3em] text-xs">{t(\'companies_empty\')}</p>'
