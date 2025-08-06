# ⚠️ Peringatan (Disclaimer)

Proyek ini adalah submission untuk kelas "Belajar Fundamental Back-End dengan JavaScript" di Dicoding. Repositori ini dibuat hanya untuk tujuan edukasi dan sebagai referensi pribadi.

Sangat tidak disarankan untuk melakukan copy-paste secara langsung pada kode ini untuk menyelesaikan tugas Anda. Setiap submission akan diperiksa oleh sistem plagiarism checker. Tindakan plagiarisme dapat mengakibatkan submission Anda ditolak dan akun Dicoding Anda bisa di-banned.

Segala risiko yang timbul akibat penyalahgunaan repositori ini adalah tanggung jawab Anda sepenuhnya. Mohon gunakan dengan bijak.

# Open Music API

**Open Music API** adalah sebuah proyek RESTful API untuk mengelola data album, lagu, dan playlist. API ini dibangun menggunakan Node.js dengan framework Hapi dan menggunakan PostgreSQL sebagai database. Proyek ini juga dilengkapi dengan fitur autentikasi pengguna, kolaborasi playlist, dan pencatatan aktivitas. Proyek ini dibuat sebagai _submission_ untuk kelas "Belajar Fundamental Back-End dengan JavaScript".

## Dokumentasi API

Berikut adalah detail dari setiap _endpoint_ yang tersedia.

### 👤 Users API

#### `POST /users`

Menambahkan pengguna baru (registrasi).

-  **Request Body**:
   ```json
   {
   	"username": "string (required, unique)",
   	"password": "string (required)",
   	"fullname": "string (required)"
   }
   ```
-  **Success Response (201)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"userId": "user-xxxxxxxx"
   	}
   }
   ```
-  **Fail Response (400)**:
   ```json
   {
   	"status": "fail",
   	"message": "Gagal menambahkan user. Username sudah digunakan."
   }
   ```

---

### 🔑 Authentications API

#### `POST /authentications`

Login pengguna untuk mendapatkan access token dan refresh token.

-  **Request Body**:
   ```json
   {
   	"username": "string (required)",
   	"password": "string (required)"
   }
   ```
-  **Success Response (201)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"accessToken": "xxxxxxxx",
   		"refreshToken": "xxxxxxxx"
   	}
   }
   ```
-  **Fail Response (401)**:
   ```json
   {
   	"status": "fail",
   	"message": "Kredensial yang Anda berikan salah"
   }
   ```

#### `PUT /authentications`

Memperbarui access token dengan menggunakan refresh token.

-  **Request Body**:
   ```json
   {
   	"refreshToken": "string (required)"
   }
   ```
-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"accessToken": "xxxxxxxx"
   	}
   }
   ```
-  **Fail Response (400)**:
   ```json
   {
   	"status": "fail",
   	"message": "Refresh token tidak valid"
   }
   ```

#### `DELETE /authentications`

Menghapus refresh token (logout).

-  **Request Body**:
   ```json
   {
   	"refreshToken": "string (required)"
   }
   ```
-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"message": "Refresh token berhasil dihapus"
   }
   ```

---

### 💿 Albums API

#### `POST /albums`

Menambahkan album baru.

-  **Request Body**:
   ```json
   {
   	"name": "string (required)",
   	"year": "number (required)"
   }
   ```
-  **Success Response (201)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"albumId": "album-xxxxxxxx"
   	}
   }
   ```

#### `GET /albums/{id}`

Mendapatkan detail album berdasarkan ID, termasuk daftar lagu di dalamnya.

-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"album": {
   			"id": "album-Mk8AnmCp210PwT6B",
   			"name": "Viva la Vida",
   			"year": 2008,
   			"songs": [
   				{
   					"id": "song-Qbax5Oy7L8WKf74l",
   					"title": "Life in Technicolor",
   					"performer": "Coldplay"
   				}
   			]
   		}
   	}
   }
   ```
-  **Fail Response (404)**:
   ```json
   {
   	"status": "fail",
   	"message": "Album tidak ditemukan"
   }
   ```

#### `PUT /albums/{id}`

Memperbarui data album berdasarkan ID.

