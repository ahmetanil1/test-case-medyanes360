const postAPI = async (
  URL,
  body,
  method = "POST",
  headers = { "Content-Type": "application/json" }
) => {
  try {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL || !URL) {
      throw new Error("URL bulunamadı veya BACKEND_URL tanımlı değil!");
    }

    const fullUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL + URL}`;

    const response = await fetch(fullUrl, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    console.log("Response URL:", response.url);
    if (response.url.includes("/notification") && response.redirected) {
      window.location.href = response.url;
      return { redirected: true, url: response.url }; // Yönlendirme bilgisini döndür
    }
    if (!response.ok) {
      const errorData = await response.json(); // Hata detaylarını backend'den al
      throw new Error(errorData.message || `HTTP hatası: ${response.status} ${response.statusText}`);
    }
    return await response.json();

  } catch (err) {
    console.error("postAPI Hatası:", err);
    throw err;
  }
};

// Bu fonksiyonu dışa aktardığınızdan emin olun
// Örneğin: export { postAPI };
// Veya eğer dosyanın tek export'u ise: export default postAPI;
// Öğrenci (kayıt) işlemleri için kullanılan servis
const getAPI = async (
  URL,
  headers = { "Content-Type": "application/json" }
) => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL + URL}`, {
    method: "GET",
    headers: headers,
    cache: "no-store",
  })
    .then((res) => {
      if (res.redirected) {
        // bazı yerlerde window'u bulamıyor kontrol et
        //return window.location.href = res.url;
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

  return data;
};

export { postAPI, getAPI };
