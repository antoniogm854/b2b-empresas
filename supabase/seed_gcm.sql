-- Seed Data for Global Catalog Master (GCM)

INSERT INTO global_catalog_master (name, brand, model, category, technical_specs)
VALUES 
('Motor Eléctrico Trifásico 10HP', 'Siemens', '1LE1001-1AB4', 'Motores', '{"power": "10HP", "voltage": "230/460V", "rpm": 1750, "frame": "215T", "enclosure": "TEFC"}'),
('Válvula de Bola 2" Acero Inoxidable', 'Genebre', '2014', 'Valvulería', '{"size": "2 inch", "material": "SS316", "pressure": "1000 WOG", "temp_range": "-25ºC to 180ºC"}'),
('Rodamiento de Bolas 6205-2Z', 'SKF', '6205-2Z', 'Transmisión', '{"id": "25mm", "od": "52mm", "width": "15mm", "sealing": "Double Shielded"}'),
('Variador de Frecuencia 5.5kW', 'ABB', 'ACS380', 'Automatización', '{"power": "5.5kW", "input": "3-phase", "control": "Vector Control", "ip_rating": "IP20"}'),
('Bomba Centrífuga Monobloc 2HP', 'Pedrollo', 'CP 170', 'Bombeo', '{"power": "2HP", "flow_rate": "120 L/min", "head": "35m", "port_size": "1.25 inch"}');