-  **Request Body**:
   ```json
   {
   	"name": "string (required)",
   	"year": "number (required)"
   }
   ```
-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"message": "Album berhasil diperbarui"
   }
   ```
-  **Fail Response (404)**:
   ```json
   {
   	"status": "fail",
   	"message": "Gagal memperbarui album. Id tidak ditemukan"
   }
   ```

#### `DELETE /albums/{id}`

Menghapus album berdasarkan ID.

-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"message": "Album berhasil dihapus"
   }
   ```
-  **Fail Response (404)**:
   ```json
   {
   	"status": "fail",
   	"message": "Album gagal dihapus. Id tidak ditemukan"
   }
   ```

---

### 🎵 Songs API

#### `POST /songs`

Menambahkan lagu baru.

-  **Request Body**:
   ```json
   {
   	"title": "string (required)",
   	"year": "number (required)",
   	"genre": "string (required)",
   	"performer": "string (required)",
   	"duration": "number (optional)",
   	"albumId": "string (optional)"
   }
   ```
-  **Success Response (201)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"songId": "song-xxxxxxxx"
   	}
   }
   ```

#### `GET /songs`

Mendapatkan semua lagu dengan filter opsional.

-  **Query Parameters**:
   -  `?title=...` (opsional)
   -  `?performer=...` (opsional)
-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"songs": [
   			{
   				"id": "song-Qbax5Oy7L8WKf74l",
   				"title": "Life in Technicolor",
   				"performer": "Coldplay"
   			}
   		]
   	}
   }
   ```

#### `GET /songs/{id}`

Mendapatkan detail lagu berdasarkan ID.

-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"song": {
   			"id": "song-Qbax5Oy7L8WKf74l",
   			"title": "Life in Technicolor",
   			"year": 2008,
   			"performer": "Coldplay",
   			"genre": "Indie",
   			"duration": 120,
   			"albumId": "album-Mk8AnmCp210PwT6B"
   		}
   	}
   }
   ```
-  **Fail Response (404)**:
   ```json
   {
   	"status": "fail",
   	"message": "Lagu tidak ditemukan"
   }
   ```

#### `PUT /songs/{id}`

Memperbarui data lagu berdasarkan ID.

-  **Request Body**:
   ```json
   {
   	"title": "string (required)",
   	"year": "number (required)",
   	"genre": "string (required)",
   	"performer": "string (required)",
   	"duration": "number (optional)",
   	"albumId": "string (optional)"
   }
   ```
-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"message": "Lagu berhasil diperbarui"
   }
   ```

#### `DELETE /songs/{id}`

Menghapus lagu berdasarkan ID.

-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"message": "Lagu berhasil dihapus"
   }
   ```

---

### 🎶 Playlists API

_Catatan: Semua endpoint di bawah ini memerlukan otentikasi (Access Token)._

#### `POST /playlists`

Membuat playlist baru.

-  **Request Body**:
   ```json
   {
   	"name": "string (required)"
   }
   ```
-  **Success Response (201)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"playlistId": "playlist-xxxxxxxx"
   	}
   }
   ```

#### `GET /playlists`

Mendapatkan daftar playlist milik pengguna (owner atau kolaborator).

-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"playlists": [
   			{
   				"id": "playlist-Qbax5Oy7L8WKf74l",
   				"name": "Lagu Indie Hits Indonesia",
   				"username": "dicoding"
   			}
   		]
   	}
   }
   ```

#### `DELETE /playlists/{id}`

Menghapus playlist berdasarkan ID. Hanya dapat dilakukan oleh owner.

-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"message": "Playlist berhasil dihapus"
   }
   ```
-  **Fail Response (403)**:
   ```json
   {
   	"status": "fail",
   	"message": "Anda tidak berhak mengakses resource ini"
   }
   ```

#### `POST /playlists/{id}/songs`

Menambahkan lagu ke dalam playlist.

-  **Request Body**:
   ```json
   {
   	"songId": "string (required)"
   }
   ```
-  **Success Response (201)**:
   ```json
   {
   	"status": "success",
   	"message": "Lagu berhasil ditambahkan ke playlist"
   }
   ```

