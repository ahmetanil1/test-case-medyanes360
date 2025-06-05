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

    if (response.url.includes("/notification") && response.redirected) {
      window.location.href = response.url;
      return { redirected: true, url: response.url }; 
    }
    if (!response.ok) {
      const errorData = await response.json(); 
      throw new Error(errorData.message || `HTTP hatası: ${response.status} ${response.statusText}`);
    }
    return await response.json();

  } catch (err) {
    throw err;
  }
};

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
      } else {
        return res.json();
      }
    }).catch((err) => {
      throw new Error(`GET isteği başarısız: ${err.message}`);
    });

  return data;
};

export { postAPI, getAPI };
