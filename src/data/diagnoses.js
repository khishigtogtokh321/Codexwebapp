/**
 * Dental diagnosis codes and names
 * Based on ICD-10 codes commonly used in dental practice
 */

export const diagnoses = [
  // Dental caries
  { code: 'K02.0', name: 'Эмалийн цоорлого / Caries limited to enamel' },
  { code: 'K02.1', name: 'Дентины цоорлого / Caries of dentine' },
  { code: 'K02.2', name: 'Цементийн цоорлого / Caries of cementum' },
  { code: 'K02.3', name: 'Зогссон цоорлого / Arrested dental caries' },
  { code: 'K02.8', name: 'Бусад цоорлого / Other dental caries' },
  { code: 'K02.9', name: 'Тодорхойгүй цоорлого / Dental caries, unspecified' },

  // Pulp and periapical diseases
  { code: 'K04.0', name: 'Пульпит / Pulpitis' },
  { code: 'K04.1', name: 'Сувагт хүрсэн цоорлого / Necrosis of pulp' },
  { code: 'K04.2', name: 'Пульпын дегенераци / Pulp degeneration' },
  { code: 'K04.4', name: 'Шүдний үндэсний хавдар / Acute apical periodontitis' },
  { code: 'K04.5', name: 'Архаг periodontitis / Chronic apical periodontitis' },
  { code: 'K04.6', name: 'Шүдний үндэсний цүрхэл / Periapical abscess' },
  { code: 'K04.7', name: 'Шүдний үндэсний кист / Periapical abscess without sinus' },
  { code: 'K04.8', name: 'Үндэсний бусад өвчин / Radicular cyst' },

  // Gingivitis and periodontal diseases
  { code: 'K05.0', name: 'Цочмог буйлны үрэвсэл / Acute gingivitis' },
  { code: 'K05.1', name: 'Архаг буйлны үрэвсэл / Chronic gingivitis' },
  { code: 'K05.2', name: 'Цочмог periodontitis / Acute periodontitis' },
  { code: 'K05.3', name: 'Архаг periodontitis / Chronic periodontitis' },
  { code: 'K05.4', name: 'Periodontosis' },
  { code: 'K05.5', name: 'Бусад periodontal өвчин / Other periodontal diseases' },

  // Disorders of gingiva and edentulous ridge
  { code: 'K06.0', name: 'Буйлны татрал / Gingival recession' },
  { code: 'K06.1', name: 'Буйлны томрол / Gingival enlargement' },
  { code: 'K06.2', name: 'Буйлны гэмтэл / Gingival and edentulous lesions' },
  { code: 'K06.8', name: 'Буйлны бусад өвчин / Other specified disorders' },

  // Dentofacial anomalies
  { code: 'K07.0', name: 'Эрүүний хөгжлийн эмгэг / Major anomalies of jaw size' },
  { code: 'K07.1', name: 'Эрүү, суурийн харилцааны эмгэг / Anomalies of jaw-cranial base' },
  { code: 'K07.2', name: 'Шүдний багцын эмгэг / Anomalies of dental arch relationship' },
  { code: 'K07.3', name: 'Шүдний байрлалын эмгэг / Anomalies of tooth position' },
  { code: 'K07.4', name: 'Зөв бус хазуулалт / Malocclusion, unspecified' },

  // Other disorders
  { code: 'K08.0', name: 'Шүд унасан (гэмтлийн улмаас) / Exfoliation of teeth' },
  { code: 'K08.1', name: 'Шүд алдах (осол, эрүүгийн өвчний улмаас) / Loss of teeth' },
  { code: 'K08.2', name: 'Alveolar ridge атрофи / Atrophy of edentulous ridge' },
  { code: 'K08.3', name: 'Шүдний үндэс үлдэх / Retained dental root' },
  { code: 'K08.8', name: 'Бусад шүд, дэмжих бүтцийн эмгэг / Other specified disorders' },

  // Cysts of oral region
  { code: 'K09.0', name: 'Хөгжлийн одонтоген кист / Developmental odontogenic cysts' },
  { code: 'K09.1', name: 'Хөгжлийн бус одонтоген кист / Non-odontogenic cysts' },
  { code: 'K09.2', name: 'Бусад эрүүний кист / Other cysts of jaw' },

  // Other diseases
  { code: 'K10.2', name: 'Эрүүний үрэвсэл / Inflammatory conditions of jaws' },
  { code: 'K10.3', name: 'Эрүүний цооролт / Alveolitis of jaws' },
  { code: 'K11.2', name: 'Шүлсний булчирхайн үрэвсэл / Sialadenitis' },
  { code: 'K12.0', name: 'Амны хөндийн цүрхэл / Recurrent oral aphthae' },
  { code: 'K13.0', name: 'Уруулын өвчин / Diseases of lips' },
]

export default diagnoses
