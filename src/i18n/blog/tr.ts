import type { BlogPost } from "@/lib/blog";

export const blogPostsTr: BlogPost[] = [
  {
    slug: "mayIn-tarlasi-nasil-oynanir",
    title: "Mayın Tarlası Nasıl Oynanır? İpuçları ve Stratejiler",
    description:
      "Mayın tarlası oyununu öğrenin. Başlangıç seviyesinden ileri seviyeye kadar stratejiler, ipuçları ve kazanma taktikleri.",
    date: "2026-02-20",
    category: "Rehber",
    content: `
<h2>Mayın Tarlası Nedir?</h2>
<p>Mayın Tarlası, 1989'dan beri bilgisayarlarda bulunan klasik bir bulmaca oyunudur. Amaç, mayın olmayan tüm kareleri açmaktır. Bir mayına tıklarsanız oyunu kaybedersiniz.</p>

<h2>Temel Kurallar</h2>
<ul>
  <li><strong>Sol tık:</strong> Kareyi açar</li>
  <li><strong>Sağ tık (veya uzun basma):</strong> Bayrak koyar/kaldırır</li>
  <li><strong>Sayılar:</strong> Etrafındaki 8 karede kaç mayın olduğunu gösterir</li>
  <li><strong>Boş kare:</strong> Etrafında mayın yoksa, komşu kareler otomatik açılır</li>
</ul>

<h2>Başlangıç Stratejileri</h2>
<ol>
  <li><strong>Köşeden başlayın:</strong> Köşeler genellikle daha fazla kare açar</li>
  <li><strong>1-1 deseni:</strong> Kenar boyunca yan yana iki "1" görürseniz, aralarındaki kareler güvenlidir</li>
  <li><strong>Bayrakları kullanın:</strong> Emin olduğunuz mayınları işaretleyin</li>
  <li><strong>Sayıları okuyun:</strong> Bir sayının etrafında yeterince bayrak varsa, kalan kareler güvenlidir</li>
</ol>

<h2>İleri Seviye Taktikler</h2>
<p>Deneyimli oyuncular "1-2-1", "1-2-2-1" gibi yaygın desenleri tanır. Bu desenleri öğrenmek çözüm sürenizi büyük ölçüde kısaltır.</p>
<p>Hız için en önemli şey: tereddüt etmeden hızlı kararlar vermektir. Desenleri ezberleyin ve otomatik refleksle oynayın.</p>
    `,
  },
  {
    slug: "2048-kazanma-taktikleri",
    title: "2048 Oyununda Kazanma Taktikleri",
    description:
      "2048 oyununda yüksek skor yapmanın sırları. Köşe stratejisi, birleştirme teknikleri ve sık yapılan hatalar.",
    date: "2026-02-20",
    category: "Rehber",
    content: `
<h2>2048 Nedir?</h2>
<p>2048, 4x4 bir ızgarada aynı sayılı karoları birleştirerek 2048'e ulaşmaya çalıştığınız bağımlılık yapıcı bir bulmaca oyunudur. Her hamlede tüm karolar bir yöne kayar ve yeni bir "2" veya "4" karosu eklenir.</p>

<h2>Köşe Stratejisi</h2>
<p>En etkili strateji, en büyük sayıyı bir köşede tutmaktır:</p>
<ol>
  <li>Bir köşe seçin (örneğin sol alt)</li>
  <li>En büyük sayıyı o köşede tutun</li>
  <li>Sadece 2-3 yönde hareket edin (köşeden uzaklaştırmayın)</li>
  <li>Alt satırı büyükten küçüğe sıralı tutun</li>
</ol>

<h2>Birleştirme İpuçları</h2>
<ul>
  <li>Küçük sayıları hızla birleştirin</li>
  <li>Büyük sayıları dağıtmayın, bir arada tutun</li>
  <li>Izgaranın dolmasını önleyin — her zaman boş kare bırakın</li>
  <li>Zincir birleştirmeler yapın: 2→4→8→16 tek hamlede</li>
</ul>

<h2>Sık Yapılan Hatalar</h2>
<ul>
  <li>Sürekli 4 yönde de hareket etmek (köşe stratejisini bozar)</li>
  <li>Büyük sayıları ortada bırakmak</li>
  <li>Küçük sayıları birleştirmeden büyük sayı peşinde koşmak</li>
</ul>
    `,
  },
  {
    slug: "wordle-turkce-kelime-tahmin-ipuclari",
    title: "Wordle Türkçe: Kelime Tahmin İpuçları",
    description:
      "Türkçe Wordle oyununda daha az tahminle doğru kelimeyi bulmanın yolları. İlk kelime önerileri ve eleme stratejileri.",
    date: "2026-02-20",
    category: "Rehber",
    content: `
<h2>Wordle Nedir?</h2>
<p>Wordle, 5 harfli gizli bir kelimeyi 6 denemede bulmaya çalıştığınız popüler bir kelime oyunudur. Her tahmin sonrasında harflerin renkleri ipucu verir:</p>
<ul>
  <li><strong style="color: #22c55e;">Yeşil:</strong> Harf doğru yerde</li>
  <li><strong style="color: #eab308;">Sarı:</strong> Harf kelimede var ama yanlış yerde</li>
  <li><strong style="color: #6b7280;">Gri:</strong> Harf kelimede yok</li>
</ul>

<h2>İlk Kelime Seçimi</h2>
<p>İlk kelime çok önemlidir. İyi bir ilk kelime:</p>
<ul>
  <li>Sık kullanılan harfler içermeli (A, E, R, İ, L, N, K)</li>
  <li>Tekrar eden harf olmamalı</li>
  <li>Öneriler: <strong>KALİN</strong>, <strong>SERİN</strong>, <strong>METAL</strong></li>
</ul>

<h2>Eleme Stratejisi</h2>
<ol>
  <li>İlk 2 tahminde mümkün olduğunca çok harf deneyin</li>
  <li>Sarı harfleri farklı pozisyonlarda deneyin</li>
  <li>Gri harfleri bir daha kullanmayın</li>
  <li>Türkçe'ye özgü harfleri unutmayın: Ç, Ğ, İ, Ö, Ş, Ü</li>
</ol>

<h2>İleri Seviye</h2>
<p>3 tahminde çözmek için: ilk iki kelimeyle 10 farklı harfi deneyin. Kalan tahminlerde bilinen harfleri doğru yere yerleştirin. Türkçe'de yaygın kelime kalıplarını öğrenin (ör. -MEK, -LIK, -SIZ son ekleri).</p>
    `,
  },
  {
    slug: "tarayici-oyunlari-tarihi",
    title: "Tarayıcı Oyunlarının Kısa Tarihi",
    description:
      "Flash'tan HTML5'e: tarayıcı oyunlarının evrimi. Klasik oyunlar nasıl modern web teknolojileriyle yeniden hayat buldu?",
    date: "2026-02-20",
    category: "Makale",
    content: `
<h2>Flash Çağı (1996-2020)</h2>
<p>Tarayıcı oyunlarının altın çağı Adobe Flash ile başladı. Miniclip, Newgrounds ve Armor Games gibi siteler milyonlarca oyuncuya ev sahipliği yaptı. Flash, zengin animasyonlar ve interaktif içerik oluşturmayı kolaylaştırdı.</p>

<h2>Flash'ın Sonu</h2>
<p>Güvenlik açıkları, mobil uyumsuzluk ve performans sorunları nedeniyle Flash yavaş yavaş terk edildi. Steve Jobs'ın 2010'daki ünlü "Thoughts on Flash" mektubu, mobil cihazlarda Flash'ı desteklememe kararını açıkladı. Adobe, 2020'de Flash'ı tamamen sonlandırdı.</p>

<h2>HTML5 Devrimi</h2>
<p>HTML5 Canvas, WebGL ve Web Audio API gibi teknolojiler, Flash'ın bıraktığı boşluğu doldurdu. Artık eklenti gerektirmeden, doğrudan tarayıcıda yüksek performanslı oyunlar çalışabiliyor.</p>

<h2>Günümüz</h2>
<p>Modern tarayıcı oyunları, masaüstü oyunlarıyla yarışacak kalitede. WebAssembly ile C++ oyun motorları bile tarayıcıda çalışabiliyor. PWA desteği sayesinde tarayıcı oyunları artık telefonunuza uygulama gibi yüklenebiliyor.</p>

<p>Bedava Oyun olarak biz de bu geleneği sürdürüyor, klasik bulmaca oyunlarını modern web teknolojileriyle ücretsiz sunuyoruz.</p>
    `,
  },
  {
    slug: "sudoku-nasil-cozulur",
    title: "Sudoku Nasıl Çözülür? Başlangıçtan Uzmanlığa Rehber",
    description:
      "Sudoku çözme teknikleri: temel kurallar, tarama yöntemi, ikili eleme ve ileri seviye stratejiler. Adım adım rehber.",
    date: "2026-02-20",
    category: "Rehber",
    content: `
<h2>Sudoku Nedir?</h2>
<p>Sudoku, 9x9'luk bir ızgarayı 1-9 arası sayılarla doldurduğunuz bir mantık bulmacasıdır. Her satır, her sütun ve her 3x3'lük kutu 1'den 9'a kadar tüm sayıları tam olarak bir kez içermelidir.</p>

<h2>Temel Teknikler</h2>

<h3>1. Tarama Yöntemi (Scanning)</h3>
<p>En basit teknik: bir sayıyı seçin (örneğin 1) ve tüm ızgarada nereye yerleşebileceğini kontrol edin. Satır ve sütundaki mevcut sayılar, olası yerleri daraltır.</p>

<h3>2. Tek Aday (Naked Single)</h3>
<p>Bir hücrede sadece tek bir sayı mümkünse, o sayı oraya yerleşir. Hücrenin satır, sütun ve kutusundaki mevcut sayıları eleyin — geriye tek sayı kalırsa cevap odur.</p>

<h3>3. Gizli Tek (Hidden Single)</h3>
<p>Bir satır, sütun veya kutuda bir sayı sadece tek bir hücreye yerleşebiliyorsa, o hücrede başka adaylar olsa bile o sayı oraya yerleşir.</p>

<h2>Orta Seviye Teknikler</h2>

<h3>İkili Eleme (Naked Pairs)</h3>
<p>Bir satır/sütun/kutuda iki hücre aynı iki adaya sahipse, bu iki sayı o bölgedeki diğer hücrelerden elenebilir.</p>

<h3>Not Alma</h3>
<p>Zor bulmacalarda her hücreye olası sayıları küçük notlar olarak yazın. Bu, desenleri görmenizi kolaylaştırır. Bedava Oyun'daki Sudoku oyunumuzda "Not" modu tam olarak bunu yapar!</p>

<h2>İpuçları</h2>
<ul>
  <li>Kolay bulmacalarla başlayın ve teknik repertuarınızı genişletin</li>
  <li>Tahmin etmeyin — Sudoku tamamen mantık oyunudur</li>
  <li>En çok ipucu olan satır/sütun/kutudan başlayın</li>
  <li>Düzenli pratik yapın — hız zamanla gelir</li>
</ul>
    `,
  },
  {
    slug: "yilan-oyunu-yuksek-skor",
    title: "Yılan Oyunu: Yüksek Skor Yapmanın 7 Sırrı",
    description:
      "Yılan oyununda uzun süre hayatta kalmanın ve yüksek skor yapmanın püf noktaları. Nokia'dan günümüze yılan oyunu stratejileri.",
    date: "2026-02-20",
    category: "Rehber",
    content: `
<h2>Yılan Oyunun Tarihi</h2>
<p>Yılan oyunu, 1997'de Nokia 6110 telefonuyla dünyaca ünlü oldu. Basit ama bağımlılık yapıcı mekaniğiyle tüm zamanların en çok oynanan mobil oyunlarından biri. Bugün tarayıcıda ücretsiz oynayabilirsiniz!</p>

<h2>7 Yüksek Skor Stratejisi</h2>

<h3>1. Kenarları Kullanın</h3>
<p>Oyunun başında harita boşken ortada dolaşın. Yılan uzadıkça kenarlara yaklaşın ve duvar boyunca ilerleyin. Bu, çarpışma riskini azaltır.</p>

<h3>2. Spiral Desen</h3>
<p>Haritanın dışından içine doğru spiral çizin. Bu, alanı sistematik olarak tarar ve kuyruğunuza çarpma riskinizi minimize eder.</p>

<h3>3. Yemi Hemen Kovalamayın</h3>
<p>Yem uzaktaysa, doğrudan koşmak yerine güvenli bir rota planlayın. Acele etmek en sık ölüm nedenidir.</p>

<h3>4. Kaçış Yolu Bırakın</h3>
<p>Kendinizi köşeye sıkıştırmayın. Her zaman en az bir kaçış rotanız olsun. Kuyruğunuzun nereye gittiğini sürekli kontrol edin.</p>

<h3>5. Hız Kontrolü</h3>
<p>Oyunumuzda her 5 yemde hız artar. Yüksek hızlarda daha dikkatli olun ve daha az riskli hamleler yapın.</p>

<h3>6. Boşluk Yönetimi</h3>
<p>Haritayı zihinsel olarak bölgelere ayırın. Bir bölgeyi "doldurduktan" sonra diğerine geçin. Bu, uzun yılanla sıkışmayı önler.</p>

<h3>7. Pratik, Pratik, Pratik</h3>
<p>Yılan oyunu refleks ve örüntü tanıma gerektirir. Ne kadar çok oynarsanız, tehlikeli durumları o kadar hızlı fark edersiniz.</p>

<h2>Kontroller</h2>
<ul>
  <li><strong>Masaüstü:</strong> Ok tuşları veya WASD</li>
  <li><strong>Mobil:</strong> Ekranda kaydırma (swipe)</li>
</ul>
    `,
  },
  {
    slug: "hafiza-oyunu-beyni-guclendirme",
    title: "Hafıza Oyunları Beyni Nasıl Güçlendirir?",
    description:
      "Hafıza oyunlarının bilimsel faydaları: bellek güçlendirme, konsantrasyon artırma ve bilişsel gelişim. Araştırma sonuçları ve ipuçları.",
    date: "2026-02-20",
    category: "Makale",
    content: `
<h2>Hafıza Oyunları ve Beyin Sağlığı</h2>
<p>Hafıza oyunları (memory games), sadece eğlenceli değil, aynı zamanda bilimsel olarak kanıtlanmış bilişsel faydalara sahiptir. Düzenli oynandığında kısa süreli bellek, dikkat süresi ve görsel tanıma yeteneklerini geliştirir.</p>

<h2>Bilimsel Faydalar</h2>

<h3>1. Kısa Süreli Bellek Güçlenir</h3>
<p>Kart konumlarını hatırlamak, çalışan belleğinizi (working memory) aktif olarak kullanmanızı gerektirir. Bu düzenli egzersiz, günlük hayatta da hafızanızı güçlendirir.</p>

<h3>2. Konsantrasyon Artar</h3>
<p>Hangi kartın nerede olduğunu takip etmek, sürekli dikkat gerektirir. Bu beceri zamanla gelişir ve diğer alanlara da aktarılır: ders çalışma, iş toplantıları, kitap okuma.</p>

<h3>3. Görsel-Uzamsal Yetenek Gelişir</h3>
<p>Kartların konumlarını zihinsel olarak haritalamak, görsel-uzamsal zekanızı geliştirir. Bu yetenek matematik, mühendislik ve günlük navigasyonda kullanılır.</p>

<h3>4. Stres Azalır</h3>
<p>Bulmaca ve hafıza oyunları, beynin "akış" (flow) durumuna girmesini sağlar. Bu durum, stres hormonlarını azaltır ve ruh halini iyileştirir.</p>

<h2>En İyi Sonuçlar İçin</h2>
<ul>
  <li>Günde 10-15 dakika düzenli oynayın</li>
  <li>Zorluk seviyesini kademeli olarak artırın</li>
  <li>Sadece ezberlemeye değil, kart konumları arasında bağlantı kurmaya çalışın</li>
  <li>Farklı türde beyin oyunlarıyla çeşitlendirin</li>
</ul>

<h2>Tüm Yaş Grupları İçin</h2>
<p>Hafıza oyunları çocuklardan yaşlılara herkes için faydalıdır. Çocuklarda bilişsel gelişimi destekler, yetişkinlerde zihinsel keskinliği korur, yaşlılarda bilişsel gerilemeyi yavaşlatabilir.</p>
    `,
  },
  {
    slug: "en-iyi-ucretsiz-tarayici-oyunlari-2026",
    title: "2026'nın En İyi Ücretsiz Tarayıcı Oyunları",
    description:
      "2026'da oynayabileceğiniz en iyi ücretsiz tarayıcı oyunları listesi. İndirme gerektirmeyen, mobil uyumlu online oyunlar.",
    date: "2026-02-20",
    category: "Liste",
    content: `
<h2>Tarayıcı Oyunları Neden Hâlâ Popüler?</h2>
<p>İndirme gerektirmez, kayıt olmadan oynanabilir, her cihazda çalışır. İşte 2026'da oynayabileceğiniz en iyi ücretsiz tarayıcı oyunları:</p>

<h2>Bulmaca Oyunları</h2>

<h3>1. Sudoku</h3>
<p>Sayı bulmacasının kralı. 9x9 ızgarayı 1-9 sayılarıyla doldurmanız gereken bu oyun, mantık ve sabır gerektirir. Kolay'dan Zor'a üç seviye ile herkes için uygundur.</p>

<h3>2. Mayın Tarlası (Minesweeper)</h3>
<p>Windows'un efsanevi oyunu artık tarayıcınızda. Sayıları okuyarak mayınları tespit edin, tüm güvenli kareleri açın. Mobil cihazlarda uzun basma ile bayrak koyabilirsiniz.</p>

<h3>3. 2048</h3>
<p>Karoları kaydırarak aynı sayıları birleştirin ve 2048'e ulaşın. Basit kurallar, derin strateji. Bir "daha bir oyun" diyeceğiniz garanti.</p>

<h3>4. Kelime Tahmin (Wordle)</h3>
<p>Türkçe 5 harfli kelimeyi 6 denemede bulun. Her gün yeni bir kelime! Arkadaşlarınızla paylaşarak yarışabilirsiniz.</p>

<h2>Arcade Oyunları</h2>

<h3>5. Yılan (Snake)</h3>
<p>Nokia'dan tanıdığınız klasik. Yemleri yiyin, büyüyün ama kendi kuyruğunuza çarpmayın. Basit ama son derece bağımlılık yapıcı.</p>

<h3>6. Hafıza Oyunu (Memory)</h3>
<p>Kartları eşleştirerek hafızanızı test edin. Üç zorluk seviyesi: 6, 8 veya 12 çift kart. Hem eğlenceli hem beyin geliştirici.</p>

<h2>Nerede Oynayabilirim?</h2>
<p>Tüm bu oyunları <strong>bedava-oyun.com</strong> adresinde ücretsiz oynayabilirsiniz. Kayıt gerektirmez, reklamsızdır ve mobil cihazlarda mükemmel çalışır. Skorunuzu kaydetmek isterseniz ücretsiz hesap oluşturabilirsiniz.</p>
    `,
  },
  {
    slug: "beyin-gelistiren-oyunlar",
    title: "Beyni Geliştiren 6 Online Oyun: Bilimsel Yaklaşım",
    description:
      "Bilimsel araştırmalarla desteklenen beyin geliştiren oyunlar. Hafıza, mantık, dikkat ve problem çözme becerilerini geliştiren ücretsiz oyunlar.",
    date: "2026-02-20",
    category: "Makale",
    content: `
<h2>Oyun Oynamak Beyni Geliştirir mi?</h2>
<p>Evet! Araştırmalar, belirli türde oyunların bilişsel becerileri ölçülebilir şekilde geliştirdiğini göstermektedir. Önemli olan doğru oyunları düzenli oynamaktır.</p>

<h2>1. Sudoku — Mantıksal Düşünme</h2>
<p>Sudoku, tümdengelim (deductive reasoning) becerilerinizi geliştirir. Her hamle mantıksal çıkarım gerektirir. Düzenli Sudoku çözenler, problem çözme testlerinde daha yüksek skorlar elde etmektedir.</p>
<p><strong>Geliştirdiği beceriler:</strong> Mantık, örüntü tanıma, sabır</p>

<h2>2. Hafıza Oyunu — Kısa Süreli Bellek</h2>
<p>Kart eşleştirme oyunları, çalışan belleği (working memory) doğrudan hedefler. Bu beceri, yeni bilgi öğrenme ve çoklu görev yapma kapasitesinin temelidir.</p>
<p><strong>Geliştirdiği beceriler:</strong> Bellek, dikkat, görsel tanıma</p>

<h2>3. Kelime Oyunları — Sözel Zeka</h2>
<p>Wordle gibi kelime oyunları, kelime dağarcığınızı ve sözel akıcılığınızı geliştirir. Harf kombinasyonlarını zihinsel olarak denemek, dil işleme becerilerinizi güçlendirir.</p>
<p><strong>Geliştirdiği beceriler:</strong> Kelime hazinesi, sözel akıl yürütme, eleme stratejisi</p>

<h2>4. Mayın Tarlası — Risk Değerlendirme</h2>
<p>Mayın Tarlası, olasılık hesabı ve risk değerlendirme becerilerini geliştirir. Her tıklama bir karar anıdır: mevcut bilgiyle en güvenli hamleyi yapmalısınız.</p>
<p><strong>Geliştirdiği beceriler:</strong> Olasılık, risk analizi, hızlı karar verme</p>

<h2>5. 2048 — Stratejik Planlama</h2>
<p>2048'de her hamle, gelecekteki hamleleri etkiler. İleriye dönük düşünme ve kaynak yönetimi (boş alanları koruma) becerileri gelişir.</p>
<p><strong>Geliştirdiği beceriler:</strong> Stratejik planlama, uzamsal düşünme, ileriye dönük analiz</p>

<h2>6. Yılan — Refleks ve Koordinasyon</h2>
<p>Yılan oyunu, el-göz koordinasyonu ve tepki süresini geliştirir. Artan hız, beynin daha hızlı işlem yapmasını zorunlu kılar.</p>
<p><strong>Geliştirdiği beceriler:</strong> Refleks, koordinasyon, uzamsal farkındalık</p>

<h2>Günlük Beyin Egzersizi Rutini</h2>
<p>Optimum bilişsel fayda için günde 15-20 dakika beyin oyunu oynamanız yeterlidir:</p>
<ul>
  <li>5 dakika Sudoku (mantık)</li>
  <li>5 dakika Hafıza Oyunu (bellek)</li>
  <li>5 dakika Kelime Tahmin (sözel)</li>
  <li>Bonus: 5 dakika Yılan veya 2048 (refleks/strateji)</li>
</ul>

<p>Tüm bu oyunları <strong>bedava-oyun.com</strong>'da ücretsiz oynayabilirsiniz!</p>
    `,
  },
  {
    slug: "mobilde-oyun-oynama-rehberi",
    title: "Mobilde Tarayıcı Oyunları Oynama Rehberi",
    description:
      "Telefonda tarayıcı oyunlarını en iyi deneyimle oynamanın yolları. PWA kurulumu, dokunmatik kontroller ve mobil ipuçları.",
    date: "2026-02-20",
    category: "Rehber",
    content: `
<h2>Neden Tarayıcıda Oynamalı?</h2>
<p>Uygulama mağazasından indirmeye gerek yok, depolama alanı kullanmıyor, anında oynamaya başlayabilirsiniz. Modern tarayıcı oyunları mobilde mükemmel çalışır.</p>

<h2>Ana Ekrana Ekleme (PWA)</h2>
<p>Bedava Oyun'u telefonunuzun ana ekranına ekleyerek uygulama gibi kullanabilirsiniz:</p>

<h3>Android (Chrome):</h3>
<ol>
  <li>bedava-oyun.com adresine gidin</li>
  <li>"Uygulamayı yükle" banner'ına tıklayın veya</li>
  <li>Sağ üstteki üç nokta menüsünden "Ana ekrana ekle" seçin</li>
</ol>

<h3>iPhone (Safari):</h3>
<ol>
  <li>bedava-oyun.com adresine gidin</li>
  <li>Alt kısımdaki paylaş butonuna (kare + ok) tıklayın</li>
  <li>"Ana Ekrana Ekle" seçin</li>
</ol>

<h2>Oyun Bazlı Mobil İpuçları</h2>

<h3>Mayın Tarlası</h3>
<ul>
  <li><strong>Kısa dokunma:</strong> Kareyi açar</li>
  <li><strong>Uzun basma (0.5sn):</strong> Bayrak koyar/kaldırır</li>
  <li>Zor seviyede yatay kaydırma yapabilirsiniz</li>
</ul>

<h3>2048 ve Yılan</h3>
<ul>
  <li>Ekranda parmağınızı kaydırarak yön belirleyin</li>
  <li>Kısa ve hızlı kaydırmalar en iyi sonucu verir</li>
</ul>

<h3>Sudoku</h3>
<ul>
  <li>Hücreye dokunun, sonra alt kısımdaki sayıya dokunun</li>
  <li>"Not" modunu açarak küçük notlar ekleyebilirsiniz</li>
</ul>

<h3>Kelime Tahmin</h3>
<ul>
  <li>Ekran klavyesini kullanarak harfleri girin</li>
  <li>Türkçe özel karakterler (Ç, Ş, Ğ, Ü, Ö, İ) klavyede mevcut</li>
</ul>

<h2>En İyi Deneyim İçin</h2>
<ul>
  <li>Telefonu yatay modda kullanmayı deneyin (özellikle Mayın Tarlası)</li>
  <li>Karanlık mod, OLED ekranlarda pil tasarrufu sağlar</li>
  <li>Wi-Fi'ye gerek yok — sayfa bir kez yüklendikten sonra çevrimdışı oynanabilir</li>
</ul>
    `,
  },
];
