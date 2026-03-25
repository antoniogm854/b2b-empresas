/**
 * SUNAT RUC validation via proxy
 */
export const validateRUC = async (ruc: string) => {
  if (ruc.length !== 11) {
    return { valid: false, message: "El RUC debe tener 11 dígitos." };
  }

  try {
    const res = await fetch(`/api/sunat?ruc=${ruc}`);
    if (!res.ok) {
      return { 
        valid: false, 
        message: "EL RUC INGRESADO NO EXISTE O EL SERVICIO ESTÁ TEMPORALMENTE CAIDO." 
      };
    }
    
    const data = await res.json();
    
    return {
      valid: true,
      data: {
        ruc: data.numeroDocumento,
        razonSocial: data.nombre,
        estado: data.estado,            // e.g. "ACTIVO"
        condicion: data.condicion,      // e.g. "HABIDO"
        domicilioFiscal: `${data.direccion} - ${data.distrito}, ${data.provincia}, ${data.departamento}`,
        activityMain: "",
        activitySec1: "",
        activitySec2: "",
        fechaInicio: "",
        representantes: [],
      },
    };
  } catch (err: any) {
    return {
      valid: false,
      message: "ERROR DE CONEXIÓN AL VALIDAR RUC. INTENTE NUEVAMENTE.",
    };
  }
};
