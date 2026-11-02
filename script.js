import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
         import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
         import {getFirestore, collection, doc, setDoc, addDoc, getDocs, getDoc, updateDoc, runTransaction, query, where, orderBy, limit, serverTimestamp, deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

         /* 1) GANTI konfigurasi di bawah dengan Firebase Console > Project settings > Your apps.
            2) Aktifkan Authentication > Email/Password, Firestore Database, dan Storage.
            3) Buat user kasir dari Authentication > Users. Jangan menyimpan password di file ini. */
         // Ganti dengan URL gambar GitHub RAW milik toko. Kosongkan untuk memakai gambar bawaan.
         const LOGIN_HERO_IMAGE_URL = 'https://erpmadebali.github.io/Roti-Anget-Subuh/logo.jpeg';

         const firebaseConfig = {
            apiKey: "AIzaSyDhWWLBX2DqO3Z0JW5E0TlI-wCuqrq98Pg",
            authDomain: "roti-anget-subuh.firebaseapp.com",
            projectId: "roti-anget-subuh",
            storageBucket: "roti-anget-subuh.firebasestorage.app",
            messagingSenderId: "697822931254",
            appId: "1:697822931254:web:365fbad4f1964b995a2b97",
            measurementId: "G-QD1FTD2M91"
         };
         /* URL gambar QRIS statis resmi milik toko (opsional). Untuk QRIS dinamis, integrasikan API acquirer/payment gateway. */
         const QRIS_IMAGE_URL = "data:image/png;base64,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"; // QR tampilan yang dipilih pengguna; uji scan sebelum transaksi nyata.
         const MERCHANT_QRIS_ID = "ID1025383607252";

         const $ = id => document.getElementById(id);
         const rupiah = n => new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}).format(Number(n) || 0);
         const today = () => {const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`};
         let app, auth, db, currentUser = null, products = [], cart = [], transactions = [], promos = [], customers = [], blastDrafts = [], activeBlastRecipients = [], activeBlastDraft = null, activeBlastIndex = 0, selectedCustomer = null;
         const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
         if (configured) {try {app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app); $('connectionState').textContent = 'Firebase siap (gambar disimpan di Firestore)';} catch (e) {$('loginMessage').textContent = 'Konfigurasi Firebase tidak valid: ' + e.message;} }
         else {$('loginMessage').textContent = 'Lengkapi firebaseConfig di dalam file sebelum login.';}
         $('todayText').textContent = new Date().toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
         $('stockDate').value = today();
         if (QRIS_IMAGE_URL) {$('qrisImageBox').outerHTML = `<img id="qrisImageBox" src="${QRIS_IMAGE_URL}" alt="Kode QRIS untuk dipindai pelanggan">`;}
         function message(id, text, kind = '') {const el = $(id); el.textContent = text; el.className = kind;}
         function showStockWarning(productName, available, required) {$('stockWarningText').innerHTML = `Produk <strong>${escapeHtml(productName)}</strong> hanya tersisa <strong>${Number(available) || 0} pcs</strong>, sedangkan kebutuhan transaksi <strong>${Number(required) || 0} pcs</strong>.<br><br>Silakan input tambah stock dahulu sebelum melakukan transaksi.`; $('stockWarningModal').classList.add('open');}
         function closeStockWarning() {$('stockWarningModal').classList.remove('open');}
         $('closeStockWarning').onclick = closeStockWarning;
         $('stockWarningModal').addEventListener('click', e => {if (e.target === $('stockWarningModal')) closeStockWarning();});
         document.addEventListener('keydown', e => {if (e.key === 'Escape' && $('stockWarningModal').classList.contains('open')) closeStockWarning();});
         function escapeHtml(s = '') {return String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));}
         let failedLoginCount = Number(sessionStorage.getItem('bakeryFailedLoginCount') || 0);
         // Foto login dapat menggunakan file milik toko di GitHub melalui URL RAW.
         if (LOGIN_HERO_IMAGE_URL.trim()) {
            try {$('loginScreen').style.setProperty('--login-hero-image', `url("${LOGIN_HERO_IMAGE_URL.trim().replace(/[\"\\]/g, '\\$&')}")`);} catch (imageConfigError) {console.warn('URL foto login tidak dapat diterapkan:', imageConfigError);}
         }

         // Simpan hanya email pengguna (bukan password) pada perangkat ini.
         try {const savedLoginEmail = localStorage.getItem('rotiAngetSubuhSavedEmail') || ''; if (savedLoginEmail) {$('loginEmail').value = savedLoginEmail; $('rememberUser').checked = true;} } catch (storageError) {console.warn('Penyimpanan email tidak tersedia:', storageError);}
         $('rememberUser').addEventListener('change', () => {if (!$('rememberUser').checked) {try {localStorage.removeItem('rotiAngetSubuhSavedEmail');} catch (storageError) {console.warn(storageError);} } });
         if (failedLoginCount > 3) $('adminHelp').style.display = 'block';
         $('loginForm').addEventListener('submit', async e => {e.preventDefault(); const enteredEmail = $('loginEmail').value.trim(); try {if ($('rememberUser').checked) localStorage.setItem('rotiAngetSubuhSavedEmail', enteredEmail); else localStorage.removeItem('rotiAngetSubuhSavedEmail');} catch (storageError) {console.warn('Email tidak dapat disimpan pada perangkat ini:', storageError);} if (!auth) {message('loginMessage', 'Konfigurasi Firebase belum diisi.', 'danger'); return;} try {message('loginMessage', 'Memverifikasi akun…'); await setPersistence(auth, browserSessionPersistence); await signInWithEmailAndPassword(auth, enteredEmail, $('loginPassword').value); $('loginPassword').value = ''; failedLoginCount = 0; sessionStorage.removeItem('bakeryFailedLoginCount'); $('adminHelp').style.display = 'none';} catch (err) {failedLoginCount++; sessionStorage.setItem('bakeryFailedLoginCount', String(failedLoginCount)); if (failedLoginCount > 3) $('adminHelp').style.display = 'block'; message('loginMessage', friendlyError(err), 'danger');} });
         function friendlyError(e) {const m = e.code || e.message || 'Terjadi kesalahan'; return m.includes('invalid-credential') || m.includes('wrong-password') ? 'Email atau password tidak sesuai.' : m.includes('user-not-found') ? 'Akun tidak ditemukan.' : m;}
         const ADMIN_EMAIL = 'admin@rotiangetsubuh.com';
         function isAdminUser() {return String(currentUser?.email || '').trim().toLowerCase() === ADMIN_EMAIL;}
         function applyRoleAccess() {
            const admin = isAdminUser();
            document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hidden', !admin));
            if (!admin) {
               const activePage = document.querySelector('.page.active');
               if (activePage && ['products', 'promos', 'stock', 'history', 'customers', 'promoBlast'].includes(activePage.id)) {
                  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
                  $('dashboard').classList.add('active'); $('pageTitle').textContent = 'Dashboard';
               }
               $('inputDataGroup').classList.remove('expanded'); $('inputDataToggle').setAttribute('aria-expanded', 'false'); $('managementGroup').classList.remove('expanded'); $('managementToggle').setAttribute('aria-expanded', 'false');
            }
         }
         if (auth) setPersistence(auth, browserSessionPersistence).then(() => onAuthStateChanged(auth, async user => {currentUser = user; if (user) {$('loginScreen').classList.add('hidden'); $('appScreen').classList.remove('hidden'); $('userEmail').textContent = (user.email || 'Kasir') + (String(user.email || '').trim().toLowerCase() === ADMIN_EMAIL ? ' • ADMIN' : ' • KASIR'); applyRoleAccess(); await loadAll();} else {$('loginPassword').value = ''; document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden')); $('appScreen').classList.add('hidden'); $('loginScreen').classList.remove('hidden');} })).catch(err => {console.error('Gagal mengatur sesi login:', err); message('loginMessage', 'Pengaturan sesi login gagal: ' + friendlyError(err), 'danger');});
         $('logoutBtn').onclick = async () => {$('loginPassword').value = ''; try {await signOut(auth);} catch (err) {console.error('Logout gagal:', err); message('loginMessage', 'Logout gagal: ' + friendlyError(err), 'danger');} };
         document.querySelectorAll('.nav button[data-page]').forEach(b => b.addEventListener('click', () => {if (!isAdminUser() && ['products', 'promos', 'stock', 'history', 'customers', 'promoBlast'].includes(b.dataset.page)) return; document.querySelectorAll('.nav button[data-page]').forEach(x => x.classList.remove('active')); b.classList.add('active'); document.querySelectorAll('.page').forEach(x => x.classList.remove('active')); $(b.dataset.page).classList.add('active'); const titles = {dashboard: 'Dashboard', products: 'Master Produk', promos: 'Seting Promo', stock: 'Input Stock', pos: 'Menu Kasir', history: 'Riwayat Transaksi', customers: 'Data Konsumen', promoBlast: 'Blast Promo WhatsApp'}; $('pageTitle').textContent = titles[b.dataset.page] || b.textContent.trim(); $('sidebar').classList.remove('open');}));
         $('menuToggle').onclick = () => {$('sidebar').classList.toggle('open');};
         document.addEventListener('click', e => {if (window.matchMedia('(max-width:680px)').matches && $('sidebar').classList.contains('open') && !$('sidebar').contains(e.target) && !$('menuToggle').contains(e.target)) $('sidebar').classList.remove('open');});
         document.addEventListener('keydown', e => {if (e.key === 'Escape') $('sidebar').classList.remove('open');});
         $('inputDataToggle').addEventListener('click', () => {const group = $('inputDataGroup'); const expanded = group.classList.toggle('expanded'); $('inputDataToggle').setAttribute('aria-expanded', String(expanded));});
         $('managementToggle').addEventListener('click', () => {const group = $('managementGroup'); const expanded = group.classList.toggle('expanded'); $('managementToggle').setAttribute('aria-expanded', String(expanded));});

         async function loadAll() {try {const [p, t, pr] = await Promise.all([getDocs(collection(db, 'products')), getDocs(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))), getDocs(collection(db, 'promos'))]); products = p.docs.map(d => ({id: d.id, ...d.data()})); transactions = t.docs.map(d => ({id: d.id, ...d.data()})); promos = pr.docs.map(d => ({id: d.id, ...d.data()})).filter(x => x.active !== false); if (isAdminUser()) {const [c, bd] = await Promise.allSettled([getDocs(collection(db, 'customers')), getDocs(query(collection(db, 'promoBlasts'), orderBy('createdAt', 'desc')))]); customers = c.status === 'fulfilled' ? c.value.docs.map(d => ({id: d.id, ...d.data()})) : []; if (c.status === 'fulfilled') {try {await migrateCustomerCodes(customers);} catch (migrationError) {console.warn('Migrasi nomor pelanggan tertunda:', migrationError);} } blastDrafts = bd.status === 'fulfilled' ? bd.value.docs.map(d => ({id: d.id, ...d.data()})) : []; if (c.status === 'rejected' || bd.status === 'rejected') console.warn('Data Management tidak dapat dimuat. Periksa Firestore Rules.', c.reason || bd.reason);} renderAll();} catch (e) {console.error(e); $('connectionState').textContent = 'Gagal memuat data';} }
         function renderAll() {renderProducts(); renderStock(); renderPromoSettings(); updatePromoOptions(); if (!$('historyStart').value && !$('historyEnd').value) setHistoryToday(); else applyHistoryFilter(); renderDashboard(); updateProductOptions(); renderCart(); renderCustomers(); renderBlastDrafts();}
         function setProductPhotoPreview(src, label = 'Pratinjau foto produk') {
            const box = $('productImagePreview');
            if (src) {box.innerHTML = `<img src="${src}" alt="${escapeHtml(label)}" title="Klik untuk zoom" style="cursor:zoom-in">`; box.querySelector('img').onclick = () => openImageZoom(src, label);}
            else box.textContent = 'Belum ada foto dipilih';
         }
         function openImageZoom(src, title = 'Foto produk') {
            if (!src) return;
            $('zoomImage').src = src; $('zoomCaption').textContent = title + ' • Klik area gelap atau × untuk menutup';
            $('imageZoom').classList.add('open'); $('imageZoom').setAttribute('aria-hidden', 'false');
         }
         function closeImageZoom() {
            $('imageZoom').classList.remove('open'); $('imageZoom').setAttribute('aria-hidden', 'true'); $('zoomImage').src = '';
         }
         $('productImage').addEventListener('change', () => {
            const file = $('productImage').files[0];
            if (!file) {setProductPhotoPreview(''); return;}
            if (!file.type.startsWith('image/')) {message('productMessage', 'Pilih file gambar yang valid.', 'danger'); $('productImage').value = ''; setProductPhotoPreview(''); return;}
            const reader = new FileReader(); reader.onload = () => setProductPhotoPreview(reader.result, file.name);
            reader.onerror = () => message('productMessage', 'Gagal membaca file foto.', 'danger'); reader.readAsDataURL(file);
         });
         $('zoomClose').onclick = closeImageZoom;
         $('imageZoom').addEventListener('click', e => {if (e.target === $('imageZoom')) closeImageZoom();});
         document.addEventListener('keydown', e => {if (e.key === 'Escape') closeImageZoom();});
         document.addEventListener('click', e => {const im = e.target.closest('[data-zoom-src]'); if (im) openImageZoom(im.dataset.zoomSrc, im.dataset.zoomTitle || 'Foto produk');});
         function renderProducts() {$('productsTable').innerHTML = products.length ? products.map(p => `<tr><td><img class="thumb" src="${p.imageUrl || ''}" alt="Foto ${escapeHtml(p.name)}" data-zoom-src="${p.imageUrl || ''}" data-zoom-title="${escapeHtml(p.name)}" title="Klik untuk memperbesar" onerror="this.style.visibility='hidden'"></td><td>${escapeHtml(p.code)}</td><td>${escapeHtml(p.name)}</td><td>${rupiah(p.price)}</td><td><button class="btn btn-light" data-edit="${p.id}" style="padding:7px 10px">Edit</button></td></tr>`).join('') : '<tr><td colspan="5" class="empty">Belum ada produk.</td></tr>'; document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editProduct(b.dataset.edit)); $('productCode').value = awaitNextCode();}
         function awaitNextCode() {let max = 0; products.forEach(p => {const n = Number((p.code || '').replace(/^RAS/i, '')); if (Number.isFinite(n)) max = Math.max(max, n)}); return 'RAS' + String(max + 1).padStart(3, '0');}
         function editProduct(id) {const p = products.find(x => x.id === id); if (!p) return; $('productCode').value = p.code; $('productName').value = p.name; $('productPrice').value = p.price; $('productForm').dataset.edit = id; $('productImage').value = ''; setProductPhotoPreview(p.imageUrl || '', p.name); message('productMessage', 'Mode edit: simpan untuk memperbarui produk. Foto lama tetap digunakan jika tidak memilih foto baru.');}
         $('resetProduct').onclick = () => {$('productForm').dataset.edit = ''; setProductPhotoPreview(''); setTimeout(() => $('productCode').value = awaitNextCode(), 0);};
         // Kompres foto di browser lalu simpan sebagai Data URL Base64 pada field imageUrl di Firestore.
         // Target aman < 700 KB agar dokumen tetap di bawah batas Firestore 1 MiB.
         async function imageToBase64(file) {
            if (!file) return '';
            if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
            const source = await new Promise((resolve, reject) => {const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = () => reject(new Error('Gagal membaca file gambar.')); r.readAsDataURL(file);});
            const img = await new Promise((resolve, reject) => {const im = new Image(); im.onload = () => resolve(im); im.onerror = () => reject(new Error('File gambar tidak dapat dibuka.')); im.src = source;});
            const scale = Math.min(1, 600 / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(img.width * scale)); canvas.height = Math.max(1, Math.round(img.height * scale));
            const ctx = canvas.getContext('2d'); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let quality = .72, result = canvas.toDataURL('image/jpeg', quality);
            while (result.length * 0.75 > 650 * 1024 && quality > .35) {quality -= .08; result = canvas.toDataURL('image/jpeg', quality);}
            if (result.length * 0.75 > 700 * 1024) throw new Error('Foto masih terlalu besar setelah kompresi. Gunakan foto dengan resolusi lebih kecil.');
            return result;
         }
         $('productForm').onsubmit = async e => {
            e.preventDefault(); try {
               const editId = $('productForm').dataset.edit; const code = $('productCode').value || awaitNextCode();
               let imageUrl = editId ? (products.find(p => p.id === editId)?.imageUrl || '') : '';
               const file = $('productImage').files[0]; if (file) imageUrl = await imageToBase64(file);
               const data = {code, name: $('productName').value.trim(), price: Number($('productPrice').value), imageUrl, updatedAt: serverTimestamp()};
               if (editId) await updateDoc(doc(db, 'products', editId), data); else {data.stock = 0; data.createdAt = serverTimestamp(); await setDoc(doc(db, 'products', code), data);}
               message('productMessage', 'Produk berhasil disimpan ke Firestore. Foto tersimpan sebagai Base64.', 'success'); $('productForm').reset(); $('productForm').dataset.edit = ''; setProductPhotoPreview(''); await loadAll();
            } catch (err) {console.error('Simpan produk:', err); message('productMessage', 'Gagal menyimpan: ' + friendlyError(err), 'danger');}
         };
         function renderPromoSettings() {const el = $('promoList'); if (!el) return; el.innerHTML = promos.length ? promos.map(x => `<span class="promo-chip">${escapeHtml(x.name)} • ${Number(x.percent) || 0}% <button type="button" data-delete-promo="${x.id}" style="border:0;background:none;color:#a33;cursor:pointer;font-weight:bold">×</button></span>`).join('') : '<span class="muted">Belum ada promo.</span>'; el.querySelectorAll('[data-delete-promo]').forEach(b => b.onclick = async () => {if (!confirm('Hapus promo ini?')) return; try {await deleteDoc(doc(db, 'promos', b.dataset.deletePromo)); await loadAll(); message('promoMessage', 'Promo berhasil dihapus.', 'success');} catch (e) {message('promoMessage', 'Gagal menghapus promo: ' + friendlyError(e), 'danger');} });}
         function updatePromoOptions() {const select = $('posPromo'); if (!select) return; const selected = select.value; select.innerHTML = '<option value="">Tanpa Promo</option>' + promos.map(x => `<option value="${x.id}">${escapeHtml(x.name)} (${Number(x.percent)}%)</option>`).join(''); select.value = promos.some(x => x.id === selected) ? selected : ''; renderCart();}
         $('promoForm').onsubmit = async e => {e.preventDefault(); const name = $('promoName').value.trim(), percent = Number($('promoPercent').value); if (!name || !Number.isFinite(percent) || percent <= 0 || percent > 100) {message('promoMessage', 'Nama promo wajib diisi dan discount harus 0,01–100%.', 'danger'); return;} try {await addDoc(collection(db, 'promos'), {name, percent, active: true, createdBy: currentUser.uid, createdAt: serverTimestamp()}); $('promoForm').reset(); message('promoMessage', 'Promo berhasil disimpan dan tersedia di menu kasir.', 'success'); await loadAll();} catch (err) {message('promoMessage', 'Gagal menyimpan promo: ' + friendlyError(err), 'danger');} };
         function selectedPromo() {return promos.find(x => x.id === $('posPromo').value) || null;}
         function discountValue(subtotal, promo = selectedPromo()) {return promo ? Math.round(subtotal * (Number(promo.percent) || 0) / 100) : 0;}
         $('posPromo').onchange = () => renderCart();
         function normalizePhone(value) {return String(value || '').replace(/\D/g, '');}
         function isCustomerCode(value) {return /^NPRAS\d{4,}$/i.test(String(value || '').trim());}
         function customerSequence(value) {const m = String(value || '').match(/^NPRAS(\d+)$/i); return m ? Number(m[1]) : 0;}
         function formatCustomerCode(n) {return 'NPRAS' + String(n).padStart(4, '0');}
         const customerCounterRef = () => doc(db, 'counters', 'customerCode');
         async function migrateCustomerCodes(rows) {
            const ordered = rows.slice().sort((a, b) => {
               const av = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0, bv = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
               return av - bv || String(a.phone || a.id).localeCompare(String(b.phone || b.id));
            });
            const maxExisting = ordered.reduce((m, c) => Math.max(m, customerSequence(c.customerCode)), 0);
            const missing = ordered.filter(c => !c.customerCode);
            if (!missing.length) {
               await runTransaction(db, async tx => {
                  const counterSnap = await tx.get(customerCounterRef());
                  const current = Number(counterSnap.exists() ? counterSnap.data().lastNumber : 0) || 0;
                  if (current < maxExisting) tx.set(customerCounterRef(), {lastNumber: maxExisting, updatedAt: serverTimestamp()}, {merge: true});
               });
               return;
            }
            for (let i = 0; i < missing.length; i += 300) {
               const chunk = missing.slice(i, i + 300);
               await runTransaction(db, async tx => {
                  const counterSnap = await tx.get(customerCounterRef());
                  const snapshots = [];
                  for (const c of chunk) snapshots.push({customer: c, ref: doc(db, 'customers', c.id), snap: await tx.get(doc(db, 'customers', c.id))});
                  let next = Math.max(Number(counterSnap.exists() ? counterSnap.data().lastNumber : 0) || 0, maxExisting);
                  for (const row of snapshots) {
                     if (!row.snap.exists() || row.snap.data().customerCode) continue;
                     next++;
                     const code = formatCustomerCode(next);
                     tx.update(row.ref, {customerCode: code, updatedAt: serverTimestamp()});
                     row.customer.customerCode = code;
                  }
                  tx.set(customerCounterRef(), {lastNumber: next, updatedAt: serverTimestamp()}, {merge: true});
               });
            }
         }
         let customerLookupToken = 0;
         function showNewCustomerFields(show) {$('customerNewFields').classList.toggle('hidden', !show);}
         async function findCustomerFromPOS(raw) {
            const value = String(raw || '').trim(), token = ++customerLookupToken;
            selectedCustomer = null;
            if (!value) {showNewCustomerFields(false); $('customerHint').textContent = 'Nomor pelanggan / HP opsional.'; return;}
            try {
               let snap = null;
               if (isCustomerCode(value)) {
                  const found = await getDocs(query(collection(db, 'customers'), where('customerCode', '==', value.toUpperCase()), limit(1)));
                  if (token !== customerLookupToken) return;
                  if (!found.empty) snap = found.docs[0];
               } else {
                  const phone = normalizePhone(value);
                  $('customerPhone').value = phone;
                  if (phone.length < 8) {showNewCustomerFields(true); $('customerHint').textContent = 'Nomor HP minimal 8 angka, atau masukkan kode NPRAS pelanggan.'; return;}
                  snap = await getDoc(doc(db, 'customers', phone));
               }
               if (token !== customerLookupToken) return;
               if (snap && snap.exists()) {
                  selectedCustomer = {id: snap.id, ...snap.data()};
                  $('customerPhone').value = selectedCustomer.customerCode || selectedCustomer.phone || selectedCustomer.id;
                  $('customerName').value = selectedCustomer.name || '';
                  $('customerName').readOnly = true;
                  $('customerAddress').value = selectedCustomer.address || '';
                  $('customerPromoConsent').checked = !!selectedCustomer.promoConsent;
                  showNewCustomerFields(!selectedCustomer.address);
                  $('customerHint').textContent = `Pelanggan ditemukan: ${selectedCustomer.name || 'Tanpa nama'} • ${selectedCustomer.customerCode || 'kode akan dibuat saat transaksi'}. Nomor HP tersimpan privat.`;
               } else {
                  const phone = normalizePhone(value);
                  if (isCustomerCode(value)) {
                     showNewCustomerFields(false);
                     $('customerHint').textContent = 'Nomor pelanggan tidak ditemukan. Periksa kembali kode NPRAS.';
                     return;
                  }
                  $('customerName').value = ''; $('customerName').readOnly = false;
                  $('customerAddress').value = ''; $('customerPromoConsent').checked = false;
                  showNewCustomerFields(true);
                  $('customerHint').textContent = 'Nomor HP baru. Lengkapi nama dan alamat pelanggan untuk pendaftaran otomatis.';
               }
            } catch (err) {
               console.error(err); showNewCustomerFields(true);
               $('customerHint').textContent = 'Tidak dapat memeriksa pelanggan: ' + friendlyError(err);
            }
         }
         $('customerPhone').addEventListener('blur', () => findCustomerFromPOS($('customerPhone').value));
         $('customerPhone').addEventListener('keydown', e => {if (e.key === 'Enter') {e.preventDefault(); findCustomerFromPOS($('customerPhone').value);} });
         $('customerPhone').addEventListener('input', () => {customerLookupToken++; selectedCustomer = null; $('customerName').value = ''; $('customerName').readOnly = false; $('customerAddress').value = ''; $('customerPromoConsent').checked = false; showNewCustomerFields(false); $('customerHint').textContent = 'Masukkan kode NPRAS atau nomor HP, lalu pilih/keluar dari kolom untuk mencari.';});
         function updateProductOptions() {$('stockProduct').innerHTML = '<option value="">Pilih produk…</option>' + products.map(p => `<option value="${p.id}">${escapeHtml(p.name)} (${p.code})</option>`).join(''); $('productOptions').innerHTML = products.map(p => `<option value="${escapeHtml(p.code)}">${escapeHtml(p.name)}</option>`).join('');}
         function renderStock() {$('stockTable').innerHTML = products.length ? products.map(p => `<tr><td>${escapeHtml(p.code)}</td><td>${escapeHtml(p.name)}</td><td><b>${Number(p.stock) || 0} pcs</b></td></tr>`).join('') : '<tr><td colspan="3" class="empty">Belum ada data.</td></tr>';}
         $('stockForm').onsubmit = async e => {e.preventDefault(); const id = $('stockProduct').value, qty = Number($('stockQty').value), date = $('stockDate').value; if (!id || qty < 1) return; try {await runTransaction(db, async tx => {const r = doc(db, 'products', id), s = await tx.get(r); if (!s.exists()) throw new Error('Produk tidak ditemukan'); tx.update(r, {stock: (Number(s.data().stock) || 0) + qty, updatedAt: serverTimestamp()});}); await addDoc(collection(db, 'stockEntries'), {productId: id, productName: products.find(p => p.id === id)?.name || '', qty, date, createdBy: currentUser.uid, createdAt: serverTimestamp()}); message('stockMessage', 'Stock berhasil ditambahkan.', 'success'); $('stockForm').reset(); $('stockDate').value = today(); await loadAll();} catch (err) {message('stockMessage', 'Gagal input stock: ' + friendlyError(err), 'danger');} };
         function findProduct(value) {const v = value.trim().toLowerCase(); return products.find(p => p.code.toLowerCase() === v || p.name.toLowerCase() === v);}
         let selectedProduct = null;
         $('posCode').addEventListener('input', () => {selectedProduct = findProduct($('posCode').value); const p = selectedProduct; if (p) {$('productPreview').innerHTML = `<img src="${p.imageUrl || ''}" onerror="this.style.visibility='hidden'"><div><strong>${escapeHtml(p.name)}</strong><div class="muted">${p.code} • Stok: ${p.stock || 0} pcs</div><div class="price">${rupiah(p.price)}</div></div>`;} else {$('productPreview').innerHTML = '<div class="empty" style="width:100%">Produk tidak ditemukan. Pilih kode/nama yang tersedia.</div>';} });
         $('addCartBtn').onclick = () => {const p = findProduct($('posCode').value), qty = Number($('posQty').value); if (!p || qty < 1) {message('checkoutMessage', 'Pilih produk dan qty yang valid.', 'danger'); return;} const existing = cart.find(x => x.id === p.id); const next = (existing?.qty || 0) + qty; if (next > Number(p.stock || 0)) {showStockWarning(p.name, Number(p.stock) || 0, next); return;} if (existing) existing.qty = next; else cart.push({id: p.id, code: p.code, name: p.name, price: Number(p.price), qty, imageUrl: p.imageUrl || ''}); $('posCode').value = ''; $('posQty').value = 1; $('productPreview').innerHTML = '<div class="empty" style="width:100%">Pilih produk untuk melihat detail.</div>'; selectedProduct = null; message('checkoutMessage', ''); renderCart();};
         function cartSubtotal() {return cart.reduce((s, x) => s + x.price * x.qty, 0);}
         function cartDiscount() {return discountValue(cartSubtotal());}
         function cartTotal() {return Math.max(0, cartSubtotal() - cartDiscount());}
         function renderCart() {$('cartTable').innerHTML = cart.length ? cart.map((x, i) => `<tr><td>${escapeHtml(x.name)}</td><td>${x.qty}</td><td>${rupiah(x.price * x.qty)}</td><td><button class="btn btn-danger" data-remove="${i}" style="padding:6px 9px">×</button></td></tr>`).join('') : '<tr><td colspan="4" class="empty">Keranjang masih kosong</td></tr>'; $('cartSubtotal').textContent = rupiah(cartSubtotal()); $('cartDiscount').textContent = '- ' + rupiah(cartDiscount()); $('cartTotal').textContent = rupiah(cartTotal()); const promo = selectedPromo(); $('promoInfo').textContent = promo ? `${promo.name}: potongan ${promo.percent}%` : 'Pilih promo jika tersedia.'; document.querySelectorAll('[data-remove]').forEach(b => b.onclick = () => {cart.splice(Number(b.dataset.remove), 1); renderCart();}); updateChange();}
         $('paymentMethod').onchange = () => {const q = $('paymentMethod').value === 'QRIS'; $('qrisFields').classList.toggle('hidden', !q); $('cashFields').classList.toggle('hidden', q);};
         $('cashReceived').oninput = () => {const clean = $('cashReceived').value.replace(/[^0-9]/g, ''); if ($('cashReceived').value !== clean) $('cashReceived').value = clean; updateChange();};
         $('qrisReceived').oninput = () => {const clean = $('qrisReceived').value.replace(/[^0-9]/g, ''); if ($('qrisReceived').value !== clean) $('qrisReceived').value = clean;};
         function updateChange() {const change = Number($('cashReceived').value || 0) - cartTotal(); $('changeAmount').textContent = rupiah(Math.max(0, change));}
         $('clearCartBtn').onclick = () => {cart = []; renderCart(); message('checkoutMessage', 'Keranjang dikosongkan.');};
         $('checkoutBtn').onclick = async () => {
