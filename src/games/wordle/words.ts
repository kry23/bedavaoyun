// Türkçe 5 harfli kelime listesi
// Günlük kelime seçimi ve tahmin doğrulama için kullanılır
const WORDS: string[] = [
  // A
  "ACABA", "ACELE", "ADAMA", "ADANA", "ADIMI", "ADRES", "AFYON", "AHMET",
  "AKICI", "AKŞAM", "ALARM", "ALBÜM", "ALENİ", "ALÇAK", "ALTIN", "ANLAM",
  "ARABA", "ARACI", "ARAZI", "ARENA", "ARIZA", "ARMUT", "ASKER", "AŞAMA",
  "AŞURE", "ATAMA", "ATLAS", "AVANS", "AYDIN", "AYLIK", "AYRAN", "AYRIM",
  // B
  "BACAK", "BAĞIR", "BAĞLI", "BAHÇE", "BAKAN", "BAKIR", "BAKLA", "BALIK",
  "BALTA", "BANKA", "BARAJ", "BARUT", "BASIK", "BASIM", "BASIN", "BAŞAK",
  "BAŞAR", "BAŞKA", "BAYAT", "BAYIR", "BEBEK", "BEDEN", "BEKAR", "BEKÇI",
  "BELGİ", "BENİM", "BEŞER", "BEŞIK", "BEYAZ", "BİLEK", "BİLET", "BİLGİ",
  "BİNEK", "BİRİM", "BİTKİ", "BÖCEK", "BOĞAZ", "BOMBA", "BORSA", "BOYLU",
  "BOYUN", "BOYUT", "BOZUK", "BÖLGE", "BÖLÜK", "BUÇUK", "BUĞRA", "BUKET",
  "BULUT", "BUNAK", "BURUN", "BURSA", "BÜYÜK",
  // C - Ç
  "CADDE", "CAHİL", "CANIM", "CANLI", "CEKET", "CEVİZ", "ÇADIR", "ÇAĞRI",
  "ÇAKIL", "ÇAMUR", "ÇANAK", "ÇANTA", "ÇARŞI", "ÇATAL", "ÇEKİM", "ÇELİK",
  "ÇEŞME", "ÇEVRE", "ÇIÇEK", "ÇIKAR", "ÇIKTI", "ÇIRAK", "ÇİFTE", "ÇİLEK",
  "ÇİMEN", "ÇİZGİ", "ÇİZME", "ÇOBAN", "ÇOCUK", "ÇOĞUL", "ÇORAP", "ÇÖZÜM",
  "ÇUKUR",
  // D
  "DAĞCI", "DAHİL", "DAİMA", "DAİRE", "DALGA", "DAMAR", "DAMLA", "DARBE",
  "DAVET", "DEĞER", "DEMİR", "DEMİN", "DENEY", "DENİZ", "DERİN", "DEVAM",
  "DEVİR", "DİKEN", "DİKİŞ", "DİLEK", "DİLİM", "DİNAR", "DİREK", "DİŞÇİ",
  "DİZEL", "DİZİN", "DOĞAL", "DOĞAN", "DOĞRU", "DOĞUM", "DOLAP", "DOLAR",
  "DOLGU", "DOLMA", "DONUK", "DORUK", "DÖNME", "DÖNER", "DÖVME", "DÜDÜK",
  "DÜMEN", "DÜRÜM", "DÜNYA", "DÜŞÜK", "DÜŞÜN", "DÜZEN",
  // E
  "EKİBİ", "EKSİK", "ELMAS", "EMSAL", "EMZİK", "ERGEN", "ERKEN", "ESMER",
  "EŞARP", "EŞLİK", "ETKİN", "EVLAT", "EVRAK",
  // F
  "FAKİR", "FALCI", "FAYDA", "FELAK", "FENER", "FETİŞ", "FETVA", "FİDAN",
  "FİKİR", "FİNAL", "FİYAT", "FLORA", "FORUM",
  // G
  "GALİP", "GARİP", "GECİT", "GELEN", "GENEL", "GENİŞ", "GEYİK", "GİDER",
  "GİRİŞ", "GİZLİ", "GÖBEK", "GÖÇÜK", "GÖLGE", "GÖĞÜS", "GONCA", "GÖREV",
  "GÖRÜŞ", "GÖZDE", "GÜÇLÜ", "GÜLME", "GÜMÜŞ", "GÜNAH", "GÜNEŞ", "GURUR",
  "GÜVEN", "GÜZEL",
  // H
  "HABER", "HAFİF", "HAFTA", "HAKİM", "HAKLI", "HALAT", "HALEN", "HAMAL",
  "HAMAM", "HAMİL", "HAMUR", "HANIM", "HARAP", "HARİÇ", "HASAR", "HASTA",
  "HAYAL", "HAYAT", "HAYDİ", "HAZIR", "HEDEF", "HESAP", "HİNDİ", "HİSSE",
  "HIZLI", "HOROZ", "HUKUK", "HURDA", "HURMA",
  // I - İ
  "ILICA", "İBRET", "İÇMEK", "İFADE", "İHBAR", "İHMAL", "İKAME", "İKLİM",
  "İLAVE", "İLERİ", "İLGİN", "İLHAM", "İMDAT", "İMKAN", "İNANÇ", "İNCİR",
  "İNSAN", "İPLİK", "İPTAL", "İSTEK", "İŞLEM", "İZLEM", "İZMİR",
  // J - K
  "JAPON", "KABAK", "KABİN", "KABLO", "KAÇAK", "KAÇIŞ", "KADEH", "KADER",
  "KADIN", "KADRO", "KAFES", "KAĞIT", "KAHVE", "KALAN", "KALBİ", "KALÇA",
  "KALEM", "KAMÇI", "KANAL", "KANAT", "KANIT", "KANUN", "KAPAK", "KAPAN",
  "KARAR", "KARGA", "KARGO", "KARLI", "KARMA", "KARŞI", "KAŞIK", "KATİL",
  "KAVAK", "KAVGA", "KAVUN", "KAYAK", "KAYIP", "KAYMA", "KAZAK", "KAZMA",
  "KEFAL", "KEFİR", "KEMİK", "KENET", "KENAR", "KESİK", "KESİN", "KESME",
  "KETEN", "KILIM", "KIRAZ", "KIRIK", "KISIM", "KIŞIN", "KIŞLA", "KİLİT",
  "KİTAP", "KIYMA", "KLİMA", "KLİŞE", "KOÇAN", "KOLAY", "KOMBİ", "KOMUT",
  "KONUM", "KOPYA", "KORKU", "KORUK", "KOŞUL", "KÖFTE", "KÖMÜR", "KÖPEK",
  "KÖYLÜ", "KREMA", "KUKLA", "KULAÇ", "KUMLU", "KURAL", "KURDU", "KURUM",
  "KUŞAK", "KUTUP", "KUZEY", "KÜÇÜK", "KÜREK",
  // L
  "LAMBA", "LATİN", "LAZER", "LEVHA", "LİDER", "LİMAN", "LİMON", "LİSAN",
  "LİSTE", "LOKMA",
  // M
  "MADEN", "MADDE", "MAHAL", "MAKAM", "MAKAS", "MAKRO", "MANDA", "MANGA",
  "MARKA", "MARTI", "MARUL", "MASAL", "MAYIS", "MEKAN", "MELEK", "MERAK",
  "MERMİ", "MESAJ", "MEŞRU", "METAL", "METİN", "METRO", "MİDYE", "MİLAT",
  "MİLLİ", "MIRAS", "MISIR", "MODEL", "MOLLA", "MORAL", "MOTOR", "MUHAL",
  "MUSKA", "MUTLU", "MÜDÜR", "MÜJDE", "MÜZİK",
  // N
  "NADİR", "NAKİL", "NAMUS", "NARİN", "NASIL", "NEDEN", "NEHİR", "NESİL",
  "NESNE", "NİKAH", "NİMET", "NİŞAN", "NİTEL", "NÖBET",
  // O - Ö
  "OKUMA", "OLMAK", "OLMAZ", "OMLET", "ONLAR", "ORGAN", "ORMAN", "ORTAK",
  "ORTAM", "OTÇUL", "OYNAK", "ÖZGÜR", "ÖZLEM",
  // P
  "PAKET", "PAMUK", "PANEL", "PANİK", "PARÇA", "PARKE", "PARTİ", "PASTA",
  "PATİK", "PİLAV", "PİLOT", "PLAKA", "PLATO", "POLİS", "PRENS", "PROJE",
  // R
  "RADAR", "RADYO", "RAHAT", "RAKAM", "RAKİP", "RANZA", "RAPOR", "RECEP",
  "REÇEL", "REHİN", "RESİM", "ROBOT", "ROMAN", "RUGAN",
  // S - Ş
  "SABAN", "SABAH", "SABİR", "SABİT", "SAÇAK", "SAÇMA", "SAHİL", "SAHNE",
  "SAKIN", "SAKIZ", "SALON", "SANAT", "SAPAN", "SARAY", "SARMA", "SATIN",
  "SAVAŞ", "SEBEP", "SEÇİM", "SEÇKİ", "SEFER", "SEHPA", "SELAM", "SENİN",
  "SERGİ", "SERİN", "SICAK", "SIFIR", "SINAV", "SINIF", "SINIR", "SİLAH",
  "SİMİT", "SİNİR", "SİPER", "SİVİL", "SOFRA", "SOĞAN", "SOĞUK", "SOKAK",
  "SOMUN", "SONUÇ", "SORUN", "SÖZLÜ", "SULAK", "SURAT", "SÜPER", "SÜREÇ",
  "SÜRGÜ", "SÜRÜŞ", "SÜZME", "ŞAFAK", "ŞANLI", "ŞARAP", "ŞARKI", "ŞEHİR",
  "ŞEKİL", "ŞEKER", "ŞİFRE", "ŞURUP",
  // T
  "TABAK", "TABLO", "TABUR", "TAKIM", "TAKİP", "TALEP", "TAMAM", "TAMİR",
  "TANIK", "TANRI", "TARAF", "TARİH", "TARLA", "TATİL", "TAVIR", "TAVUK",
  "TEKEL", "TEKER", "TEKİN", "TEMEL", "TEMİZ", "TEPSİ", "TERFİ", "TERÖR",
  "TERZİ", "TESİS", "TOHUM", "TOPAK", "TOPUK", "TORBA", "TUĞLA", "TULUM",
  "TUZAK", "TUZLU", "TUTUŞ", "TÜRKÜ",
  // U - Ü
  "UÇMAK", "UÇUCU", "UĞRAK", "UMUMI", "URGAN", "UYARI", "UYGUN", "UYMAK",
  "UYUMA", "UZMAN", "ÜÇGEN", "ÜNLEM",
  // V
  "VAKİF", "VAKİT", "VAPUR", "VASAT", "VATAN", "VERGİ",
  // Y
  "YAKIN", "YAKIT", "YAKUT", "YALAN", "YALIN", "YANIK", "YAPMA", "YARIM",
  "YARIN", "YARIŞ", "YASAL", "YAŞAM", "YAŞLI", "YATAK", "YAVRU", "YAZAR",
  "YEMEK", "YENİK", "YEŞİL", "YETKİ", "YOKSA", "YOĞUN", "YOLCU", "YORUM",
  "YOSUN", "YÜZDE",
  // Z
  "ZAMAN", "ZARAR", "ZAYIF", "ZEHİR", "ZEMİN", "ZİHİN", "ZIRVA",
];

// Sadece tam 5 harfli kelimeleri filtrele (güvenlik kontrolü)
export const VALID_WORDS = WORDS.filter((w) => w.length === 5);
