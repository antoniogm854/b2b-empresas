import { catalogService } from '@/lib/catalog-service';
import { companyService } from '@/lib/company-service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Obtener la empresa de prueba (RA PERU S.A.C.)
    const tenants = await companyService.getTenants();
    const tenant = tenants.find(t => t.company_name.includes('RA PERU')) || tenants[0];

    if (!tenant) {
      return NextResponse.json({ error: 'No se encontró empresa para la siembra.' }, { status: 404 });
    }

    // 2. Dataset Industrial Uniformizado (20 productos)
    // Siguiendo el principio: Jalar todo lo disponible, dejar nulo si no existe.
    const productsData = [
      {
        name: "Electrobomba Centrífuga Pedrollo CPM 158",
        brand: "PEDROLLO",
        category: "BOMBAS",
        model: "CPM-158",
        description: "Bomba centrífuga de alto rendimiento para trasvase de agua limpia en aplicaciones civiles e industriales.",
        price: 485.50,
        stock: 12,
        skuCUIM: "SUNAT-BOM-PED-158",
        skuCUIE: "INT-BOM-001",
        unit: "UNIDAD",
        material: "Hierro Fundido",
        origin: "Italia",
        power: "0.75kW",
        isCertified: true
      },
      {
        name: "Bomba Periférica Pedrollo PKm 60",
        brand: "PEDROLLO",
        category: "BOMBAS",
        model: "PKM-60",
        description: "Bomba periférica ideal para sistemas domésticos de presurización.",
        price: 125.00,
        stock: 50,
        skuCUIM: "SUNAT-BOM-PED-60",
        skuCUIE: "INT-BOM-002",
        unit: "UNIDAD",
        material: "Latón / Hierro",
        origin: "Italia",
        power: "0.5HP",
        isCertified: true
      },
      {
        name: "Motor Eléctrico WEG W22 IE3 5HP",
        brand: "WEG",
        category: "MOTORES",
        model: "W22-IE3",
        description: "Motor trifásico de alta eficiencia para uso industrial continuo.",
        price: 890.00,
        stock: 5,
        skuCUIM: "SUNAT-MOT-WEG-5HP",
        skuCUIE: "INT-MOT-001",
        unit: "UNIDAD",
        material: "Hierro Gris",
        origin: "Brasil",
        efficiency: "IE3",
        speed: "1800RPM",
        isCertified: true
      },
      {
        name: "Motor Monofásico WEG 2HP 3600RPM",
        brand: "WEG",
        category: "MOTORES",
        model: "W21-MONO",
        description: "Motor monofásico versátil para maquinaria pequeña.",
        price: 430.00,
        stock: 15,
        skuCUIM: "SUNAT-MOT-WEG-2HP",
        skuCUIE: "INT-MOT-002",
        unit: "UNIDAD",
        material: "Aluminio",
        origin: "Brasil",
        isCertified: true
      },
      {
        name: "Casco de Seguridad 3M H-700 Blanco",
        brand: "3M",
        category: "EPP",
        model: "H-700",
        description: "Casco con suspensión de trinquete y ranuras para accesorios.",
        price: 28.50,
        stock: 100,
        skuCUIM: "SUNAT-EPP-3M-H700",
        skuCUIE: "INT-EPP-001",
        unit: "UNIDAD",
        material: "HDPE",
        origin: "USA",
        isCertified: true,
        certification: "ANSI Z89.1"
      },
      {
        name: "Respirador de Cara Completa 3M 6800",
        brand: "3M",
        category: "EPP",
        model: "6800",
        description: "Respirador de cara completa con amplio campo visual.",
        price: 195.00,
        stock: 20,
        skuCUIM: "SUNAT-EPP-3M-6800",
        skuCUIE: "INT-EPP-002",
        unit: "UNIDAD",
        material: "Silicona",
        isCertified: true
      },
      {
        name: "Interruptor Termomagnético Schneider iK60N 3P 63A",
        brand: "SCHNEIDER",
        category: "ELÉCTRICO",
        model: "iK60N",
        description: "Protección contra sobrecargas y cortocircuitos en redes trifásicas.",
        price: 92.00,
        stock: 45,
        skuCUIM: "SUNAT-ELE-SCH-63A",
        skuCUIE: "INT-ELE-001",
        unit: "UNIDAD",
        origin: "Francia",
        isCertified: true
      },
      {
        name: "Contactor Schneider TeSys D LC1D25",
        brand: "SCHNEIDER",
        category: "ELÉCTRICO",
        model: "TeSys-D",
        description: "Contactor de 3 polos para control de cargas inductivas.",
        price: 110.00,
        stock: 30,
        skuCUIM: "SUNAT-ELE-SCH-C25",
        skuCUIE: "INT-ELE-002",
        unit: "UNIDAD",
        isCertified: true
      },
      {
        name: "Relé Térmico ABB TF42-10",
        brand: "ABB",
        category: "ELÉCTRICO",
        model: "TF42",
        description: "Protección térmica para motores con rango de 7.6-10A.",
        price: 115.00,
        stock: 25,
        skuCUIM: "SUNAT-ELE-ABB-TF42",
        skuCUIE: "INT-ELE-003",
        unit: "UNIDAD",
        isCertified: true
      },
      {
        name: "Tubería Presión Vinilit PN10 110mm x 6m",
        brand: "VINILIT",
        category: "TUBERÍAS",
        model: "PN10",
        description: "Tubería de PVC-U para conducción de agua a presión.",
        price: 82.50,
        stock: 200,
        skuCUIM: "SUNAT-TUB-VIN-110",
        skuCUIE: "INT-TUB-001",
        unit: "TIRA",
        material: "PVC-U",
        origin: "Chile",
        size: "110mm",
        isCertified: true
      },
      {
        name: "Válvula de Bola Genebre 3 Piezas 1\" SS316",
        brand: "GENEBRE",
        category: "VÁLVULAS",
        model: "2025",
        description: "Válvula industrial de paso total en acero inoxidable.",
        price: 72.00,
        stock: 40,
        skuCUIM: "SUNAT-VAL-GEN-1SS",
        skuCUIE: "INT-VAL-001",
        unit: "UNIDAD",
        material: "Acero Inoxidable 316",
        origin: "España",
        isCertified: true
      },
      {
        name: "Válvula Check Genebre 2\" Bronce",
        brand: "GENEBRE",
        category: "VÁLVULAS",
        model: "CHECK-2",
        description: "Válvula de retención serie industrial PN16.",
        price: 135.00,
        stock: 15,
        skuCUIM: "SUNAT-VAL-GEN-2BR",
        skuCUIE: "INT-VAL-002",
        unit: "UNIDAD",
        material: "Bronce",
        isCertified: true
      },
      {
        name: "Compresor de Aire Kaeser SM-10",
        brand: "KAESER",
        category: "AIRE",
        model: "SM-10",
        description: "Compresor de tornillo rotativo de alta eficiencia energética.",
        price: 4750.00,
        stock: 2,
        skuCUIM: "SUNAT-COM-KAE-SM10",
        skuCUIE: "INT-AIR-001",
        unit: "UNIDAD",
        power: "7.5kW",
        origin: "Alemania",
        isCertified: true
      },
      {
        name: "Transmisor de Presión Danfoss MBS 3000",
        brand: "DANFOSS",
        category: "INSTRUM.",
        model: "MBS3000",
        description: "Sensor compacto para aplicaciones industriales hidráulicas.",
        price: 245.00,
        stock: 10,
        skuCUIM: "SUNAT-INS-DAN-MBS",
        skuCUIE: "INT-INS-001",
        unit: "UNIDAD",
        isCertified: true
      },
      {
        name: "Inversor Solar SMA Sunny Boy 5.0",
        brand: "SMA",
        category: "ENERGÍA",
        model: "SB5.0",
        description: "Inversor de red para sistemas fotovoltaicos residenciales y comerciales.",
        price: 1950.00,
        stock: 4,
        skuCUIM: "SUNAT-ENE-SMA-SB5",
        skuCUIE: "INT-ENE-001",
        unit: "UNIDAD",
        origin: "Alemania",
        isCertified: true
      },
      {
        name: "Panel Solar Jinko Tiger 450W Mono",
        brand: "JINKO",
        category: "ENERGÍA",
        model: "TIGER-450",
        description: "Panel monocristalino de alta eficiencia.",
        price: 185.00,
        stock: 120,
        skuCUIM: "SUNAT-ENE-JIN-450",
        skuCUIE: "INT-ENE-002",
        unit: "UNIDAD",
        material: "Silicio Monocristalino",
        isCertified: true
      },
      {
        name: "Rodamiento SKF 6204-2Z",
        brand: "SKF",
        category: "RODAMIENTOS",
        model: "6204-2Z",
        description: "Rodamiento rígido de bolas con sellado metálico.",
        price: 12.50,
        stock: 150,
        skuCUIM: "SUNAT-ROD-SKF-6204",
        skuCUIE: "INT-ROD-001",
        unit: "UNIDAD",
        material: "Acero Cromo",
        origin: "Suecia",
        isCertified: true
      },
      {
        name: "Correa de Transmisión Gates 5VX800",
        brand: "GATES",
        category: "TRANSMISIÓN",
        model: "5VX800",
        description: "Correa dentada de alta capacidad de carga.",
        price: 45.00,
        stock: 60,
        skuCUIM: "SUNAT-TRA-GAT-5VX",
        skuCUIE: "INT-TRA-001",
        unit: "UNIDAD",
        material: "EPDM",
        isCertified: true
      },
      {
        name: "Filtro Hidráulico Donaldson P550440",
        brand: "DONALDSON",
        category: "FILTRACIÓN",
        model: "P550440",
        description: "Filtro de aceite para maquinaria pesada.",
        price: 36.50,
        stock: 40,
        skuCUIM: "SUNAT-FIL-DON-P55",
        skuCUIE: "INT-FIL-001",
        unit: "UNIDAD",
        isCertified: true
      },
      {
        name: "Codo Acero TUPY 90 Grados 2\" NPT",
        brand: "TUPY",
        category: "FITTING",
        model: "90-ELBOW",
        description: "Codo de hierro maleable para instalaciones de gas y vapor.",
        price: 18.20,
        stock: 80,
        skuCUIM: "SUNAT-FIT-TUP-C2",
        skuCUIE: "INT-FIT-001",
        unit: "UNIDAD",
        material: "Hierro Maleable",
        origin: "Brasil",
        isCertified: true
      }
    ];

    // 3. Ejecutar la siembra usando el servicio robusto (v6.0)
    // El servicio se encarga de crear en el Maestro y vincular al Inquilino.
    const result = await catalogService.bulkCreateProducts(tenant.id, productsData);

    return NextResponse.json({
      success: true,
      message: `Carga uniforme completada: 20 productos industriales sembrados en Maestro y vinculados a ${tenant.company_name}.`,
      tenantId: tenant.id,
      count: result.length
    });

  } catch (error: any) {
    console.error('Error en ejecución de siembra:', error);
    return NextResponse.json({ 
      error: error.message,
      details: 'Verifica la integridad de la base de datos y los permisos de Supabase.' 
    }, { status: 500 });
  }
}
