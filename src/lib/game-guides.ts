interface GuideStep {
  title: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export interface GameGuideData {
  howToPlayTitle: string;
  steps: GuideStep[];
  faq: FaqItem[];
}

type GuideMap = Record<string, GameGuideData>;

const guidesTr: GuideMap = {
  minesweeper: {
    howToPlayTitle: "Mayın Tarlası Nasıl Oynanır?",
    steps: [
      {
        title: "Bir kareye tıklayın",
        description:
          "Oyuna başlamak için tahtadaki herhangi bir kareye tıklayın. İlk tıklama her zaman güvenlidir.",
      },
      {
        title: "Sayıları okuyun",
        description:
          "Açılan karelerdeki sayılar, o karenin etrafındaki 8 komşuda kaç mayın olduğunu gösterir. Bu ipuçlarını kullanarak mayınların yerini tespit edin.",
      },
      {
        title: "Mayınları işaretleyin",
        description:
          "Mayın olduğunu düşündüğünüz karelere sağ tıklayarak (veya uzun basarak) bayrak koyun. Bayraklı karelere yanlışlıkla tıklamazsınız.",
      },
      {
        title: "Tüm güvenli kareleri açın",
        description:
          "Mayın olmayan tüm kareleri açtığınızda oyunu kazanırsınız. Bir mayına tıklarsanız oyun biter!",
      },
    ],
    faq: [
      {
        question: "İlk tıklama mayına denk gelir mi?",
        answer:
          "Hayır! İlk tıklama her zaman güvenlidir. Mayınlar ilk tıklamadan sonra yerleştirilir.",
      },
      {
        question: "Sağ tıklama ne işe yarar?",
        answer:
          "Sağ tıklama (veya mobilde uzun basma) ile karelere bayrak koyabilirsiniz. Bayrak, mayın olduğunu düşündüğünüz yerleri işaretlemenize yarar.",
      },
      {
        question: "Boş kare ne anlama gelir?",
        answer:
          "Etrafında hiç mayın olmayan kareler boş görünür ve otomatik olarak komşu kareleri de açar.",
      },
    ],
  },

  game2048: {
    howToPlayTitle: "2048 Nasıl Oynanır?",
    steps: [
      {
        title: "Karoları kaydırın",
        description:
          "Ok tuşları veya parmağınızla karoları yukarı, aşağı, sola veya sağa kaydırın. Tüm karolar o yönde hareket eder.",
      },
      {
        title: "Aynı sayıları birleştirin",
        description:
          "Aynı sayıya sahip iki karo çarpıştığında birleşerek toplamlarını oluşturur. Örneğin, 2+2=4, 4+4=8.",
      },
      {
        title: "2048'e ulaşın",
        description:
          "Karoları birleştirerek 2048 sayısına ulaşmaya çalışın. 2048'den sonra da devam edebilirsiniz!",
      },
      {
        title: "Tahtayı doldurmayın",
        description:
          "Tahta tamamen dolduğunda ve birleştirilecek karo kalmadığında oyun biter. Stratejik düşünün!",
      },
    ],
    faq: [
      {
        question: "En iyi strateji nedir?",
        answer:
          "Büyük sayıları bir köşede tutmaya çalışın. Rastgele kaydırmak yerine sistematik olarak bir veya iki yönde hareket edin.",
      },
      {
        question: "2048'den sonra ne olur?",
        answer:
          "2048'e ulaştığınızda oyunu kazanırsınız ama istersen devam edebilirsiniz. 4096, 8192 ve daha yüksek sayılara ulaşmayı deneyebilirsiniz!",
      },
      {
        question: "Maksimum puan nedir?",
        answer:
          "Teorik olarak en yüksek karo 131072'dir, ama pratikte 2048 veya 4096'ya ulaşmak bile büyük bir başarıdır.",
      },
    ],
  },

  snake: {
    howToPlayTitle: "Yılan Oyunu Nasıl Oynanır?",
    steps: [
      {
        title: "Yılanı yönlendirin",
        description:
          "Ok tuşları veya ekranı kaydırarak yılanın yönünü değiştirin. Yılan sürekli hareket eder.",
      },
      {
        title: "Yemleri yiyin",
        description:
          "Ekrandaki yemleri yiyin. Her yem yılanınızı bir birim uzatır ve puan kazandırır.",
      },
      {
        title: "Kenarlara ve kuyruğunuza çarpmayın",
        description:
          "Yılan duvarlara veya kendi kuyruğuna çarparsa oyun biter. Dikkatli hareket edin!",
      },
      {
        title: "En yüksek puanı hedefleyin",
        description:
          "Mümkün olduğunca çok yem yiyerek en yüksek skoru yapmaya çalışın.",
      },
    ],
    faq: [
      {
        question: "Yılan neden hızlanıyor?",
        answer:
          "Yılan büyüdükçe oyun zorlaşır. Daha az alanda manevra yapmanız gerekir.",
      },
      {
        question: "Mobilde nasıl oynanır?",
        answer:
          "Ekranı parmağınızla kaydırarak yılanın yönünü değiştirebilirsiniz.",
      },
    ],
  },

  wordle: {
    howToPlayTitle: "Kelime Tahmin Nasıl Oynanır?",
    steps: [
      {
        title: "Bir kelime girin",
        description:
          "5 harfli herhangi bir Türkçe kelime yazın ve Enter'a basın. Bu ilk tahmininiz olacak.",
      },
      {
        title: "Renk ipuçlarını okuyun",
        description:
          "Yeşil harf doğru yerde, sarı harf kelimede var ama yanlış yerde, gri harf ise kelimede yok demektir.",
      },
      {
        title: "İpuçlarıyla daraltın",
        description:
          "Her tahminde aldığınız renk ipuçlarını kullanarak gizli kelimeyi daraltın.",
      },
      {
        title: "6 denemede bulun",
        description:
          "Gizli kelimeyi 6 deneme içinde bulmaya çalışın. Ne kadar az denemede bulursanız o kadar iyi!",
      },
    ],
    faq: [
      {
        question: "Hangi kelimeler kabul ediliyor?",
        answer:
          "Geçerli 5 harfli Türkçe kelimeler kabul edilir. Özel isimler ve kısaltmalar kabul edilmez.",
      },
      {
        question: "Başlamak için en iyi kelime nedir?",
        answer:
          'Sık kullanılan sesli ve ünsüz harfler içeren kelimeler iyi bir başlangıçtır. "ARABA" veya "RADYO" deneyebilirsiniz.',
      },
      {
        question: "Her gün yeni bir kelime mi var?",
        answer:
          "Her oyunda rastgele bir kelime seçilir, istediğiniz kadar oynayabilirsiniz!",
      },
    ],
  },

  sudoku: {
    howToPlayTitle: "Sudoku Nasıl Oynanır?",
    steps: [
      {
        title: "Boş hücreleri doldurun",
        description:
          "9×9 ızgaradaki boş hücrelere 1-9 arası sayılar yerleştirin. Bir hücreye tıklayıp sayı seçin.",
      },
      {
        title: "Satır kuralı",
        description:
          "Her satırda 1'den 9'a kadar tüm sayılar tam olarak bir kez bulunmalıdır.",
      },
      {
        title: "Sütun kuralı",
        description:
          "Her sütunda 1'den 9'a kadar tüm sayılar tam olarak bir kez bulunmalıdır.",
      },
      {
        title: "3×3 kutu kuralı",
        description:
          "Her 3×3 kutuda 1'den 9'a kadar tüm sayılar tam olarak bir kez bulunmalıdır. Tüm hücreler doğru dolduğunda kazanırsınız!",
      },
    ],
    faq: [
      {
        question: "Nereden başlamalıyım?",
        answer:
          "En çok ipucu olan satır, sütun veya 3×3 kutudan başlayın. Sadece bir olasılığı olan hücreleri bulun.",
      },
      {
        question: "Zorluk seviyeleri ne anlama gelir?",
        answer:
          "Kolay bulmacalarda daha çok ipucu (dolu hücre) vardır. Zor bulmacalarda daha az ipucu ve daha karmaşık çözüm teknikleri gerekir.",
      },
      {
        question: "Tahmin etmek gerekir mi?",
        answer:
          "Hayır! Her Sudoku mantıkla çözülebilir. Tahmin etmenize gerek yoktur.",
      },
    ],
  },

  mahjong: {
    howToPlayTitle: "Mahjong Solitaire Nasıl Oynanır?",
    steps: [
      {
        title: "Serbest taşları bulun",
        description:
          "Üstünde taş olmayan ve en az bir yanı (sol veya sağ) açık olan taşlar serbesttir. Sadece serbest taşları seçebilirsiniz.",
      },
      {
        title: "Eşleşen çiftleri bulun",
        description:
          "Aynı türdeki iki serbest taşa tıklayarak onları eşleştirin. Eşleşen taşlar tahtadan kaldırılır.",
      },
      {
        title: "İpucu ve karıştır kullanın",
        description:
          "Eşleşme bulamıyorsanız İpucu butonuna basın. Hamle kalmadıysa Karıştır butonuyla kalan taşları yeniden dizin.",
      },
      {
        title: "Tüm taşları temizleyin",
        description:
          "144 taşın tamamını eşleştirerek tahtayı temizlediğinizde oyunu kazanırsınız!",
      },
    ],
    faq: [
      {
        question: "Hangi taşlar birbiriyle eşleşir?",
        answer:
          "Aynı suit ve değere sahip taşlar eşleşir. Mevsim taşları kendi aralarında, çiçek taşları da kendi aralarında eşleşir.",
      },
      {
        question: "Serbest taş ne demek?",
        answer:
          "Üstünde başka taş olmayan VE sol veya sağ tarafı açık olan taşlar serbesttir. Kilitli taşları seçemezsiniz.",
      },
      {
        question: "Oyun çözülemez duruma gelir mi?",
        answer:
          "Nadir durumlarda hamle kalmayabilir. Bu durumda Karıştır butonuyla taşları yeniden dizebilirsiniz.",
      },
    ],
  },

  tetris: {
    howToPlayTitle: "Tetris Nasıl Oynanır?",
    steps: [
      {
        title: "Blokları yönlendirin",
        description:
          "Yukarıdan düşen blokları sol-sağ ok tuşlarıyla hareket ettirin, yukarı ok ile döndürün.",
      },
      {
        title: "Satırları doldurun",
        description:
          "Blokları yatay bir satırı tamamen dolduracak şekilde yerleştirin. Dolu satırlar temizlenir ve puan kazanırsınız.",
      },
      {
        title: "Birden fazla satır temizleyin",
        description:
          "Aynı anda 2, 3 veya 4 satır temizlemek daha fazla puan verir. 4 satır temizlemeye 'Tetris' denir!",
      },
      {
        title: "Tavana ulaşmayın",
        description:
          "Bloklar ekranın üstüne ulaşırsa oyun biter. Blokları mümkün olduğunca alçakta tutun.",
      },
    ],
    faq: [
      {
        question: "Blokları nasıl hızlı düşürürüm?",
        answer:
          "Aşağı ok tuşuyla bloğu hızlandırabilir, boşluk tuşuyla anında en alta düşürebilirsiniz.",
      },
      {
        question: "Seviye yükseldikçe ne olur?",
        answer:
          "Seviye yükseldikçe bloklar daha hızlı düşer. Daha yüksek seviyeler daha fazla puan verir.",
      },
      {
        question: "Sonraki bloğu görebilir miyim?",
        answer:
          "Evet! Sağ taraftaki 'Sonraki' kutusunda bir sonraki bloğu görebilirsiniz.",
      },
    ],
  },

  puzzle15: {
    howToPlayTitle: "15 Bulmaca Nasıl Oynanır?",
    steps: [
      {
        title: "Karoları kaydırın",
        description:
          "Boş alana bitişik karolara tıklayarak onları boş alana kaydırın.",
      },
      {
        title: "Sayıları sıralayın",
        description:
          "1'den 15'e kadar sayıları soldan sağa, yukarıdan aşağıya sıralayın. Boş alan sağ alt köşede olmalı.",
      },
      {
        title: "Önce üst satırları çözün",
        description:
          "Önce üst satırları, sonra alt satırları çözün. Bu strateji çözümü kolaylaştırır.",
      },
      {
        title: "En az hamleyle çözün",
        description:
          "Bulmacayı mümkün olduğunca az hamleyle çözmeye çalışın!",
      },
    ],
    faq: [
      {
        question: "Her bulmaca çözülebilir mi?",
        answer:
          "Evet! Oluşturulan tüm bulmacaların çözümü vardır.",
      },
      {
        question: "En iyi strateji nedir?",
        answer:
          "Önce ilk satırı, sonra ikinci satırı yerine yerleştirin. Son iki satırı birlikte çözün.",
      },
    ],
  },

  connections: {
    howToPlayTitle: "Bağlantılar Nasıl Oynanır?",
    steps: [
      {
        title: "16 kelimeyi inceleyin",
        description:
          "Tahtadaki 16 kelimeyi okuyun. Bu kelimeler 4 gruba (her grupta 4 kelime) ayrılabilir.",
      },
      {
        title: "Ortak özelliği bulun",
        description:
          "Aynı gruba ait olduğunu düşündüğünüz 4 kelimeyi seçin. Her grubun ortak bir teması vardır.",
      },
      {
        title: "Tahmininizi gönderin",
        description:
          "4 kelime seçtikten sonra Gönder butonuna basın. Doğruysa grup açılır, yanlışsa bir hakkınız azalır.",
      },
      {
        title: "4 hakkınız var",
        description:
          "4 yanlış tahmin hakkınız var. Tüm grupları bulmaya çalışın! Dikkat: bazı kelimeler birden fazla gruba uyabilir.",
      },
    ],
    faq: [
      {
        question: "'Bir tanesi hariç doğru' ne demek?",
        answer:
          "Seçtiğiniz 4 kelimeden 3'ü doğru gruptandır, sadece 1 tanesi yanlıştır.",
      },
      {
        question: "Grupların zorluk sırası var mı?",
        answer:
          "Evet! Gruplar kolaydan zora doğru renk kodludur: sarı (kolay), yeşil, mavi, mor (zor).",
      },
    ],
  },

  hangman: {
    howToPlayTitle: "Adam Asmaca Nasıl Oynanır?",
    steps: [
      {
        title: "Kategoriyi inceleyin",
        description:
          "Ekranda kelimenin kategorisini göreceksiniz. Bu ipucu kelimeyi tahmin etmenize yardımcı olacak.",
      },
      {
        title: "Harf tahmin edin",
        description:
          "Klavyedeki harflere tıklayarak tahmin edin. Doğru harfler kelimede görünür, yanlış harfler adam figürüne parça ekler.",
      },
      {
        title: "6 hakkınız var",
        description:
          "Her yanlış tahminde adam figürüne bir parça eklenir (kafa, gövde, kollar, bacaklar). 6 yanlışta oyun biter!",
      },
      {
        title: "Kelimeyi tamamlayın",
        description:
          "Tüm harfleri doğru tahmin ederek kelimeyi tamamlayın. Seri yaparak bonus puan kazanın!",
      },
    ],
    faq: [
      {
        question: "Hangi harflerle başlamalıyım?",
        answer:
          "Türkçe'de en sık kullanılan harfler A, E, I, N, R, L'dir. Bu harflerle başlamak iyi bir stratejidir.",
      },
      {
        question: "Puan nasıl hesaplanır?",
        answer:
          "Puan, kelimenin uzunluğuna ve yanlış tahmin sayınıza göre hesaplanır. Daha az hatayla bulmak daha çok puan kazandırır.",
      },
      {
        question: "Seri (streak) ne işe yarar?",
        answer:
          "Art arda kelime bildiğinizde seri sayacı artar. Seri ne kadar uzunsa, o kadar iyi oynuyorsunuz demektir!",
      },
    ],
  },
  globle: {
    howToPlayTitle: "Globle Nasıl Oynanır?",
    steps: [
      {
        title: "Bir ülke tahmin edin",
        description:
          "Arama kutusuna herhangi bir ülke adı yazın ve seçin. Tahmin ettiğiniz ülke dünya üzerinde renkli olarak görünecek.",
      },
      {
        title: "Renk ipuçlarını okuyun",
        description:
          "Renk ne kadar sıcaksa (kırmızıya yakın), gizli ülkeye o kadar yakınsınız. Soğuk renkler (sarı) uzak olduğunuzu gösterir.",
      },
      {
        title: "Yön oklarını takip edin",
        description:
          "Her tahminin yanında gizli ülkenin hangi yönde olduğunu gösteren bir ok ve mesafe bilgisi bulunur.",
      },
      {
        title: "Gizli ülkeyi bulun",
        description:
          "Renk ipuçlarını ve yön oklarını kullanarak gizli ülkeyi mümkün olduğunca az tahminde bulun!",
      },
    ],
    faq: [
      {
        question: "Renkler ne anlama geliyor?",
        answer:
          "Açık sarı çok uzak demektir. Turuncu orta mesafe, kırmızı yakın, koyu kırmızı çok yakın demektir. Yeşil doğru cevaptır!",
      },
      {
        question: "Kaç tahmin hakkım var?",
        answer:
          "Sınırsız tahmin hakkınız var! Ama amaç mümkün olduğunca az tahminde bulmaktır.",
      },
      {
        question: "Yön okları nasıl çalışır?",
        answer:
          "Ok, tahmin ettiğiniz ülkeden gizli ülkeye doğru olan yönü gösterir. Örneğin ↗️ kuzeydoğu yönünde olduğunu belirtir.",
      },
    ],
  },
  watermelon: {
    howToPlayTitle: "Karpuz Oyunu Nasıl Oynanır?",
    steps: [
      {
        title: "Meyve bırakın",
        description:
          "Fare veya parmağınızla yatay konumu ayarlayın ve tıklayarak meyveyi bırakın. Meyveler yerçekimiyle düşer.",
      },
      {
        title: "Aynı meyveleri birleştirin",
        description:
          "İki aynı meyve birbirine değdiğinde bir üst seviye meyveye dönüşür. Kiraz → Çilek → Üzüm → Portakal → Elma → Armut → Şeftali → Ananas → Kavun → Karpuz!",
      },
      {
        title: "Karpuz yapmaya çalışın",
        description:
          "Meyveleri stratejik olarak birleştirerek karpuza ulaşmayı hedefleyin. Her birleşme puan kazandırır!",
      },
      {
        title: "Taşırmayın",
        description:
          "Meyveler kırmızı çizgiyi geçerse oyun biter. Kutuyu taşırmamaya dikkat edin!",
      },
    ],
    faq: [
      {
        question: "Hangi meyveler düşürülebilir?",
        answer:
          "Sadece küçük meyveler (Kiraz, Çilek, Üzüm, Portakal, Elma) rastgele olarak düşürülür. Büyük meyveler sadece birleştirme ile oluşur.",
      },
      {
        question: "Puan nasıl hesaplanır?",
        answer:
          "Her birleşme, oluşan meyvenin puanını kazandırır. Daha büyük meyveler daha çok puan verir. Karpuz en yüksek puanlı meyvedir!",
      },
      {
        question: "Mobilde nasıl oynanır?",
        answer:
          "Parmağınızı ekranda kaydırarak meyvenin konumunu ayarlayın, dokunarak bırakın.",
      },
    ],
  },
};

const guidesEn: GuideMap = {
  minesweeper: {
    howToPlayTitle: "How to Play Minesweeper",
    steps: [
      {
        title: "Click a square",
        description:
          "Click any square to start. The first click is always safe.",
      },
      {
        title: "Read the numbers",
        description:
          "Numbers show how many mines are in the 8 surrounding squares. Use these clues to find mines.",
      },
      {
        title: "Flag the mines",
        description:
          "Right-click (or long-press) to flag squares you think contain mines.",
      },
      {
        title: "Clear all safe squares",
        description:
          "Reveal all non-mine squares to win. Click a mine and it's game over!",
      },
    ],
    faq: [
      {
        question: "Can the first click hit a mine?",
        answer:
          "No! The first click is always safe. Mines are placed after your first click.",
      },
      {
        question: "What does right-click do?",
        answer:
          "Right-click (or long-press on mobile) places a flag on a square to mark where you think a mine is.",
      },
      {
        question: "What does a blank square mean?",
        answer:
          "Blank squares have no adjacent mines and automatically reveal their neighbors.",
      },
    ],
  },

  game2048: {
    howToPlayTitle: "How to Play 2048",
    steps: [
      {
        title: "Slide the tiles",
        description:
          "Use arrow keys or swipe to slide tiles up, down, left, or right. All tiles move in that direction.",
      },
      {
        title: "Merge matching numbers",
        description:
          "When two tiles with the same number collide, they merge into their sum. For example, 2+2=4, 4+4=8.",
      },
      {
        title: "Reach 2048",
        description:
          "Keep merging tiles to reach the 2048 tile. You can keep playing beyond 2048!",
      },
      {
        title: "Don't fill the board",
        description:
          "The game ends when the board is full and no more merges are possible. Think strategically!",
      },
    ],
    faq: [
      {
        question: "What's the best strategy?",
        answer:
          "Keep your largest number in a corner. Move systematically in one or two directions instead of randomly.",
      },
      {
        question: "What happens after 2048?",
        answer:
          "You win at 2048 but can keep playing! Try to reach 4096, 8192, or higher.",
      },
      {
        question: "What's the maximum score?",
        answer:
          "The theoretical highest tile is 131,072, but reaching 2048 or 4096 is already a great achievement!",
      },
    ],
  },

  snake: {
    howToPlayTitle: "How to Play Snake",
    steps: [
      {
        title: "Control the snake",
        description:
          "Use arrow keys or swipe to change the snake's direction. The snake moves continuously.",
      },
      {
        title: "Eat the food",
        description:
          "Eat food items on the screen. Each food extends your snake by one unit and gives points.",
      },
      {
        title: "Avoid walls and your tail",
        description:
          "The game ends if the snake hits a wall or its own tail. Move carefully!",
      },
      {
        title: "Aim for the high score",
        description:
          "Eat as much food as possible to achieve the highest score.",
      },
    ],
    faq: [
      {
        question: "Why does the snake speed up?",
        answer:
          "As the snake grows, you have less room to maneuver, making the game more challenging.",
      },
      {
        question: "How to play on mobile?",
        answer:
          "Swipe in the direction you want the snake to go.",
      },
    ],
  },

  wordle: {
    howToPlayTitle: "How to Play Word Guess",
    steps: [
      {
        title: "Enter a word",
        description:
          "Type any valid 5-letter word and press Enter. This will be your first guess.",
      },
      {
        title: "Read the color clues",
        description:
          "Green means the letter is correct and in the right spot. Yellow means it's in the word but wrong spot. Gray means it's not in the word.",
      },
      {
        title: "Narrow it down",
        description:
          "Use the color clues from each guess to narrow down the secret word.",
      },
      {
        title: "Find it in 6 tries",
        description:
          "Try to find the secret word within 6 guesses. Fewer guesses means a better score!",
      },
    ],
    faq: [
      {
        question: "Which words are accepted?",
        answer:
          "Valid 5-letter words are accepted. Proper nouns and abbreviations are not accepted.",
      },
      {
        question: "What's the best starting word?",
        answer:
          'Words with common vowels and consonants work best. Try "CRANE", "SLATE", or "AUDIO".',
      },
      {
        question: "Is there a new word every day?",
        answer:
          "A random word is selected for each game. You can play as many times as you want!",
      },
    ],
  },

  sudoku: {
    howToPlayTitle: "How to Play Sudoku",
    steps: [
      {
        title: "Fill empty cells",
        description:
          "Place numbers 1-9 in empty cells of the 9×9 grid. Click a cell and select a number.",
      },
      {
        title: "Row rule",
        description:
          "Each row must contain all numbers from 1 to 9 exactly once.",
      },
      {
        title: "Column rule",
        description:
          "Each column must contain all numbers from 1 to 9 exactly once.",
      },
      {
        title: "3×3 box rule",
        description:
          "Each 3×3 box must contain all numbers from 1 to 9 exactly once. Fill all cells correctly to win!",
      },
    ],
    faq: [
      {
        question: "Where should I start?",
        answer:
          "Start with the row, column, or 3×3 box that has the most clues. Find cells with only one possibility.",
      },
      {
        question: "What do difficulty levels mean?",
        answer:
          "Easy puzzles have more clues (filled cells). Hard puzzles have fewer clues and require more advanced techniques.",
      },
      {
        question: "Do I need to guess?",
        answer:
          "No! Every Sudoku can be solved with logic alone. You never need to guess.",
      },
    ],
  },

  mahjong: {
    howToPlayTitle: "How to Play Mahjong Solitaire",
    steps: [
      {
        title: "Find free tiles",
        description:
          "Free tiles have no tiles on top of them and at least one side (left or right) open. Only free tiles can be selected.",
      },
      {
        title: "Find matching pairs",
        description:
          "Click two free tiles of the same type to match them. Matched tiles are removed from the board.",
      },
      {
        title: "Use hints and shuffle",
        description:
          "Can't find a match? Use the Hint button. If no moves are left, use Shuffle to rearrange remaining tiles.",
      },
      {
        title: "Clear all tiles",
        description:
          "Match all 144 tiles to clear the board and win the game!",
      },
    ],
    faq: [
      {
        question: "Which tiles match each other?",
        answer:
          "Tiles with the same suit and value match. Season tiles match any other season, and flower tiles match any other flower.",
      },
      {
        question: "What does 'free tile' mean?",
        answer:
          "A tile with nothing on top of it AND at least one side (left or right) unblocked. Locked tiles cannot be selected.",
      },
      {
        question: "Can the game become unsolvable?",
        answer:
          "In rare cases, no moves may be left. Use the Shuffle button to rearrange the remaining tiles.",
      },
    ],
  },

  tetris: {
    howToPlayTitle: "How to Play Tetris",
    steps: [
      {
        title: "Move the blocks",
        description:
          "Use left/right arrow keys to move falling blocks and up arrow to rotate them.",
      },
      {
        title: "Fill complete rows",
        description:
          "Place blocks to fill a horizontal row completely. Full rows are cleared and you earn points.",
      },
      {
        title: "Clear multiple rows",
        description:
          "Clearing 2, 3, or 4 rows at once gives more points. Clearing 4 rows is called a 'Tetris'!",
      },
      {
        title: "Don't reach the top",
        description:
          "The game ends when blocks reach the top of the screen. Keep the stack as low as possible.",
      },
    ],
    faq: [
      {
        question: "How do I drop blocks faster?",
        answer:
          "Press down arrow to speed up, or space bar to instantly drop to the bottom.",
      },
      {
        question: "What happens at higher levels?",
        answer:
          "Blocks fall faster at higher levels. Higher levels also give more points per line cleared.",
      },
      {
        question: "Can I see the next block?",
        answer:
          "Yes! Check the 'Next' preview on the right side to see the upcoming block.",
      },
    ],
  },

  puzzle15: {
    howToPlayTitle: "How to Play 15 Puzzle",
    steps: [
      {
        title: "Slide the tiles",
        description:
          "Click tiles adjacent to the empty space to slide them into it.",
      },
      {
        title: "Arrange the numbers",
        description:
          "Arrange numbers 1-15 in order from left to right, top to bottom. The empty space should be in the bottom-right corner.",
      },
      {
        title: "Solve top rows first",
        description:
          "Solve the top rows first, then the bottom rows. This strategy makes solving easier.",
      },
      {
        title: "Use fewest moves",
        description:
          "Try to solve the puzzle in as few moves as possible!",
      },
    ],
    faq: [
      {
        question: "Is every puzzle solvable?",
        answer: "Yes! All generated puzzles have a valid solution.",
      },
      {
        question: "What's the best strategy?",
        answer:
          "Place the first row, then the second row. Solve the last two rows together.",
      },
    ],
  },

  connections: {
    howToPlayTitle: "How to Play Connections",
    steps: [
      {
        title: "Study the 16 words",
        description:
          "Read the 16 words on the board. They can be sorted into 4 groups of 4 words each.",
      },
      {
        title: "Find the common theme",
        description:
          "Select 4 words you think belong to the same group. Each group shares a common theme.",
      },
      {
        title: "Submit your guess",
        description:
          "After selecting 4 words, press Submit. If correct, the group is revealed. If wrong, you lose a life.",
      },
      {
        title: "You have 4 lives",
        description:
          "You have 4 wrong guesses. Try to find all groups! Note: some words may fit multiple groups.",
      },
    ],
    faq: [
      {
        question: "What does 'one away' mean?",
        answer:
          "It means 3 of your 4 selected words are from the correct group, but 1 is wrong.",
      },
      {
        question: "Are groups ordered by difficulty?",
        answer:
          "Yes! Groups are color-coded from easy to hard: yellow (easy), green, blue, purple (hard).",
      },
    ],
  },

  hangman: {
    howToPlayTitle: "How to Play Hangman",
    steps: [
      {
        title: "Check the category",
        description:
          "You'll see the word's category on screen. This clue will help you guess the word.",
      },
      {
        title: "Guess a letter",
        description:
          "Click letters on the keyboard to guess. Correct letters appear in the word, wrong letters add a body part to the hangman.",
      },
      {
        title: "You have 6 lives",
        description:
          "Each wrong guess adds a part to the hangman figure (head, body, arms, legs). After 6 wrong guesses, the game is over!",
      },
      {
        title: "Complete the word",
        description:
          "Guess all letters correctly to complete the word. Build a streak for bonus points!",
      },
    ],
    faq: [
      {
        question: "Which letters should I start with?",
        answer:
          'The most common English letters are E, A, R, I, O, T, N, S. Starting with these is a good strategy.',
      },
      {
        question: "How is the score calculated?",
        answer:
          "Score depends on word length and wrong guesses. Fewer mistakes means a higher score.",
      },
      {
        question: "What does the streak do?",
        answer:
          "The streak counter increases when you guess words correctly in a row. A longer streak shows how well you're playing!",
      },
    ],
  },

  globle: {
    howToPlayTitle: "How to Play Globle",
    steps: [
      {
        title: "Guess a country",
        description:
          "Type any country name in the search box and select it. Your guessed country will appear colored on the globe.",
      },
      {
        title: "Read the color clues",
        description:
          "The hotter the color (closer to red), the closer you are to the mystery country. Cool colors (yellow) mean you're far away.",
      },
      {
        title: "Follow the direction arrows",
        description:
          "Each guess shows a direction arrow pointing toward the mystery country and the distance in kilometers.",
      },
      {
        title: "Find the mystery country",
        description:
          "Use color clues and direction arrows to find the mystery country in as few guesses as possible!",
      },
    ],
    faq: [
      {
        question: "What do the colors mean?",
        answer:
          "Light yellow means very far. Orange is medium distance, red is close, dark red is very close. Green is the correct answer!",
      },
      {
        question: "How many guesses do I get?",
        answer:
          "You have unlimited guesses! But the goal is to find the country in as few guesses as possible.",
      },
      {
        question: "How do direction arrows work?",
        answer:
          "The arrow points from your guessed country toward the mystery country. For example, ↗️ means the target is to the northeast.",
      },
    ],
  },
  watermelon: {
    howToPlayTitle: "How to Play Watermelon Game",
    steps: [
      {
        title: "Drop a fruit",
        description:
          "Move your mouse or finger to set the horizontal position, then click or tap to drop the fruit. Fruits fall with gravity.",
      },
      {
        title: "Merge matching fruits",
        description:
          "When two identical fruits touch, they merge into the next larger fruit. Cherry → Strawberry → Grape → Orange → Apple → Pear → Peach → Pineapple → Melon → Watermelon!",
      },
      {
        title: "Try to make a watermelon",
        description:
          "Strategically merge fruits to reach the watermelon. Each merge awards points!",
      },
      {
        title: "Don't overflow",
        description:
          "If fruits stack above the red danger line, the game is over. Keep the container from overflowing!",
      },
    ],
    faq: [
      {
        question: "Which fruits can be dropped?",
        answer:
          "Only the 5 smallest fruits (Cherry, Strawberry, Grape, Orange, Apple) are randomly chosen for dropping. Larger fruits can only be created by merging.",
      },
      {
        question: "How is the score calculated?",
        answer:
          "Each merge awards points based on the fruit created. Bigger fruits give more points. Watermelon is worth the most!",
      },
      {
        question: "How to play on mobile?",
        answer:
          "Drag your finger across the screen to position the fruit, then tap to drop it.",
      },
    ],
  },
};

export function getGameGuide(
  slug: string,
  locale: "tr" | "en"
): GameGuideData | null {
  const guides = locale === "tr" ? guidesTr : guidesEn;
  return guides[slug] ?? null;
}
