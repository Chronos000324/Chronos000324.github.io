# FAZLIL Content Studio

Admin tambahan untuk website GitHub Pages sedia ada. Ia mengedit portrait, email, LinkedIn, GitHub, itch.io dan kandungan empat projek. PLAY MODE dan QUICK VIEW membaca content.js yang sama. Teks About Me, hero dan dialog NPC yang masih hardcoded tidak diedit oleh versi ini.

## Pasang sekali sahaja

1. Extract ZIP ini.
2. Buka repository **Chronos000324/Chronos000324.github.io** di GitHub.
3. Di halaman utama repository, pilih Add file → Upload files.
4. Drag **folder admin sahaja** ke halaman upload. Kekalkan folder itu; jangan keluarkan empat fail di dalamnya.
5. Commit changes. Tunggu GitHub Pages menerbitkan perubahan.
6. Buka **https://chronos000324.github.io/admin/**.

Tidak perlu padam repository, menggantikan content.js, atau upload semula portfolio. Folder admin mesti bersebelahan index.html, content.js, assets, play dan projects pada root repository. Gunakan origin HTTPS sendiri; jangan masukkan token pada salinan editor milik orang lain.

## Sambung ke GitHub

Versi ini menggunakan fine-grained personal access token, bukan login email/password atau OAuth. Token hanya berada dalam memori tab semasa. Ia tidak disimpan dalam repository, cookies, localStorage atau sessionStorage. Refresh/keluar memerlukan sambungan semula.

1. GitHub → Settings akaun → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
2. Nama: FAZLIL Portfolio Admin. Pilih tarikh luput, contohnya 30 hari.
3. Resource owner: Chronos000324.
4. Repository access: Only select repositories → Chronos000324.github.io sahaja.
5. Repository permissions: Contents → Read and write. Metadata read disertakan secara automatik.
6. Generate token. Paste dalam ruang token di admin, bukan dalam chat atau fail kod.
7. Username: Chronos000324. Repository: Chronos000324.github.io. Branch: main.
8. Klik Sambung ke GitHub. Ia memuat content.js terkini daripada branch tersebut.

Token boleh ditarik balik atau diganti melalui Settings GitHub. Admin page boleh dilihat orang ramai, tetapi GitHub menolak perubahan tanpa token yang mempunyai akses menulis. Jangan berikan token kepada pelawat. Jika branch dilindungi, admin tidak memintas perlindungan itu.

## Edit dan simpan

- Pilih Portrait & contact atau mana-mana empat projek.
- Edit medan, upload cover/portrait, tambah atau buang screenshot, serta paste link video.
- Upload menerima PNG/JPG/WebP, maksimum 10 MB input dan 32 megapiksel. Gambar dikecilkan ke 1600 px dan maksimum 5 MB output; jumlah sementara 20 MB setiap sesi.
- Gunakan URL HTTPS untuk link luar. Gunakan /assets/... untuk fail media dalam repository.
- Video menggunakan pautan YouTube atau fail MP4/WebM sedia ada; upload video besar tidak disediakan.
- Semak & terbitkan → Simpan ke GitHub. Media baru disimpan di assets/uploads/. content.js dan semua gambar baru diterbitkan bersama dalam satu commit, tanpa menggantikan fail lain.
- GitHub Pages perlu selesai membina sebelum perubahan kelihatan pada website.
- Jangan tutup tab semasa simpan. Jika sambungan terganggu, semak commit GitHub sebelum cuba semula.
- Jika repository berubah selepas editor dibuka, admin berhenti supaya tidak menimpa perubahan orang lain. Download backup draf, kemudian keluar dan sambung semula.
- Download backup menyimpan teks/URL draf sebagai JSON. Ia tidak menyertakan fail gambar belum diterbitkan dan belum mempunyai fungsi restore automatik. Untuk pemulihan draf, gunakan data backup untuk menyalin medan atau minta bantuan.
- Buang gambar mengeluarkannya daripada paparan, bukan memadam fail sejarah di repository.

## Penggunaan setempat

Letak folder admin dalam folder portfolio yang mengandungi content.js. Buka folder portfolio melalui VS Code Live Server. Buka /admin/ dan klik Cuba editor dahulu untuk pratonton tanpa GitHub. Mod cuba tidak menerbitkan perubahan. Ia memuat data sebenar dalam content.js setempat; draf akan hilang apabila keluar.

## Skop dan pengesahan

Tambahan ini tidak mengubah layout portfolio atau logik game. Tiada database/cloud service baru, library pihak ketiga, analytics atau password hardcoded. Kod sumber admin mesti dimuat naik sekali; selepas sambungan disediakan, kandungan yang disokong boleh diedit melalui borang.

Penerbitan sebenar ke repository memerlukan token pemilik dan belum diuji dengan akaun kamu. Ujian automatik menggunakan respons GitHub simulasi untuk parsing, UTF-8, pemeliharaan fail, satu commit atomik, dan penolakan konflik. Jangan anggap ujian simulasi sebagai bukti deployment sebenar.

Rujukan rasmi:
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- https://docs.github.com/en/rest/git/trees
- https://docs.github.com/en/rest/git/refs
