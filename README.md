"Admin Giriş: /admin/login" ile gidebilirsiniz.
email : admin@gmail.com
şifre : admin123

Proje Adı
Bu proje, kullanıcıların yapılacaklar listelerini (todos) yönetmelerini sağlayan modern bir web uygulamasıdır. Kullanıcılar todo ekleyebilir, düzenleyebilir ve silebilirler. Yönetici (Admin) rolüne sahip kullanıcılar, todoları diğer kullanıcılara atayabilirler.

Açıklama
Bu uygulama, React (Next.js), Zustand ile durum yönetimi ve Tailwind CSS ile arayüz tasarımını birleştirerek hızlı ve duyarlı bir kullanıcı deneyimi sunar. Backend iletişimi için özel bir fetchAPI servisi kullanılmaktadır.

Özellikler
Todo Yönetimi: Başlık, açıklama, öncelik ve kategori ile todo oluşturma, düzenleme ve silme.

Durum Yönetimi: Zustand ile merkezi ve verimli durum yönetimi.

Kullanıcı Rolleri: Normal kullanıcı ve yönetici (admin) rolleri ayrımı.

Yönetici Yetenekleri: Yöneticilerin yeni todoları belirli kullanıcılara atayabilmesi, tüm kullanıcıların tüm todolarını manipüle etme yetkisi.

Duyarlı Tasarım: Tailwind CSS ile tüm cihazlarda sorunsuz çalışan kullanıcı arayüzü.

API Entegrasyonu: Backend ile kolay iletişim için özelleştirilmiş fetchAPI servisi.

Bildirimler: react-toastify ile kullanıcı dostu bildirim mesajları.

Kurulum
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

Depoyu Klonlayın:

git clone <depo-URL>
cd <proje-klasörü>

Bağımlılıkları Yükleyin:

npm install
# veya
yarn install


Veritabanı Ayarları (Backend için):
Bu uygulamanın bir backend API'si ile çalıştığını varsayarak, backend projenizi de kurmanız ve veritabanı bağlantılarını doğru şekilde yapılandırmanız gerekmektedir. Prisma şemanızdaki Todo ve AllUser modellerinin doğru olduğundan emin olun.

Kullanım
Projeyi başlattıktan sonra, tarayıcınızda http://localhost:3000 adresine giderek uygulamayı kullanabilirsiniz.

Örnek API Kullanımı (Frontend'de)
Projede kullanılan getAPI ve postAPI fonksiyonları, @/services/fetchAPI dosyasından gelmektedir. 

Teknolojiler
Frontend:
React.js
Next.js (React Framework)
Zustand (State Management)
Tailwind CSS (Styling)
React Toastify (Notifications)
NextAuth.js (Authentication)

Backend (Varsayımsal):
Next.js
Prisma (ORM)
MongoDB (Database)



NOT:: ! NORMALDE .env .gitignore İÇERİSİNDE OLMASI GEREKİR FAKAT CASE SIRASINDA BU ŞEKİLDE İSTENDİĞİ İÇİN BÖYLE PUSHLANDI.
 