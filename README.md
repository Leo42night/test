# STARPLUS
Company Profile Perusahaan Mechanical Construction

## Cara Pakai
```
composer install
copy .env.example .env
php artisan key:generate
php artisan storage:link
php artisan migrate --seed
pnpm install
```
## For Developer
[Project Folder](https://drive.google.com/drive/folders/1DIFmoUGeUehtDxHtdMcmOLfCBp9s1Ko4?usp=sharing)

## Hal yang harus diketahui
- `public/` berisi file yang dapat diakses, sedangkan `public/storage/` ter-_link_ ke folder `storage/app/public/` (digunakan unutk file upload).
- image yang di generate oleh factory adalah url (untuk pengembangan), image (upload) yang diseting manual akan disimpan ke `storage/` yang ke link ke `public/`, jadi perlu conditioning untuk url dan path.

## Fitur
### Back-End
- **Login**
- **CRUD**:
  - **Berita**: Postingan Artikel 
  - **Portfolio**: Gambar dan keterangan produk yang dihasilkan
  - **Feedback**: Komentar untuk Berita
  - **User**: Pengguna Sistem
  - **Pengadaan**: Perencanaan proyek baru 

## Front End
- Home
- Profil
- Tata Kelola
- Layanan
- Info Pengadaan


## Issue Dev_ops
- PNPM COMPOSER run in terminal, but not 