#### `GET /playlists/{id}/songs`

Melihat daftar lagu dalam sebuah playlist.

-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"playlist": {
   			"id": "playlist-Mk8AnmCp210PwT6B",
   			"name": "My Favorite Coldplay",
   			"username": "dicoding",
   			"songs": [
   				{
   					"id": "song-Qbax5Oy7L8WKf74l",
   					"title": "Life in Technicolor",
   					"performer": "Coldplay"
   				}
   			]
   		}
   	}
   }
   ```

#### `DELETE /playlists/{id}/songs`

Menghapus lagu dari playlist.

-  **Request Body**:
   ```json
   {
   	"songId": "string (required)"
   }
   ```
-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"message": "Lagu berhasil dihapus dari playlist"
   }
   ```

---

## Kriteria Tambahan

### 1\. Registrasi dan Autentikasi Pengguna

-  Username harus unik.
-  Autentikasi menggunakan JWT (JSON Web Token).
-  Payload JWT mengandung `userId`.
-  Secret key JWT menggunakan environment variable `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY`.
-  Refresh token disimpan dan terverifikasi di database.

### 2\. Pengelolaan Data Playlist

-  Akses ke resource playlist memerlukan otentikasi.
-  `GET /playlists` hanya menampilkan playlist milik pengguna atau di mana ia menjadi kolaborator.
-  Hanya owner atau kolaborator yang dapat mengelola lagu dalam playlist.

### 3\. Penerapan Foreign Key

-  Database menerapkan relasi antar tabel, seperti `songs` dengan `albums`, dan `playlists` dengan `users`.

### 4\. Validasi Data (Request Payload)

-  **POST /users**: `username`, `password`, `fullname` (semua string dan required).
-  **POST /authentications**: `username`, `password` (semua string dan required).
-  **PUT /authentications**: `refreshToken` (string dan required).
-  **DELETE /authentications**: `refreshToken` (string dan required).
-  **POST /playlists**: `name` (string dan required).
-  **POST /playlists/{playlistId}/songs**: `songId` (string dan required).

### 5\. Penanganan Eror (Error Handling)

-  **400 (Bad Request)**: Gagal validasi data atau request tidak valid (contoh: refresh token salah).
-  **401 (Unauthorized)**: Mengakses resource yang butuh token tanpa menyertakannya.
-  **403 (Forbidden)**: Mengakses resource yang bukan haknya (contoh: menghapus playlist orang lain).
-  **404 (Not Found)**: Resource yang diminta tidak ada.
-  **500 (Internal Server Error)**: Terjadi kegagalan di sisi server.

### 6\. Pertahankan Fitur OpenMusic API v1

-  Fitur pengelolaan Album dan Lagu dari versi pertama tetap dipertahankan.

---

## Kriteria Opsional

### 1\. Kolaborator Playlist

-  Memiliki fitur untuk menambah dan menghapus kolaborator pada playlist.
-  Kolaborator memiliki hak akses untuk menambah, melihat, dan menghapus lagu dari playlist.
-  Endpoint terkait: `POST /collaborations`, `DELETE /collaborations`.

### 2\. Aktivitas Playlist (Playlist Activities)

-  Mencatat riwayat penambahan atau penghapusan lagu pada playlist.
-  Dapat diakses melalui `GET /playlists/{id}/activities`.
-  **Success Response (200)**:
   ```json
   {
   	"status": "success",
   	"data": {
   		"playlistId": "playlist-Mk8AnmCp210PwT6B",
   		"activities": [
   			{
   				"username": "dicoding",
   				"title": "Life in Technicolor",
   				"action": "add",
   				"time": "2021-09-13T08:06:20.600Z"
   			},
   			{
   				"username": "dimasmds",
   				"title": "Life in Technicolor",
   				"action": "delete",
   				"time": "2021-09-13T08:07:01.483Z"
   			}
   		]
   	}
   }
   ```

### 3\. Mempertahankan Kriteria Opsional v1

-  Daftar lagu tetap ditampilkan pada detail album.
-  Fitur pencarian lagu berdasarkan `title` dan `performer` tetap berfungsi.
