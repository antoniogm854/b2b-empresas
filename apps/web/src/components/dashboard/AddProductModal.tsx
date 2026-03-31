"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { catalogService } from "@/lib/catalog-service";
import { 
  X, 
  Package, 
  Tag, 
  Layers, 
  DollarSign, 
  Database, 
  FileText,
  Save,
  Loader2,
  AlertCircle,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  FileUp,
  ShieldCheck,
  Globe,
  Settings,
  Truck,
  Boxes
} from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => Promise<void>;
  loading?: boolean;
}

export default function AddProductModal({ isOpen, onClose, onSave, loading }: AddProductModalProps) {
  const t = useTranslations('Wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    skuCUIM: "", // Auto-llenado o Manual
    skuMPN: "",
    skuCUIE: "", // Auto-llenado
    skuGG: "",
    skuGE: "",
    category: "",
    name: "",
    brand: "",
    model: "",
    unit: "UN",
    serial: "",
    color: "",
    size: "",
    material: "",
    origin: "",
    price: "",
    stock: "",
    location: "",
    dispatch: "",
    presentation: "",
    isCertified: false,
    observations: "",
    images: [] as string[],
    documents: [] as string[],
  });

  const [templates, setTemplates] = useState<any[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [dynamicSpecs, setDynamicSpecs] = useState<Record<string, string>>({});

  // Cargar plantillas al montar
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await catalogService.getSpecsTemplates();
        setTemplates(data);
      } catch (e) {
        console.error("Error loading specs templates:", e);
      }
    };
    loadTemplates();
  }, []);

  // Detectar cambio de categoría para activar plantilla
  useEffect(() => {
    const categoryLower = formData.category.toLowerCase().trim();
    const ggLower = formData.skuGG.toLowerCase().trim();
    
    const found = templates.find(t => 
      t.category.toLowerCase() === categoryLower || 
      t.category.toLowerCase() === ggLower
    );

    if (found) {
      setActiveTemplate(found);
      // Inicializar specs si están vacías
      const initialSpecs: Record<string, string> = {};
      Object.keys(found.template).forEach(key => {
        initialSpecs[key] = dynamicSpecs[key] || "";
      });
      setDynamicSpecs(initialSpecs);
    } else {
      setActiveTemplate(null);
    }
  }, [formData.category, formData.skuGG, templates]);

  const handleDynamicSpecChange = (key: string, value: string) => {
    setDynamicSpecs(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === totalSteps) {
      // Consolidar specs dinámicas en observaciones para la ficha técnica
      let finalObservations = formData.observations;
      if (activeTemplate) {
        const specsString = Object.entries(dynamicSpecs)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
          .join(" | ");
        finalObservations = specsString ? `[FICHA TÉCNICA: ${specsString}] \n\n${formData.observations}` : formData.observations;
      }
      
      onSave({ ...formData, observations: finalObservations });
    } else {
      handleNext();
    }
  };

  const renderStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Package size={18} />;
      case 2: return <Layers size={18} />;
      case 3: return <DollarSign size={18} />;
      case 4: return <ImageIcon size={18} />;
      default: return null;
    }
  };

  const stepTitles = [
    t('identity'),
    t('classification'),
    t('specifications'),
    t('multimedia')
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white border border-slate-200 rounded-[3rem] w-full max-w-4xl shadow-4xl overflow-hidden animate-reveal flex flex-col max-h-[90vh]">
        {/* CAT Industrial Header */}
        <div className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[var(--cat-yellow)]" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-[var(--cat-yellow)] rounded-2xl flex items-center justify-center shadow-xl transform -rotate-2">
              <PlusIcon size={28} className="text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{t('title')}</h2>
              <p className="text-[10px] font-black text-[var(--cat-yellow)] uppercase tracking-[0.3em] mt-2 opacity-80">{t('subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-[var(--cat-yellow)] -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
            
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${
                  currentStep === i + 1 
                    ? "bg-black border-black text-white scale-110 shadow-lg" 
                    : currentStep > i + 1 
                      ? "bg-[var(--cat-yellow)] border-[var(--cat-yellow)] text-black" 
                      : "bg-white border-slate-200 text-slate-300"
                }`}>
                  {currentStep > i + 1 ? <CheckIcon size={18} /> : renderStepIcon(i + 1)}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest hidden md:block ${
                  currentStep === i + 1 ? "text-black" : "text-slate-300"
                }`}>
                  {t('step')} {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-white">
          <div className="max-w-3xl mx-auto space-y-10">
            
            <header className="space-y-2 border-l-4 border-[var(--cat-yellow)] pl-6">
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                {stepTitles[currentStep - 1]}
              </h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">
                {t('step')} {currentStep} {t('step_of')} {totalSteps} — {t('step_hint')}
              </p>
            </header>

            <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* PASO 1: DE IDENTIFICACIÓN TÉCNICA */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('product_name')}</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all shadow-sm"
                      placeholder="Ej: Motor Diesel CAT C15"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('brand')}</label>
                    <input 
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all shadow-sm"
                      placeholder="Caterpillar"
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('category')} (Trigger Tech) *</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white border-2 border-[var(--cat-yellow)] rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none shadow-sm"
                      placeholder="Ej: EPP, Motor, Valvula"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                    <p className="text-[8px] text-slate-400 font-bold italic ml-2">Define la plantilla inteligente</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('model')} / {t('serial')}</label>
                    <input 
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all shadow-sm"
                      placeholder="Modelo / Serie"
                      value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('unit')}</label>
                    <select 
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all flex appearance-none"
                      value={formData.unit}
                      onChange={e => setFormData({...formData, unit: e.target.value})}
                    >
                      <option value="UN">Unidad (UN)</option>
                      <option value="GL">Galón (GL)</option>
                      <option value="MT">Metros (MT)</option>
                      <option value="KG">Kilogramos (KG)</option>
                      <option value="CJ">Caja (CJ)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('color')}</label>
                      <input 
                        type="text"
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('size')}</label>
                      <input 
                        type="text"
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                        value={formData.size}
                        onChange={e => setFormData({...formData, size: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('material')}</label>
                      <input 
                        type="text"
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                        value={formData.material}
                        onChange={e => setFormData({...formData, material: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Globe size={12} /> {t('origin')}
                      </label>
                      <input 
                        type="text"
                        className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                        placeholder="Procedencia (Origen)"
                        value={formData.origin}
                        onChange={e => setFormData({...formData, origin: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* SECCIÓN DINÁMICA: SMART SPECS - PASO 1 */}
                  {activeTemplate && (
                    <div className="md:col-span-2 bg-slate-50 border-2 border-[var(--cat-yellow)]/30 rounded-[2.5rem] p-8 space-y-6 animate-reveal">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--cat-yellow)] rounded-xl flex items-center justify-center shadow-sm">
                            <SparklesIcon size={20} className="text-black" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-tighter text-slate-900">{t('smart_specs')}: {activeTemplate.category}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('smart_specs_v')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {Object.keys(activeTemplate.template).map((key) => (
                          <div key={key} className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{key.replace(/_/g, ' ')}</label>
                            <input 
                              type="text"
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all"
                              placeholder="..."
                              value={dynamicSpecs[key] || ""}
                              onChange={e => handleDynamicSpecChange(key, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* PASO 2: CLASIFICACIÓN EMPRESA B2B */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Database size={12} /> {t('sku_cuim')}
                    </label>
                    <input 
                      disabled
                      type="text"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold text-slate-400 outline-none italic cursor-not-allowed"
                      placeholder={t('sku_cuim_hint')}
                      value={formData.skuCUIM}
                    />
                    <p className="text-[9px] text-slate-400 font-medium italic">Autogenerado: CMB-XXXXX (ID Maestro)</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={12} /> {t('sku_mpn')}
                    </label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all shadow-sm"
                      placeholder="Código de fábrica o Nro de Parte"
                      value={formData.skuMPN}
                      onChange={e => setFormData({...formData, skuMPN: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU-GG (Grupo General) *</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all shadow-sm"
                      placeholder="Ej: Materiales Eléctricos"
                      value={formData.skuGG}
                      onChange={e => setFormData({...formData, skuGG: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU-GE (Grupo Específico) *</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] transition-all shadow-sm"
                      placeholder="Ej: Cableado Alta Tensión"
                      value={formData.skuGE}
                      onChange={e => setFormData({...formData, skuGE: e.target.value})}
                    />
                  </div>
                </>
              )}

              {/* PASO 3: ESPECIFICACIONES COMERCIALES */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign size={12} /> {t('price')}
                    </label>
                    <input 
                      type="number"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Boxes size={12} /> {t('stock')}
                    </label>
                    <input 
                      type="number"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('location')}</label>
                    <input 
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                      placeholder="Ej: Lima - Ate"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('dispatch')}</label>
                    <input 
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                      placeholder="Ej: 24 hrs, Inmediato"
                      value={formData.dispatch}
                      onChange={e => setFormData({...formData, dispatch: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('presentation')}</label>
                    <input 
                      type="text"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 outline-none focus:border-[var(--cat-yellow)] shadow-sm"
                      placeholder="Ej: Caja x 12, Cilindro"
                      value={formData.presentation}
                      onChange={e => setFormData({...formData, presentation: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                      {t('certified')}
                    </label>
                    <div className="flex items-center gap-8">
                       <button 
                        type="button"
                        onClick={() => setFormData({...formData, isCertified: true})}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                          formData.isCertified ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" : "bg-white border-slate-200 text-slate-400"
                        }`}
                       >
                         SI
                       </button>
                       <button 
                        type="button"
                        onClick={() => setFormData({...formData, isCertified: false})}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                          !formData.isCertified ? "bg-red-500 border-red-500 text-white shadow-lg" : "bg-white border-slate-200 text-slate-400"
                        }`}
                       >
                         NO
                       </button>
                    </div>
                  </div>
                </>
              )}

              {/* PASO 4: DOCUMENTACIÓN & MULTIMEDIA */}
              {currentStep === 4 && (
                <>
                  <div className="md:col-span-2 space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                          <ImageIcon size={14} className="text-[var(--cat-yellow-dark)]" /> {t('images')}
                        </label>
                        <span className="text-[9px] font-black text-slate-400">MÁX 3 FOTOS • JPG / PNG</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3].map(id => (
                          <div key={id} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-center group hover:border-[var(--cat-yellow)] transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <FileUp size={20} className="text-slate-400 group-hover:text-[var(--cat-yellow-dark)]" />
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">Foto {id}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                          <FileText size={14} className="text-emerald-500" /> {t('documents')}
                        </label>
                        <span className="text-[9px] font-black text-slate-400">MÁX 3 PDF • TÉCNICOS</span>
                      </div>

                      <div className="space-y-4">
                        {[1, 2, 3].map(id => (
                          <div key={id} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex items-center justify-between group hover:border-emerald-500 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <FileUp size={16} className="text-slate-400 group-hover:text-emerald-500" />
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento {id}</span>
                            </div>
                            <div className="px-5 py-2 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-300">SUBIR</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-10 py-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button 
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
              currentStep === 1 ? "opacity-0 invisible" : "bg-white/10 text-white hover:bg-white hover:text-black shadow-xl"
            }`}
          >
            <ChevronLeft size={18} /> {t('btn_back')}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mr-4 hidden md:block">
              {currentStep < totalSteps ? t('next_step') : t('final_process')}
            </span>
            
            <button 
              form="product-form"
              type="submit"
              disabled={loading}
              className={`flex items-center gap-4 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all shadow-2xl active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : "bg-[var(--cat-yellow)] text-black hover:scale-105"
              }`}
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : currentStep === totalSteps ? (
                <>
                  <Save size={24} /> {t('btn_save')}
                </>
              ) : (
                <>
                  {t('btn_next')} <ChevronRight size={24} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponentes Iconos
function FingerprintIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.3 3"/>
      <path d="M14 3.1V5c0 .5-.2 1-.5 1.5"/>
      <path d="M9.6 18H6.04a2 2 0 0 1-1.93-2.51l.36-1.58c.24-1.04-.15-2.06-1.01-2.67C3.12 11.02 3 10.73 3 10.42c0-1.8 1.46-3.26 3.26-3.26"/>
      <path d="M21 10.42c0-1.8-1.46-3.26-3.26-3.26-.31 0-.6.12-.82.32-.86.61-1.25 1.63-1.01 2.67l.36 1.58C16.9 14.28 16.32 16 14.54 16H10.46"/>
      <path d="M12 13v7"/>
      <path d="M12 3c-4.97 0-9 4.03-9 9 0 .34.02.67.06 1"/>
      <path d="M21 12c0-4.97-4.03-9-9-9"/>
    </svg>
  );
}

function CheckIcon({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
}

function PlusIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SparklesIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
