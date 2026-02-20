export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: string;
  content: string; // HTML content
}

export const blogPosts: BlogPost[] = [
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
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
