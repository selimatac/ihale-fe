export const getTimeDiff = (tarihZaman) => {
  // Şu anki tarihi al
  var simdikiZaman = new Date();

  // Verilen tarih-zaman dizesini Date objesine çevir
  var verilenZaman = new Date(tarihZaman);

  // Zaman farkını hesapla (milisaniye cinsinden)
  var zamanFarki = simdikiZaman - verilenZaman;

  // Zaman farkını gün, ay, yıl, saat ve dakika cinsine çevir
  var gunFarki = Math.floor(zamanFarki / (1000 * 60 * 60 * 24));
  var ayFarki = Math.floor(gunFarki / 30); // Yaklaşık bir değer, her ayın 30 gün olduğu kabul edilmiştir.
  var yilFarki = Math.floor(ayFarki / 12);
  var saatFarki = Math.floor(
    (zamanFarki % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var dakikaFarki = Math.floor((zamanFarki % (1000 * 60 * 60)) / (1000 * 60));

  // Sıfıra eşit olmayan değerleri birleştir
  var zamanFarkiMetni = "";
  if (yilFarki !== 0) {
    zamanFarkiMetni += yilFarki + (yilFarki === 1 ? " yıl " : " yıl ");
  }
  if (ayFarki !== 0) {
    zamanFarkiMetni += ayFarki + (ayFarki === 1 ? " ay " : " ay ");
  }
  if (gunFarki !== 0) {
    zamanFarkiMetni += gunFarki + (gunFarki === 1 ? " gün " : " gün ");
  }
  if (saatFarki !== 0) {
    zamanFarkiMetni += saatFarki + (saatFarki === 1 ? " saat " : " saat ");
  }
  if (dakikaFarki !== 0) {
    zamanFarkiMetni +=
      dakikaFarki + (dakikaFarki === 1 ? " dakika" : " dakika");
  }

  // Eğer zaman farkı sıfırsa "Şu an" mesajını döndür
  if (zamanFarkiMetni === "") {
    return "Az önce";
  } else {
    return zamanFarkiMetni.trim(); // İlk ve son boşlukları temizle
  }
};

export const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  // Tarih kısmı
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  // Saat kısmı
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Formatı birleştir
  const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

  return formattedDate;
};

export const getWithCurrencyFormat = (value) => {
  // Gelen number formatındaki sayıyı para birimi şeklinde formatlayarak döndürür.
  if (!Number(value)) return "";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);
};

// Durumların koduna göre değerleri.
export const DURUMLAR = {
  0: "KAZANDI",
  1: "KAZANAMADI",
  2: "TEKLİFİ GEÇERSİZ",
};
