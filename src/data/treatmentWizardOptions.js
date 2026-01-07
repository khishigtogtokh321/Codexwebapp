export const wizardTreatmentTypes = [
  { id: 'exam', label: 'Exam', surfaceRequired: false },
  { id: 'xray', label: 'X-Ray', surfaceRequired: false },
  { id: 'prophy-fl', label: 'Prophy/Fl', surfaceRequired: true },
  { id: 'period-srp', label: 'Period/SRP', surfaceRequired: true },
  { id: 'composite', label: 'Composite', surfaceRequired: true },
  { id: 'amalgam', label: 'Amalgam', surfaceRequired: true },
  { id: 'crown', label: 'Crowns', surfaceRequired: true },
  { id: 'build-up', label: 'Build up/ Pins', surfaceRequired: true },
  { id: 'extraction', label: 'Extraction', surfaceRequired: true },
  { id: 'bridge-abutment', label: 'Bridge Abutment', surfaceRequired: true },
  { id: 'bridge-pontic', label: 'Bridge Pontic', surfaceRequired: true },
  { id: 'inlay-onlay', label: 'Inlay Onlay', surfaceRequired: true },
  { id: 'root-canal', label: 'Root Canal', surfaceRequired: true },
  { id: 'pulpotomy', label: 'Pulp Procedure', surfaceRequired: true },
  { id: 'denture', label: 'Denture', surfaceRequired: true },
  { id: 'partial-denture', label: 'Partial Denture', surfaceRequired: true },
]

export const treatmentCodesByType = {
  exam: [
    { code: 'D0120', name: 'Periodic oral evaluation' },
    { code: 'D0140', name: 'Limited oral evaluation' },
  ],
  xray: [
    { code: 'D0210', name: 'Intraoral complete series' },
    { code: 'D0220', name: 'Periapical first film' },
  ],
  'prophy-fl': [
    { code: 'D1110', name: 'Adult prophylaxis' },
    { code: 'D1206', name: 'Topical fluoride' },
  ],
  'period-srp': [
    { code: 'D4341', name: 'SRP 4+ teeth' },
    { code: 'D4342', name: 'SRP 1-3 teeth' },
  ],
  composite: [
    { code: 'D2391', name: 'Resin 1 surface', paintType: 6 },
    { code: 'D2392', name: 'Resin 2 surfaces', paintType: 6 },
    { code: 'D2393', name: 'Resin 3 surfaces', paintType: 6 },
  ],
  amalgam: [
    { code: 'D2140', name: 'Amalgam 1 surface', paintType: 6 },
    { code: 'D2150', name: 'Amalgam 2 surfaces', paintType: 6 },
  ],
  crown: [
    { code: 'D2750', name: 'Crown porcelain/metal', paintType: 7 },
    { code: 'D2752', name: 'Crown fused to metal', paintType: 7 },
    { code: 'D2790', name: 'Full gold crown', paintType: 7 },
  ],
  'build-up': [
    { code: 'D2950', name: 'Core buildup', paintType: 6 },
    { code: 'D2954', name: 'Post and core', paintType: 6 },
  ],
  extraction: [
    { code: 'D7140', name: 'Extraction erupted', paintType: 1 },
    { code: 'D7210', name: 'Surgical extraction', paintType: 1 },
    { code: 'D7240', name: 'Impacted extraction', paintType: 1 },
  ],
  'bridge-abutment': [
    { code: 'D6750', name: 'Crown abutment', paintType: 7 },
  ],
  'bridge-pontic': [
    { code: 'D6240', name: 'Pontic porcelain', paintType: 7 },
  ],
  'inlay-onlay': [
    { code: 'D2650', name: 'Inlay 1 surface', paintType: 6 },
  ],
  'root-canal': [
    { code: 'D3310', name: 'Endo anterior', paintType: 3 },
    { code: 'D3320', name: 'Endo premolar', paintType: 3 },
    { code: 'D3330', name: 'Endo molar', paintType: 3 },
  ],
  pulpotomy: [
    { code: 'D3220', name: 'Therapeutic pulpotomy', paintType: 3 },
  ],
  denture: [
    { code: 'D5110', name: 'Complete denture maxillary' },
    { code: 'D5120', name: 'Complete denture mandibular' },
  ],
  'partial-denture': [
    { code: 'D5213', name: 'Maxillary partial metal' },
    { code: 'D5214', name: 'Mandibular partial metal' },
  ],
}

export default wizardTreatmentTypes
