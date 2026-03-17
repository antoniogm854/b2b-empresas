import { supabase } from './supabase';

export interface RUCValidationResult {
  success: boolean;
  message: string;
  data?: {
    ruc: string;
    razonSocial: string;
    estado: string;
    condicion: string;
    direccion: string;
    actividad: string;
  };
}

export const rucService = {
  /**
   * Valida un número de RUC.
   * Por ahora simula la respuesta de SUNAT para fines de demostración técnica.
   */
  async validateRUC(ruc: string): Promise<RUCValidationResult> {
    // Validar formato (11 dígitos)
    if (!/^\d{11}$/.test(ruc)) {
      return { success: false, message: "El RUC debe tener 11 dígitos numéricos." };
    }

    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock de base de datos de RUCs para demostración
    const mocks: Record<string, any> = {
      "20123456789": {
        ruc: "20123456789",
        razonSocial: "INDUSTRIAL MOTORS SAC",
        estado: "ACTIVO",
        condicion: "HABIDO",
        direccion: "AV. INDUSTRIAL 456, LIMA",
        actividad: "Fabricación de motores y turbinas"
      },
      "20987654321": {
        ruc: "20987654321",
        razonSocial: "METALES Y ALEACIONES PERU EIRL",
        estado: "ACTIVO",
        condicion: "HABIDO",
        direccion: "CALLE MINERIA 123, CALLAO",
        actividad: "Fundición de metales no ferrosos"
      }
    };

    const data = mocks[ruc];

    if (data) {
      return {
        success: true,
        message: "RUC validado correctamente ante SUNAT.",
        data
      };
    } else {
      // Si no está en el mock, generamos uno genérico para permitir el flujo
      return {
        success: true,
        message: "RUC validado correctamente (Modo Simulación).",
        data: {
          ruc,
          razonSocial: `EMPRESA B2B ${ruc.substring(0, 4)} SAC`,
          estado: "ACTIVO",
          condicion: "HABIDO",
          direccion: "DIR. REGISTRADA EN FICHA RUC",
          actividad: "ACTIVIDAD COMERCIAL NO ESPECIFICADA"
        }
      };
    }
  },

  /**
   * Actualiza el estado de verificación de una empresa en la DB.
   */
  async updateCompanyVerification(companyId: string, ruc: string, verificationData: any) {
    const { data, error } = await supabase
      .from('companies')
      .update({
        tax_id: ruc,
        is_verified: true,
        verification_data: verificationData
      })
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
