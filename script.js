         import {initializeApp, deleteApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
         import {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence, inMemoryPersistence} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
         import {getFirestore, collection, doc, setDoc, addDoc, getDocs, getDoc, updateDoc, runTransaction, query, where, orderBy, limit, serverTimestamp, deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

         /* 1) GANTI konfigurasi di bawah dengan Firebase Console > Project settings > Your apps.
            2) Aktifkan Authentication > Email/Password, Firestore Database, dan Storage.
            3) Buat user kasir dari Authentication > Users. Jangan menyimpan password di file ini. */
         // Ganti dengan URL gambar GitHub RAW milik toko. Kosongkan untuk memakai gambar bawaan.
         const LOGIN_HERO_IMAGE_URL = 'https://erpmadebali.github.io/Roti-Anget-Subuh/logo.jpeg';

         const firebaseConfig = {
            apiKey: "AIzaSyC_44mGIwcVsQplby6YcIRvGrKrYqi4o_U",
            authDomain: "koperasi-8da9b.firebaseapp.com",
            databaseURL: "https://koperasi-8da9b-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "koperasi-8da9b",
            storageBucket: "koperasi-8da9b.firebasestorage.app",
            messagingSenderId: "17465856486",
            appId: "1:17465856486:web:7fa64dfa8b94623f778627",
            measurementId: "G-SCG0ERBHRB"
         };
         /* URL gambar QRIS statis resmi milik toko (opsional). Untuk QRIS dinamis, integrasikan API acquirer/payment gateway. */
         const QRIS_IMAGE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4QAAAOEAQAAAADRNcKWAAAR8ElEQVR42u2dza7rSlbH/8v2uY50W3JmtIQgmTBmigSSw4jH6O63YBZviQfgDS68BYw6aSTUM3iAFiStlqBHZEt9ILnH9p9BfbjsOImzd5ydvfcq6d6zkzj1c1WqanlVrQ8h7lueI9y7KFGJSlSiEpWoRCV+VCJI1u13YtK8Hz7mZSRL8yEJLAlAyM5VrkZyj5QkN92audPfUYlKVKISlfgxiCl3eBaRBECCSsQJQhER84o1xEhaUgSVTHCQ6VVECf6eBCJ1P+D6Vsnoyr5FXPr3dwCAvAYk6j4dnHuUeHmvmgYtTB2iY1WJj0YstFeVeF2t2qvH8goA8DO62bSsjdyRmLWIfDHapMSNcDqlsTKQYjGJZfOu0T2NtloiZRlqs6R9JawbfRZCco+M3LTkY6ixdleAJxHX+qT1QXl9Nz6LiMjkqFefRERkbm99pfNRV3IlKlHn4+doowS6ldywjaE8TtqSVQQwOmtH9ztIxq0sempL+iE5AUFSglHMSgAgLoGYtml8uaZ3po0Fqjvrj4WuALoCKFGJSry+JLeuUIT3biNf18b5hkYqVvZCRk74U6zo56nngozYDm7jWsxKu+3eUT3eyFnp7FCiEvXJSomfjRiNSyTNTnABo7GSLCEsrfaa3HB2xCxD2fvUr2HW17cx55MsjXCv7AkyUEkydu9fvS70PuNk4SlyQDQnyRudHUoctsejvarERyBSe3WMFWD52xsQL56qkk+RkfuSFH/S+mgx9BngIO5SfpPvGTIrSe3pdGRoAFAQQA12ZP+zvMkzuTlFDk6SLfGp+/4Y80Jnx+MTRXtViUp8GCIfeAW4TgetpNMo8UfWbDc25UGu2bWercb7HRMAR+cF6c0U1xl1dow8Lz5Sr/LDtVEeoFdFpZUSRxivyStmOF+0BFwiCisxeqp5HZeVHDXKEyiA1ACjdH+hV5+8VnyweuSSxVW6eas4XXkdBY8PdvNbz62UqEQlvn/i2J5Bcvc28iry9UTni4Nf1l1h6M56h56xbmWOZ8n+57/75SglQXjOKgsApESAiDR+PbBXBnJqgqrZGE6cpuvL9AAgX63DPuqXrwN6kRKXHeEamX4ZXz6WugI8FrHWXh2BGGmvKvF+xPLVxNAnJ/3xpXsdM26Q2TgPrhTN7dnITiwBEVerCLD/4u7BysqI5LP4qmJ+le/5VVIrIV10qVkrsgQA5MabVXhUABIS+uva2BkSeOqm5oEgJlkitp66I0SXos6Oj01MtFeVqMTxiXKl9uOJ8xes2KSJLRFKy+NIh0aja8x8nATaYMadl5LkCjlXJsKEETMsYhdBwsskuu93ZKgRezPzZSOrUvd2S7c0snF6olnFdfr+BLueNU7HqhKVqMSjMtVeHYG4u42GMZC4u8Srz9Cja4gz69vxLHMAa1nayERPkROlBQD6/dVlLSJCgiISQVhDWNr4iAmAPaZAjUpSlihxcF/UFUCJSvwAxOITSKtCR859enVYXQkA/Nlv8Bd/UzQj5ueY50AYlUBa2qj8Ea1FqLVdZUQBKpltAEDqHwH8/RGm+ZO/AX6dYjtvbD9n7dPArrz/fUcvdtf+zrY1tm+sF9agJyZQSVzqyFGiEj8jUfdzPgax/zRwc3vQ6twgWp/aWWyMR9m9JIiyJLWJVyR08Yuy3Ta4fjs/2avPMsWzLAAAOcVE5EVfTpkherLZXSUPcx2rSlSiEpX4boiXakxwncWr1Oe+YHZCKwHS/VbO3JE7D9zKHBm3Mk2dKF2Eoql1sijRkdQSVpJA7O7o9MQzQBDTfgNjM7NDxhWAnEdni3Vz6mgsY/xdmP1V83kJk58GAHxYfCMt75GLrfxoY7XWFUCJSlTiTYlDfEWioVsCruyuu4euGGQUEzicFrrWEgbwssoVJ61YWkkVh7ad4b9ejpUQq755ZwnhHql9GZPctexrGmLuJWQBy6ob65uWVY6cI8ZWWJZn5ONOx6oSlfiJiVPt1bcl9u8DxvwPq+CQq0AYzqzGE/iVZ8UcLnbp6lq6IAIQ85tM8Mc+nFpuRMhBkiB6jJNABXJuvAeEK1su6b0ancChiysXEsnFIv4Xaz6aNjU43cpbk56M+m501R9ksC7D1apa6Fj9fMSF9urt7vBx21jfnRjdjPyGvbq6FzEZYT7GHNTGnCvMuLZxXhZnRw4pTqOy+Td7rjNGoigR1+101U4va0cLz623hb2iBuy+qfRokObT2l4RB94WK6fRxf6jgbud9d3nY3R3Yv0Ga84tpsMHlsilPuco8V3Njs8aIcQkwWzveA4pvwprMxKrEpEpgPyfAPwtYn6VCWBsTf153pIbzKwG2RBtBLbY7q/aXNZerpY+07U5C4x9SmuvFcdei4x7vBGvU4rf7HekrgBKfCdE0V5V4l1WuaOVfAfg368bq52woZfc8UlylZErzLw2l/n9VZvjyoVrCaRVqAt6r/rYW65Y1TDmHllHyXP7oG2i8dZnowCaf0Oi9dsnjeVMEEimQ0yDt+5hLfPux6roCqDEu6102qsfg9iRVtPg/+cGivHc46vaOI8LuLPAzZDhWQMmElpn4ftC0qRfyruHir9rEWflX4sToc734WKvsIca/k75V8n8zmpl6o8AUGzG56asu8zY7tuGW7N9K/ngSGjFfYbJ64m8++z4DPKRn6CNShxzdoiO1VGJMi5RouOe5VcRyc4J2cYSZta5qKXNxXa308cKN98zf8fs0eZ2yFk0Vp2XTgNzrpyMFB4k5UEiVHLi6nOJL0pdAe4hJT9Sr+5UdtxxPf8IvVp+otkxBlH6NB3J7EnZFP0mOIEqYnW5P/3tRRBAiNRukIZcI/kOk2yXEcifBYjtLxtXf9XWH/mPknOD2XbTklpem9vbO2zNBZEgFqoU5/UrI20v9qqv5bu238bROk6Jlr3jdPLy37G+yZiIXj3K3vL8sX70+TjXNUeJSnxA4uZ1K0sJ4KcXiOL8K7YytzYzvaXiwgX8FAFFiqpHB6hE5P+4w1ZEFvt+/THwnT/SHeFtROt+7RNCFvZs0J8bpl2NNWaJuPj+VdYyvTL0bKmKWGeHEpWoRCWOTswCQ8mzmw1hRJZwJTf1/frSd8vU2XN2iUsWEmxYOmnUIpJk4aQVvXXnzCSqMNufeXu3k8mhuIUHu7CtzfnH/JSrRnjqWFXiYxH3H7CN1JFzU6IE/9dePUvMvG61rAfqje0yOamIHulW376bbVo2Qc4elWL8GuOSEQARlzr4kP3z4uiXTHk22hvwJHOb++l/L0vKTlWTwwKARE3ei/DaBMBBRL7noZXpXuejEpWoRCW+a6K8ropid30bj6Nku0qeROIgQAwQOYn6Sy+hl1mBJVkbyxZJQElwOLZe7fZq7j0tdjAWrEdfqUTki1NnF+12Nk+sdUt/bMVe07GqRCUqUYkfi7h5jYTsb8PmqjYunaRa1gBiKy+FB5kcXfvc2mb5JhGAlIH7RIm+GAhb790B7DEr1k0UnUqSzERxiwCUIGCi7NjbmL7mdzTOJ9Nb/WZPLjXjW4wczcl+stS65ihRieMTi5fdnwQxPAfrhGylindlFupVktaIfh7/wpz/xTbyWRDpuoD9euP70DrvSFkitVFfdq1oNtMj/TFnAUT7Gvzh2w+X7Fx+0nrVct6I+VXSE6eBs0FnrENLozmWOjuUqEQl6vPqYxEpIt76cvkYcR525yWyE2jmRDDlzkcnXbbjdpftJ4CgNFeVjUROfeS1Pok8Xil1BVCiEpWoxEfRH9sSp8ZLdngiJ1PbzCzUH+tjLdX+KZKcERXpCpMzvbrAVnKu5c9JPvudz5xBrZWIJP2/g0Q+B9NBvrfS8ac5fy9iwwXsT/6Ou/MCfISRM32jsTr90PNxp2vOaMTdG7Zx8WF7tZmPq0dqI99rr04HjhyRMArLNfK1yVSY2+ig5B7Zpnnl8wG68qWdbdfsri7/y0egsVU0fhtOp+tmKsy5Qe53dVvEdpZetIn2dXxE3BjZvkdq2bHGJtX9HCUqUYkPRLRZkV6szRWBHjc0OinkrFycniFSpKs/urKVIIooT+iLbS2zkgmA1CSt2AVq576zwPaXzRXdLF2NtdO05CH2ATYfenYUr6iieEUb5++kV4t38ju+uqg34qclLrAA0tUdiTkLzKxAOcj8Yl88RSfnYzJEloc2Ohl3yFgj50aM3veTb14BbLQ5afIVFv5kcNckXpq52vZIySK7cBo4xa8AbLgA8Hf4w2Rgj1XT2kvI1pZQVezVW1+Jr6vvU/bqDsDkDsTivfdq8vgj5xVWiPVbj9XJhR5/ngKZdXqfh0/MjbZUAlgOf3hLaf47RdwBmGKKdA/MuJaca3H2PmJ0wya4aY+ojWJSgLiMeZgA23m+QpXEZZUECYyHzg5+pDXnPWhz2qtKVKISX0LcSs4NtjI77xdQyb/aHBMg3YngsgZsnoaYJSrJGDjixVf4lecs8BSBEjUnc/jLi884DrCO/G1OUA2M9LJ43N+ROlaVqM852qt3JMqj/44NcdaXA74+sYryzLo6OUMUEliLi7xiPL1Fli5TESUxV8oXI7FErGe5kWMAgKfIZrv9KmJP53bIa8Q8iEjK55OeeqPrVzo7lKhEJSrxtvfY+f7M2umvbI67X4b2HoLISy7vweY+XF6jBdics9vjEzlbl49mXYLyhQwyE+EoO0PjXZfxSUQkbUcKe4BngE87ViNdAUYg1tqrSvyEa07S1fxmgdTJOVYbnZRry6u1LLAWsmBg7XhWL2U9sI1XFTJIiiw1I0DqZXBBlZjjuMMEgNRAJTErSfdVEpc6H9+QWN9UY9ZePVdOzcxbZEe97q4S/R2VOE5poolk3hsgI/lvu0azSo9ijxg9jn1lD3gnMnvYFZ+IEjZt3cmzffkk8sWc1RnfvCa+S++MpEx8ftpbyEeCVjB2lwOpmwwRAHCYZHYL1r55sGkjHnrkUGeHEt8RUbRXlRhIK5LWxL0T2RKNDzR95BMJvZ/9p8J2pC3rc80gTasxp7/kAb3ojFOJQBErI+sjPc7EJfkqk5v3qjQzxZ7NmTO6CEDiJWB/wtz3N3Kos0OJSlTi+yOmTe7wEZ58nFwLAyZn9nTOZE5fNhKQRydkEp7P+dvdA/gOc+R1IDCtfHxtvvLTK/mPIFsfV6J7j0pUohIfj7h6nDbKLYl7PPeqDKHE+QeEkuRlxJk3yDgMyDbziyiUHz7SVrcjSO5RiUjmtwebmF2zlv7opCNsDOa2HGw0RvNuQDQJEMidq7C0YrPUCFpKVKISlThGeanesQ5iOzWlHI8ofS8ZjdnGfgXLeEfH7Gm4P7cKTvQ2mFnp6DIUdPRMWlWQ7fd9HS66ZFNhqwzbX9XZoUQlKvHNZAe7fwoktDWo79HG+rsnd7ZzLk7iAKKL3h+u5zL07kwu7+kjjhyz35nZfAHrXp2V5VW1503k5f2FNu5GaNxQL29dAT4VUWMhdlfyzrN0XOrIeRCijEVsYvY3smvZ7MwNGgHHe5bGiHDmzsp8Tjky1G1c9MXi2PqxtsrSkew4vxM4980qAABPL9vBbQJRavRFJSpRiW9IXLbMwT99r8oYxFOWJKFlx8BzuWXdaBwXdOT1AljLlQ2PS0aAEDhIxu281Qqdj0pUohKVOC7xSURkgHXFm7bxpvnmnuVnXGFGIK8BOdIMbTQr/zdAskTlLeiNnf5a/Larl5EndwLnAOZYYSGF1EBsKSIy4O5rHatKVKISlfj5iNOLctHpdVa7rgvn1XZxx9PmjbOxuTJvv78KfebszmZo/djx8zbucc6zroRLI2dvoTH4eFC7DupYVaISlajEd0480qbcOV1gj9hE2j+hV13S5hp36bUUYGUiIBtC0YmbJgJIYiulJKCk1oByLaAkV+UL0JEzDnGlvfohiItb3732qq4AL9MTkj4t7jC5RxuXJ3J4H8+O4oUoKyEv2JyuFy6SJlviWWwoLdr/2gKzriTdA0BuUrNVMtIKoLNDie+FWGuvKlGJj/AstywBu8vZEXc7VDaFgNPp+qxJTflP73He7K+6WGTN/qrXV5ud1ubVCn7jtRzgN7cVkYWOHCUqUYmPQqT26nsnFibGpLxAmxTeuYnP+jsqUYlKVKISlahEJSpRiUpUohKVqMTxyv8DZ53T8PonjPQAAAAASUVORK5CYII="; // QR tampilan yang dipilih pengguna; uji scan sebelum transaksi nyata.
         const MERCHANT_QRIS_ID = "ID1025383607252";

         const $ = id => document.getElementById(id);
         const rupiah = n => new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits: 0}).format(Number(n) || 0);
         const today = () => {const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`};
         let app, auth, db, currentUser = null, products = [], cart = [], transactions = [], promos = [], customers = [], blastDrafts = [], uoms = [], rawMaterials = [], activeBlastRecipients = [], activeBlastDraft = null, activeBlastIndex = 0, selectedCustomer = null;
         let forecastProduct = null, forecastItems = [];
         let productionRecords = [], finishGoodRecords = [], wasteMaterialRecords = [], wasteProductRecords = [], stores = [], salesRecords = [], costOverheadMasters = [], costOverheadExpenses = [], supplierRecords = [], purchaseOrderRecords = [], supplierEditId = '', storeEditId = '', salesEditId = '', storePage = 1, salesPage = 1, wasteForecastCache = new Map(), expandedProductionId = null;
         const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
         if (configured) {try {app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app); $('connectionState').textContent = 'Firebase siap (gambar disimpan di Firestore)';} catch (e) {$('loginMessage').textContent = 'Konfigurasi Firebase tidak valid: ' + e.message;} }
         else {$('loginMessage').textContent = 'Lengkapi firebaseConfig di dalam file sebelum login.';}
         $('todayText').textContent = new Date().toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
         $('stockDate').value = today();
         if ($('poDate')) $('poDate').value = today();
         if (QRIS_IMAGE_URL) {$('qrisImageBox').outerHTML = `<img id="qrisImageBox" src="${QRIS_IMAGE_URL}" alt="Kode QRIS untuk dipindai pelanggan">`;}
         $('purchasingToggle')?.addEventListener('click', () => {const group = $('purchasingGroup'); const expanded = group.classList.toggle('expanded'); $('purchasingToggle').setAttribute('aria-expanded', String(expanded));});
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
               if (activePage && ['uom', 'rawMaterials', 'products', 'promos', 'history', 'soStock', 'customers', 'promoBlast', 'mrpProduction', 'finishGood', 'waste', 'accounting', 'masterCostOverhead', 'addSupplier', 'purchaseOrderMaterial', 'stockBahanBaku', 'costOverheadInput', 'reportProductionFG', 'reportShipment', 'reportSales', 'reportCosts', 'reportCOGS', 'reportStockFG', 'reportStockRM', 'reportProfitLoss'].includes(activePage.id)) {
                  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
                  $('dashboard').classList.add('active'); $('pageTitle').textContent = 'Dashboard';
               }
               $('inputDataGroup').classList.remove('expanded'); $('inputDataToggle').setAttribute('aria-expanded', 'false'); $('purchasingGroup').classList.remove('expanded'); $('purchasingToggle').setAttribute('aria-expanded', 'false'); $('managementGroup').classList.remove('expanded'); $('managementToggle').setAttribute('aria-expanded', 'false'); $('productionGroup').classList.remove('expanded'); $('productionToggle').setAttribute('aria-expanded', 'false');
            }
         }
         function showBrandNotice(title, messageText, duration = 2300) {
            return new Promise(resolve => {
               const overlay = $('brandNotice');
               $('brandNoticeTitle').textContent = title;
               $('brandNoticeMessage').textContent = messageText;
               overlay.classList.remove('hidden');
               window.setTimeout(() => {overlay.classList.add('hidden'); resolve();}, duration);
            });
         }
         if (auth) setPersistence(auth, browserSessionPersistence).then(() => onAuthStateChanged(auth, async user => {
            currentUser = user;
            if (user) {
               $('loginScreen').classList.add('hidden'); $('appScreen').classList.remove('hidden');
               const email = String(user.email || '').trim();
               const displayName = String(user.displayName || '').trim() || (email ? email.split('@')[0] : 'Pengguna');
               $('userEmail').textContent = (email || displayName) + (email.toLowerCase() === ADMIN_EMAIL ? ' • ADMIN' : ' • KASIR');
               applyRoleAccess();
               await loadAll();
               await showBrandNotice('Selamat Datang!', `Selamat datang di Aplikasi ROTI ANGET SUBUH, ${displayName}.`, 2300);
            } else {
               $('brandNotice').classList.add('hidden');
               $('loginPassword').value = '';
               document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
               $('appScreen').classList.add('hidden'); $('loginScreen').classList.remove('hidden');
            }
         })).catch(err => {console.error('Gagal mengatur sesi login:', err); message('loginMessage', 'Pengaturan sesi login gagal: ' + friendlyError(err), 'danger');});
         $('logoutBtn').onclick = async () => {
            $('logoutBtn').disabled = true;
            $('loginPassword').value = '';
            try {
               await showBrandNotice('Terima Kasih!', 'Terima kasih telah menggunakan Aplikasi ROTI ANGET SUBUH.', 2000);
               await signOut(auth);
            } catch (err) {
               console.error('Logout gagal:', err);
               message('loginMessage', 'Logout gagal: ' + friendlyError(err), 'danger');
            } finally {$('logoutBtn').disabled = false;}
         };
         document.querySelectorAll('.nav button[data-page]').forEach(b => b.addEventListener('click', () => {if (!isAdminUser() && ['uom', 'rawMaterials', 'products', 'promos', 'history', 'soStock', 'customers', 'promoBlast', 'mrpProduction', 'finishGood', 'waste', 'accounting', 'masterCostOverhead', 'addSupplier', 'purchaseOrderMaterial', 'stockBahanBaku', 'costOverheadInput', 'reportProductionFG', 'reportShipment', 'reportSales', 'reportCosts', 'reportCOGS', 'reportStockFG', 'reportStockRM', 'reportProfitLoss'].includes(b.dataset.page)) return; document.querySelectorAll('.nav button[data-page]').forEach(x => x.classList.remove('active')); b.classList.add('active'); const parentGroup = b.closest('.nav-group'); if (parentGroup) {parentGroup.classList.add('expanded'); const toggle = parentGroup.querySelector('.nav-parent'); if (toggle) toggle.setAttribute('aria-expanded', 'true');} document.querySelectorAll('.page').forEach(x => x.classList.remove('active')); $(b.dataset.page).classList.add('active'); const titles = {dashboard: 'Dashboard', uom: 'Master UOM/Unit', rawMaterials: 'Master Bahan Baku', products: 'Master Produk', promos: 'Seting Promo', stock: 'Input Stock', pos: 'Penjualan', printerSettings: 'Setting Printer', history: 'Riwayat Transaksi', soStock: 'SO Stock', customers: 'Data Konsumen', promoBlast: 'Blast Promo', mrpProduction: 'MRP Produksi', finishGood: 'Input Data Finish Good', waste: 'Input Data Waste', addStore: 'Add Store', inputSales: 'Input Sales', accounting: 'Accounting', masterCostOverhead: 'Master Data Cost Overhead', addSupplier: 'Add Supplier', purchaseOrderMaterial: 'Purchase Order Material', stockBahanBaku: 'Stock Bahan Baku'}; $('pageTitle').textContent = titles[b.dataset.page] || b.textContent.trim(); $('sidebar').classList.remove('open');}));
         $('menuToggle').onclick = () => {$('sidebar').classList.toggle('open');};
         document.addEventListener('click', e => {if (window.matchMedia('(max-width:680px)').matches && $('sidebar').classList.contains('open') && !$('sidebar').contains(e.target) && !$('menuToggle').contains(e.target)) $('sidebar').classList.remove('open');});
         document.addEventListener('keydown', e => {if (e.key === 'Escape') $('sidebar').classList.remove('open');});
         $('inputDataToggle').addEventListener('click', () => {const group = $('inputDataGroup'); const expanded = group.classList.toggle('expanded'); $('inputDataToggle').setAttribute('aria-expanded', String(expanded));});
         $('managementToggle').addEventListener('click', () => {const group = $('managementGroup'); const expanded = group.classList.toggle('expanded'); $('managementToggle').setAttribute('aria-expanded', String(expanded));});
         $('productionToggle').addEventListener('click', () => {const group = $('productionGroup'); const expanded = group.classList.toggle('expanded'); $('productionToggle').setAttribute('aria-expanded', String(expanded));});
         $('marketingToggle').addEventListener('click', () => {const group = $('marketingGroup'); const expanded = group.classList.toggle('expanded'); $('marketingToggle').setAttribute('aria-expanded', String(expanded));});
         $('cashierToggle')?.addEventListener('click', () => {const group = $('cashierGroup'); const expanded = group.classList.toggle('expanded'); $('cashierToggle').setAttribute('aria-expanded', String(expanded));});

         async function loadAll() {try {const [p, t, pr] = await Promise.all([getDocs(collection(db, 'products')), getDocs(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'))), getDocs(collection(db, 'promos'))]); products = p.docs.map(d => ({id: d.id, ...d.data()})); transactions = t.docs.map(d => ({id: d.id, ...d.data()})); promos = pr.docs.map(d => ({id: d.id, ...d.data()})).filter(x => x.active !== false); if (isAdminUser()) {const [c, bd, u, rm, prod, fg, wm, wp, st, sr, coh, coe, sup, po] = await Promise.allSettled([getDocs(collection(db, 'customers')), getDocs(query(collection(db, 'promoBlasts'), orderBy('createdAt', 'desc'))), getDocs(collection(db, 'uoms')), getDocs(collection(db, 'rawMaterials')), getDocs(collection(db, 'productionOrders')), getDocs(collection(db, 'finishGood')), getDocs(collection(db, 'wasteRawMaterials')), getDocs(collection(db, 'wasteProducts')), getDocs(collection(db, 'stores')), getDocs(query(collection(db, 'salesRecords'), orderBy('salesDate', 'desc'))), getDocs(collection(db, 'costOverheadMasters')), getDocs(collection(db, 'costOverheadExpenses')), getDocs(collection(db, 'suppliers')), getDocs(collection(db, 'purchaseOrders'))]); customers = c.status === 'fulfilled' ? c.value.docs.map(d => ({id: d.id, ...d.data()})) : []; if (c.status === 'fulfilled') {try {await migrateCustomerCodes(customers);} catch (migrationError) {console.warn('Migrasi nomor pelanggan tertunda:', migrationError);} } blastDrafts = bd.status === 'fulfilled' ? bd.value.docs.map(d => ({id: d.id, ...d.data()})) : []; uoms = u.status === 'fulfilled' ? u.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(a.code || '').localeCompare(String(b.code || ''))) : []; rawMaterials = rm.status === 'fulfilled' ? rm.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(a.code || '').localeCompare(String(b.code || ''))) : []; productionRecords = prod.status === 'fulfilled' ? prod.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(b.productionDate || '').localeCompare(String(a.productionDate || ''))) : []; finishGoodRecords = fg.status === 'fulfilled' ? fg.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(b.period || '').localeCompare(String(a.period || ''))) : []; wasteMaterialRecords = wm.status === 'fulfilled' ? wm.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(b.wasteDate || '').localeCompare(String(a.wasteDate || ''))) : []; wasteProductRecords = wp.status === 'fulfilled' ? wp.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(b.wasteDate || '').localeCompare(String(a.wasteDate || ''))) : []; stores = st.status === 'fulfilled' ? st.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(a.code || '').localeCompare(String(b.code || ''))) : []; salesRecords = sr.status === 'fulfilled' ? sr.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(b.salesDate || '').localeCompare(String(a.salesDate || ''))) : []; costOverheadMasters = coh.status === 'fulfilled' ? coh.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(a.code || '').localeCompare(String(b.code || ''))) : []; costOverheadExpenses = coe.status === 'fulfilled' ? coe.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(b.postingDate || '').localeCompare(String(a.postingDate || ''))) : []; supplierRecords = sup.status === 'fulfilled' ? sup.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(a.code || '').localeCompare(String(b.code || ''))) : []; purchaseOrderRecords = po.status === 'fulfilled' ? po.value.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => String(b.purchaseDate || '').localeCompare(String(a.purchaseDate || ''))) : []; if ([c, bd, u, rm, prod, fg, wm, wp, st, sr, coh, coe, sup, po].some(x => x.status === 'rejected')) console.warn('Sebagian data Management/Master tidak dapat dimuat. Periksa Firestore Rules.', c.reason || bd.reason || u.reason || rm.reason || prod.reason || fg.reason || wm.reason || wp.reason);} renderAll();} catch (e) {console.error(e); $('connectionState').textContent = 'Gagal memuat data';} }
         function renderAll() {renderProducts(); renderStock(); renderPromoSettings(); renderUoms(); renderRawMaterials(); renderCostOverheadMasters(); updateUomOptions(); updatePromoOptions(); if (!$('historyStart').value && !$('historyEnd').value) setHistoryToday(); else applyHistoryFilter(); renderDashboard(); updateProductOptions(); renderCart(); renderCustomers(); renderBlastDrafts(); updateMRPProductOptions(); initMRPFilters(); renderMRPProduction(); initFGFilters(); renderFinishGood(); updateWasteMaterialOptions(); updateWasteProductOptions(); renderWasteMaterialTable(); renderWasteProductTable(); renderSuppliers(); renderPurchaseOrders(); renderStockBahanBaku(); renderStores(); initSalesDateFilters(); renderSales(); updateSalesStoreOptions(); if (!$('soStart').value) initSOStockDates(); renderSOStock();}
         // MARKETING: master store dan pencatatan sales tersimpan di Firestore.
         async function allocateStoreCode() {
            const ref = doc(db, 'masterCounters', 'store'); let code = '';
            await runTransaction(db, async tx => {
               const snap = await tx.get(ref);
               const highest = stores.reduce((m, x) => Math.max(m, Number(String(x.code || '').replace(/^STR/i, '')) || 0), 0);
               const next = Math.max(Number(snap.exists() ? snap.data().lastNumber : 0) || 0, highest) + 1;
               tx.set(ref, {lastNumber: next, updatedAt: serverTimestamp()}, {merge: true});
               code = 'STR' + String(next).padStart(3, '0');
            }); return code;
         }
         function refreshStoreCode() {if ($('storeCode') && !storeEditId) $('storeCode').value = nextMasterCode(stores, 'STR');}
         function updateSalesStoreOptions(selected = '') {
            const sel = $('salesStore'); if (!sel) return; const previous = selected || sel.value;
            sel.innerHTML = '<option value="">Pilih Store...</option>' + stores.map(x => `<option value="${escapeHtml(x.id)}">${escapeHtml(x.code || '')} - ${escapeHtml(x.name || '')}</option>`).join('');
            if (stores.some(x => x.id === previous)) sel.value = previous;
         }
         function renderPagedTable(rows, pageSizeId, targetId, paginationId, columns, type, emptyColspan = 5) {
            const size = Math.max(1, Number($(pageSizeId)?.value || 5)), totalPages = Math.max(1, Math.ceil(rows.length / size));
            let current = type === 'store' ? storePage : salesPage; current = Math.min(current, totalPages);
            if (type === 'store') storePage = current; else salesPage = current;
            const start = (current - 1) * size, slice = rows.slice(start, start + size);
            $(targetId).innerHTML = slice.length ? slice.map(row => '<tr>' + columns(row).map(v => `<td>${v}</td>`).join('') + '</tr>').join('') : `<tr><td colspan="${emptyColspan}" class="empty">Belum ada data.</td></tr>`;
            $(paginationId).innerHTML = `<span class="muted" style="font-size:11px">Menampilkan ${rows.length ? start + 1 : 0}-${Math.min(start + size, rows.length)} dari ${rows.length} data</span><div class="actions"><button type="button" class="btn btn-light" data-prev ${current <= 1 ? 'disabled' : ''}>Previous</button><span class="muted" style="font-size:11px">Halaman ${current}/${totalPages}</span><button type="button" class="btn btn-light" data-next ${current >= totalPages ? 'disabled' : ''}>Next</button></div>`;
            $(paginationId).querySelector('[data-prev]').onclick = () => {if (type === 'store') storePage--; else salesPage--; type === 'store' ? renderStores() : renderSales();};
            $(paginationId).querySelector('[data-next]').onclick = () => {if (type === 'store') storePage++; else salesPage++; type === 'store' ? renderStores() : renderSales();};
         }
         function resetStoreForm() {storeEditId = ''; $('storeForm').reset(); $('storeCode').value = nextMasterCode(stores, 'STR'); $('storeForm').querySelector('[type="submit"]').textContent = 'Save Data';}
         function resetSalesForm() {salesEditId = ''; $('salesForm').reset(); $('salesDate').value = today(); $('salesForm').querySelector('[type="submit"]').textContent = 'Save Data'; updateSalesStoreOptions();}
         function renderStores() {
            if (!$('storesTable')) return;
            renderPagedTable(stores, 'storePageSize', 'storesTable', 'storePagination', x => [`<b>${escapeHtml(x.code || x.id)}</b>`, escapeHtml(x.name || ''), escapeHtml(x.address || ''), escapeHtml(x.contact || ''), `<div class="actions" style="gap:5px"><button type="button" class="btn btn-light" data-edit-store="${escapeHtml(x.id)}">Edit</button><button type="button" class="btn btn-danger" data-delete-store="${escapeHtml(x.id)}">Delete</button></div>`], 'store', 5);
            refreshStoreCode();
            $('storesTable').querySelectorAll('[data-edit-store]').forEach(b => b.onclick = () => {const x = stores.find(v => v.id === b.dataset.editStore); if (!x) return; storeEditId = x.id; $('storeCode').value = x.code || x.id; $('storeName').value = x.name || ''; $('storeAddress').value = x.address || ''; $('storeContact').value = x.contact || ''; $('storeForm').querySelector('[type="submit"]').textContent = 'Update Store'; $('storeMessage').textContent = 'Mode edit: ubah data toko, lalu klik Update Store.'; $('storeForm').scrollIntoView({behavior: 'smooth', block: 'start'});});
            $('storesTable').querySelectorAll('[data-delete-store]').forEach(b => b.onclick = async () => {const x = stores.find(v => v.id === b.dataset.deleteStore); if (!x) return; if (!confirm(`Hapus Store ${x.code || x.id} - ${x.name || ''}? Riwayat Input Sales yang sudah tersimpan tidak ikut dihapus.`)) return; try {await deleteDoc(doc(db, 'stores', x.id)); if (storeEditId === x.id) resetStoreForm(); await loadAll(); message('storeMessage', 'Data Store berhasil dihapus. Riwayat sales tetap tersimpan.', 'success');} catch (err) {message('storeMessage', 'Gagal menghapus Store: ' + friendlyError(err), 'danger');} });
         }
         function selectedSalesRows() {
            const month = $('salesFilterMonth')?.value || String(new Date().getMonth() + 1).padStart(2, '0');
            const year = $('salesFilterYear')?.value || String(new Date().getFullYear());
            const prefix = `${year}-${month}`;
            return salesRecords.filter(x => String(x.salesDate || '').startsWith(prefix));
         }
         function initSalesDateFilters() {
            // Filter selalu mengikuti tanggal live system saat halaman dimuat.
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const currentYear = now.getFullYear();
            const monthSelect = $('salesFilterMonth');
            const yearSelect = $('salesFilterYear');
            if (!monthSelect || !yearSelect) return;
            monthSelect.value = month;

            // Daftar tahun tersedia dari 2026 sampai 2035.
            const years = [];
            for (let y = 2026; y <= 2035; y++) years.push(y);
            if (!years.includes(currentYear)) years.push(currentYear);
            years.sort((a, b) => b - a);
            yearSelect.innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('');
            yearSelect.value = String(currentYear);
         }
         function printSalesPdf() {
            const rows = selectedSalesRows(), monthName = $('salesFilterMonth').selectedOptions[0]?.textContent || '', year = $('salesFilterYear').value || '';
            const total = rows.reduce((sum, x) => sum + (Number(x.salesValue) || 0), 0);
            const money = n => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
            const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
            const body = rows.map((x, i) => `<tr><td>${i + 1}</td><td>${esc(x.salesDate || '-')}</td><td>${esc(x.storeCode || '-')}</td><td>${esc(x.storeName || '-')}</td><td class="num">${money(x.salesValue)}</td></tr>`).join('');
            const win = window.open('', '_blank', 'width=1000,height=750');
            if (!win) {alert('Popup diblokir browser. Izinkan popup untuk mencetak PDF.'); return;}
            win.document.write(`<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Laporan Input Sales ${esc(monthName)} ${esc(year)}</title><style>body{font:12px Arial,sans-serif;color:#222;padding:28px}h1{font-size:20px;margin:0 0 5px}p{color:#555;margin:4px 0 18px}.meta{display:flex;justify-content:space-between;margin:14px 0}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:9px;text-align:left}th{background:#f1ece3}.num{text-align:right}.total{font-weight:bold;text-align:right;margin-top:14px}.foot{margin-top:35px;text-align:right;color:#777;font-size:10px}@media print{body{padding:0}@page{size:A4 portrait;margin:15mm}}</style></head><body><h1>ROTI ANGET SUBUH</h1><p>Sales Marketing Report</p><div class="meta"><strong>Periode: ${esc(monthName)} ${esc(year)}</strong><span>Total Data: ${rows.length}</span></div><table><thead><tr><th>No</th><th>Tanggal Sales</th><th>Kode Store</th><th>Nama Store</th><th>Sales Value</th></tr></thead><tbody>${body || '<tr><td colspan="5" style="text-align:center">Tidak ada data pada periode ini.</td></tr>'}</tbody></table><div class="total">Total Sales: ${money(total)}</div><div class="foot">Dicetak pada ${new Date().toLocaleString('id-ID')}</div><script>window.onload=()=>{window.focus();window.print();};<\/script></body></html>`);
            win.document.close();
         }
         function renderSales() {
            if (!$('salesTable')) return;
            const filteredSales = selectedSalesRows();
            const total = filteredSales.reduce((sum, x) => sum + (Number(x.salesValue) || 0), 0);
            $('salesFilterSummary').textContent = `${filteredSales.length} data • Total Sales: ${rupiah(total)}`;
            renderPagedTable(filteredSales, 'salesPageSize', 'salesTable', 'salesPagination', x => [escapeHtml(x.salesDate || ''), `<b>${escapeHtml(x.storeCode || '')}</b>`, escapeHtml(x.storeName || ''), `<b>${rupiah(x.salesValue)}</b>`, `<div class="actions" style="gap:5px"><button type="button" class="btn btn-light" data-edit-sales="${escapeHtml(x.id)}">Edit</button><button type="button" class="btn btn-danger" data-delete-sales="${escapeHtml(x.id)}">Delete</button></div>`], 'sales', 5);
            $('salesTable').querySelectorAll('[data-edit-sales]').forEach(b => b.onclick = () => {const x = salesRecords.find(v => v.id === b.dataset.editSales); if (!x) return; salesEditId = x.id; updateSalesStoreOptions(x.storeId || ''); $('salesStore').value = x.storeId || ''; $('salesValue').value = Number(x.salesValue) || ''; $('salesDate').value = x.salesDate || today(); $('salesForm').querySelector('[type="submit"]').textContent = 'Update Sales'; $('salesMessage').textContent = 'Mode edit: ubah data sales, lalu klik Update Sales.'; $('salesForm').scrollIntoView({behavior: 'smooth', block: 'start'});});
            $('salesTable').querySelectorAll('[data-delete-sales]').forEach(b => b.onclick = async () => {const x = salesRecords.find(v => v.id === b.dataset.deleteSales); if (!x) return; if (!confirm(`Hapus data sales ${x.storeCode || ''} tanggal ${x.salesDate || ''} senilai ${rupiah(x.salesValue)}?`)) return; try {await deleteDoc(doc(db, 'salesRecords', x.id)); if (salesEditId === x.id) resetSalesForm(); await loadAll(); message('salesMessage', 'Data sales berhasil dihapus.', 'success');} catch (err) {message('salesMessage', 'Gagal menghapus sales: ' + friendlyError(err), 'danger');} });
         }
         $('storeForm').onsubmit = async e => {
            e.preventDefault(); const name = $('storeName').value.trim(), address = $('storeAddress').value.trim(), contact = $('storeContact').value.trim();
            if (!name || !address || !contact) return;
            const editing = Boolean(storeEditId);
            try {if (editing) {await updateDoc(doc(db, 'stores', storeEditId), {name, address, contact, updatedAt: serverTimestamp(), updatedBy: currentUser.uid});} else {const code = await allocateStoreCode(); await setDoc(doc(db, 'stores', code), {code, name, address, contact, createdAt: serverTimestamp(), createdBy: currentUser.uid});} resetStoreForm(); await loadAll(); message('storeMessage', editing ? 'Data Store berhasil diperbarui.' : 'Store berhasil disimpan.', 'success');}
            catch (err) {message('storeMessage', 'Gagal menyimpan Store: ' + friendlyError(err), 'danger');}
         };
         $('resetStore').onclick = () => setTimeout(resetStoreForm, 0);
         $('salesForm').onsubmit = async e => {
            e.preventDefault(); const store = stores.find(x => x.id === $('salesStore').value), salesValue = Number($('salesValue').value), salesDate = $('salesDate').value;
            if (!store || !(salesValue > 0) || !salesDate) {message('salesMessage', 'Pilih Store, isi Sales Value lebih dari 0, dan tentukan tanggal sales.', 'danger'); return;}
            const editing = Boolean(salesEditId);
            try {const payload = {storeId: store.id, storeCode: store.code, storeName: store.name, salesValue, salesDate, updatedAt: serverTimestamp(), updatedBy: currentUser.uid}; if (editing) await updateDoc(doc(db, 'salesRecords', salesEditId), payload); else await addDoc(collection(db, 'salesRecords'), {...payload, createdAt: serverTimestamp(), createdBy: currentUser.uid}); resetSalesForm(); await loadAll(); message('salesMessage', editing ? 'Data sales berhasil diperbarui.' : 'Data sales berhasil disimpan.', 'success');}
            catch (err) {message('salesMessage', 'Gagal menyimpan sales: ' + friendlyError(err), 'danger');}
         };
         $('salesForm').addEventListener('reset', () => setTimeout(() => {if (!salesEditId) {$('salesDate').value = today(); updateSalesStoreOptions();} }, 0));
         $('storePageSize').onchange = () => {storePage = 1; renderStores();}; $('salesPageSize').onchange = () => {salesPage = 1; renderSales();}; $('salesFilterMonth').onchange = () => {salesPage = 1; renderSales();}; $('salesFilterYear').onchange = () => {salesPage = 1; renderSales();}; $('printSalesPdf').onclick = printSalesPdf; $('salesDate').value = today();

         // MASTER UOM & BAHAN BAKU: data disimpan pada koleksi Firestore terpisah.
         function nextMasterCode(rows, prefix) {let max = 0; rows.forEach(x => {const m = String(x.code || '').match(new RegExp('^' + prefix + '(\\d+)$', 'i')); if (m) max = Math.max(max, Number(m[1]) || 0);}); return prefix + String(max + 1).padStart(3, '0');}
         const uomCodeRef = () => doc(db, 'masterCounters', 'uom');
         const materialCodeRef = () => doc(db, 'masterCounters', 'rawMaterial');
         const costOverheadCodeRef = () => doc(db, 'masterCounters', 'costOverhead');
         async function allocateMasterCode(kind, prefix, rows) {const ref = kind === 'uom' ? uomCodeRef() : kind === 'rawMaterial' ? materialCodeRef() : costOverheadCodeRef(); let code = ''; await runTransaction(db, async tx => {const snap = await tx.get(ref); const base = Math.max(Number(snap.exists() ? snap.data().lastNumber : 0) || 0, rows.reduce((m, x) => {const n = Number(String(x.code || '').replace(new RegExp('^' + prefix, 'i'), '')) || 0; return Math.max(m, n);}, 0)); const next = base + 1; tx.set(ref, {lastNumber: next, updatedAt: serverTimestamp()}, {merge: true}); code = prefix + String(next).padStart(3, '0');}); return code;}
         function renderUoms() {const body = $('uomTable'); if (!body) return; body.innerHTML = uoms.length ? uoms.map(x => `<tr><td><b>${escapeHtml(x.code || x.id)}</b></td><td>${escapeHtml(x.name || '')}</td><td><button class="btn btn-light" data-delete-uom="${x.id}">Delete</button></td></tr>`).join('') : '<tr><td colspan="3" class="empty">Belum ada data UOM.</td></tr>'; body.querySelectorAll('[data-delete-uom]').forEach(b => b.onclick = async () => {const uom = uoms.find(x => x.id === b.dataset.deleteUom); if (!uom) return; if (rawMaterials.some(x => x.uomId === uom.id)) {alert('UOM ini sedang digunakan oleh data bahan baku. Ubah atau hapus bahan baku terkait terlebih dahulu.'); return;} if (!confirm(`Hapus UOM ${uom.name}?`)) return; try {await deleteDoc(doc(db, 'uoms', uom.id)); await loadAll(); message('uomMessage', 'Data UOM berhasil dihapus.', 'success');} catch (e) {message('uomMessage', 'Gagal menghapus UOM: ' + friendlyError(e), 'danger');} }); $('uomCode').value = nextMasterCode(uoms, 'UNT');}
         function updateUomOptions(selected = '') {const sel = $('rawMaterialUom'); if (!sel) return; sel.innerHTML = '<option value="">Pilih UOM…</option>' + uoms.map(x => `<option value="${x.id}">${escapeHtml(x.name)} (${escapeHtml(x.code)})</option>`).join(''); if (selected && uoms.some(x => x.id === selected)) sel.value = selected;}
         function rawMaterialAverage() {const weight = Number($('rawMaterialWeight').value), price = Number($('rawMaterialPurchasePrice').value); $('rawMaterialAverage').value = weight > 0 && Number.isFinite(price) ? rupiah(price / weight) : rupiah(0);}
         function renderRawMaterials() {const body = $('rawMaterialsTable'); if (!body) return; body.innerHTML = rawMaterials.length ? rawMaterials.map(x => {const unit = uoms.find(u => u.id === x.uomId); return `<tr><td><b>${escapeHtml(x.code || x.id)}</b></td><td>${escapeHtml(x.name || '')}</td><td><span class="unit-pill">${escapeHtml(unit?.name || x.uomName || '-')}</span></td><td>${Number(x.weight) || 0}</td><td>${rupiah(x.purchasePrice)}</td><td class="average-value">${rupiah(x.average)}</td><td><div class="master-actions"><button class="btn btn-light" data-edit-material="${x.id}">Edit</button><button class="btn btn-light" data-delete-material="${x.id}">Delete</button></div></td></tr>`;}).join('') : '<tr><td colspan="7" class="empty">Belum ada data bahan baku.</td></tr>'; body.querySelectorAll('[data-edit-material]').forEach(b => b.onclick = () => editRawMaterial(b.dataset.editMaterial)); body.querySelectorAll('[data-delete-material]').forEach(b => b.onclick = async () => {const x = rawMaterials.find(m => m.id === b.dataset.deleteMaterial); if (!x || !confirm(`Hapus bahan baku ${x.name}?`)) return; try {await deleteDoc(doc(db, 'rawMaterials', x.id)); await loadAll(); message('rawMaterialMessage', 'Data bahan baku berhasil dihapus.', 'success');} catch (e) {message('rawMaterialMessage', 'Gagal menghapus: ' + friendlyError(e), 'danger');} }); $('rawMaterialCode').value = nextMasterCode(rawMaterials, 'MAT');}
         $('uomForm').onsubmit = async e => {e.preventDefault(); const name = $('uomName').value.trim(); if (!name) return; try {const code = await allocateMasterCode('uom', 'UNT', uoms); await setDoc(doc(db, 'uoms', code), {code, name, createdAt: serverTimestamp(), createdBy: currentUser.uid}); $('uomForm').reset(); await loadAll(); message('uomMessage', 'UOM berhasil disimpan.', 'success');} catch (err) {message('uomMessage', 'Gagal menyimpan UOM: ' + friendlyError(err), 'danger');} };
         $('resetUom').onclick = () => setTimeout(() => {$('uomCode').value = nextMasterCode(uoms, 'UNT');}, 0);
         $('rawMaterialWeight').addEventListener('input', rawMaterialAverage); $('rawMaterialPurchasePrice').addEventListener('input', rawMaterialAverage);
         function resetRawMaterialForm() {$('rawMaterialForm').reset(); $('rawMaterialForm').dataset.edit = ''; $('saveRawMaterialBtn').textContent = 'Save Data'; $('rawMaterialCode').value = nextMasterCode(rawMaterials, 'MAT'); updateUomOptions(); rawMaterialAverage();}
         $('resetRawMaterial').onclick = () => setTimeout(resetRawMaterialForm, 0);
         function editRawMaterial(id) {const x = rawMaterials.find(m => m.id === id); if (!x) return; $('rawMaterialForm').dataset.edit = id; $('rawMaterialCode').value = x.code || ''; $('rawMaterialName').value = x.name || ''; updateUomOptions(x.uomId || ''); $('rawMaterialWeight').value = x.weight ?? ''; $('rawMaterialPurchasePrice').value = x.purchasePrice ?? ''; $('saveRawMaterialBtn').textContent = 'Update Data'; rawMaterialAverage(); message('rawMaterialMessage', 'Mode edit: ubah data lalu klik Update Data.'); $('rawMaterials').scrollIntoView({behavior: 'smooth', block: 'start'});}
         $('rawMaterialForm').onsubmit = async e => {e.preventDefault(); const editId = $('rawMaterialForm').dataset.edit || ''; const name = $('rawMaterialName').value.trim(), uomId = $('rawMaterialUom').value, weight = Number($('rawMaterialWeight').value), purchasePrice = Number($('rawMaterialPurchasePrice').value); const uom = uoms.find(x => x.id === uomId); if (!name || !uom || !(weight > 0) || !Number.isFinite(purchasePrice) || purchasePrice < 0) {message('rawMaterialMessage', 'Lengkapi nama, UOM, Weight lebih dari 0, dan Purchase Price yang valid.', 'danger'); return;} const data = {name, uomId, uomName: uom.name, uomCode: uom.code, weight, purchasePrice, average: purchasePrice / weight, updatedAt: serverTimestamp()}; try {if (editId) {await updateDoc(doc(db, 'rawMaterials', editId), data);} else {data.code = await allocateMasterCode('rawMaterial', 'MAT', rawMaterials); data.createdAt = serverTimestamp(); data.createdBy = currentUser.uid; await setDoc(doc(db, 'rawMaterials', data.code), data);} resetRawMaterialForm(); await loadAll(); message('rawMaterialMessage', editId ? 'Data bahan baku berhasil diperbarui.' : 'Data bahan baku berhasil disimpan.', 'success');} catch (err) {message('rawMaterialMessage', 'Gagal menyimpan bahan baku: ' + friendlyError(err), 'danger');} };

         // PURCHASE ORDER MATERIAL: pembelian bahan baku tersimpan di Firestore.
         const poMonthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
         let purchaseOrderEditId = '';
         function updatePurchaseOrderOptions() {const ss = $('poSupplier'), sm = $('poMaterial'); if (!ss || !sm) return; const oldS = ss.value, oldM = sm.value; ss.innerHTML = '<option value="">Pilih Supplier</option>' + supplierRecords.map(x => `<option value="${escapeHtml(x.id)}">${escapeHtml(x.code || '')} — ${escapeHtml(x.name || '')}</option>`).join(''); sm.innerHTML = '<option value="">Pilih Bahan Baku</option>' + rawMaterials.map(x => `<option value="${escapeHtml(x.id)}">${escapeHtml(x.code || '')} — ${escapeHtml(x.name || '')}</option>`).join(''); if (supplierRecords.some(x => x.id === oldS)) ss.value = oldS; if (rawMaterials.some(x => x.id === oldM)) sm.value = oldM; updatePurchaseOrderMaterialPreview();}
         function updatePurchaseOrderAverage() {const qty = Number($('poQty').value), value = Number($('poValue').value); $('poAverage').value = qty > 0 && Number.isFinite(value) ? rupiah(value / qty) : '';}
         function updatePurchaseOrderMaterialPreview() {const m = rawMaterials.find(x => x.id === $('poMaterial').value); const u = m ? uoms.find(x => x.id === m.uomId) : null; $('poUom').value = m ? (u?.name || m.uomName || '-') : ''; updatePurchaseOrderAverage();}
         function initPurchaseOrderFilters() {const now = new Date(), month = $('poMonth'), year = $('poYear'), oldM = month.value, oldY = year.value; month.innerHTML = poMonthNames.map((m, i) => `<option value="${String(i + 1).padStart(2, '0')}">${m}</option>`).join(''); year.innerHTML = Array.from({length: 10}, (_, i) => 2026 + i).map(y => `<option value="${y}">${y}</option>`).join(''); month.value = [...month.options].some(o => o.value === oldM) ? oldM : String(now.getMonth() + 1).padStart(2, '0'); const defaultYear = now.getFullYear() >= 2026 && now.getFullYear() <= 2035 ? String(now.getFullYear()) : '2026'; year.value = [...year.options].some(o => o.value === oldY) ? oldY : defaultYear;}
         function purchaseOrderFilteredRows() {const period = `${$('poYear').value}-${$('poMonth').value}`; return purchaseOrderRecords.filter(x => String(x.purchaseDate || '').slice(0, 7) === period).sort((a, b) => String(b.purchaseDate || '').localeCompare(String(a.purchaseDate || '')));}
         function renderPurchaseOrders() {if (!$('purchaseOrderTable')) return; updatePurchaseOrderOptions(); initPurchaseOrderFilters(); const rows = purchaseOrderFilteredRows(); $('purchaseOrderTable').innerHTML = rows.length ? rows.map((x, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(x.purchaseDate || '-')}</td><td>${escapeHtml(x.supplierName || '-')}</td><td>${escapeHtml(x.materialName || '-')}</td><td>${Number(x.qty) || 0}</td><td>${escapeHtml(x.uomName || '-')}</td><td>${rupiah(x.purchaseValue)}</td><td>${rupiah(x.average)}</td><td><div class="master-actions"><button type="button" class="btn btn-light" data-edit-po="${escapeHtml(x.id)}">Edit</button><button type="button" class="btn btn-light" data-delete-po="${escapeHtml(x.id)}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="9" class="empty">Tidak ada pembelian pada bulan dan tahun terpilih.</td></tr>'; $('poMonthTotal').textContent = rupiah(rows.reduce((sum, x) => sum + (Number(x.purchaseValue) || 0), 0)); $('purchaseOrderTable').querySelectorAll('[data-edit-po]').forEach(b => b.onclick = () => editPurchaseOrder(b.dataset.editPo)); $('purchaseOrderTable').querySelectorAll('[data-delete-po]').forEach(b => b.onclick = async () => {const x = purchaseOrderRecords.find(v => v.id === b.dataset.deletePo); if (!x || !confirm(`Hapus pembelian ${x.materialName || ''} tanggal ${x.purchaseDate || ''}?`)) return; try {await deleteDoc(doc(db, 'purchaseOrders', x.id)); purchaseOrderRecords = purchaseOrderRecords.filter(v => v.id !== x.id); renderPurchaseOrders(); message('poMessage', 'Data pembelian berhasil dihapus.', 'success');} catch (err) {message('poMessage', 'Gagal menghapus pembelian: ' + friendlyError(err), 'danger');} });}
         function editPurchaseOrder(id) {const x = purchaseOrderRecords.find(v => v.id === id); if (!x) return; purchaseOrderEditId = x.id; $('poSupplier').value = x.supplierId || ''; $('poMaterial').value = x.materialId || ''; $('poQty').value = x.qty ?? ''; $('poValue').value = x.purchaseValue ?? ''; $('poDate').value = x.purchaseDate || today(); updatePurchaseOrderMaterialPreview(); $('savePurchaseOrderBtn').textContent = 'Update Data'; message('poMessage', 'Mode edit: ubah data pembelian lalu klik Update Data.'); $('purchaseOrderForm').scrollIntoView({behavior: 'smooth', block: 'start'});}
         $('poMaterial')?.addEventListener('change', updatePurchaseOrderMaterialPreview); $('poQty')?.addEventListener('input', updatePurchaseOrderAverage); $('poValue')?.addEventListener('input', updatePurchaseOrderAverage); $('poMonth')?.addEventListener('change', renderPurchaseOrders); $('poYear')?.addEventListener('change', renderPurchaseOrders);
         function resetPurchaseOrderForm() {purchaseOrderEditId = ''; $('purchaseOrderForm').reset(); $('poDate').value = today(); $('savePurchaseOrderBtn').textContent = 'Save Data'; updatePurchaseOrderMaterialPreview();}
         $('resetPurchaseOrderBtn')?.addEventListener('click', resetPurchaseOrderForm);
         $('purchaseOrderForm').onsubmit = async e => {e.preventDefault(); const wasEdit = Boolean(purchaseOrderEditId); const supplier = supplierRecords.find(x => x.id === $('poSupplier').value), material = rawMaterials.find(x => x.id === $('poMaterial').value), qty = Number($('poQty').value), purchaseValue = Number($('poValue').value), purchaseDate = $('poDate').value; if (!supplier || !material || !(qty > 0) || !Number.isFinite(purchaseValue) || purchaseValue < 0 || !purchaseDate) {message('poMessage', 'Lengkapi Supplier, Bahan Baku, Qty, Value Purchase Price, dan Tanggal Pembelian.', 'danger'); return;} const u = uoms.find(x => x.id === material.uomId), average = Math.round((purchaseValue / qty) * 100) / 100, payload = {supplierId: supplier.id, supplierCode: supplier.code || '', supplierName: supplier.name || '', materialId: material.id, materialCode: material.code || '', materialName: material.name || '', qty, uomId: material.uomId || '', uomName: u?.name || material.uomName || '-', purchaseValue, average, purchaseDate, updatedAt: serverTimestamp()}; try {if (purchaseOrderEditId) {await updateDoc(doc(db, 'purchaseOrders', purchaseOrderEditId), payload); const ix = purchaseOrderRecords.findIndex(x => x.id === purchaseOrderEditId); if (ix >= 0) purchaseOrderRecords[ix] = {...purchaseOrderRecords[ix], ...payload};} else {const ref = doc(collection(db, 'purchaseOrders')); const createPayload = {...payload, createdAt: serverTimestamp(), createdBy: currentUser?.uid || null}; await setDoc(ref, createPayload); purchaseOrderRecords.unshift({id: ref.id, ...createPayload});} resetPurchaseOrderForm(); renderPurchaseOrders(); message('poMessage', wasEdit ? 'Data pembelian berhasil diperbarui.' : 'Data pembelian berhasil disimpan.', 'success');} catch (err) {message('poMessage', 'Gagal menyimpan pembelian: ' + friendlyError(err), 'danger');} };
         $('printPurchaseOrdersBtn')?.addEventListener('click', () => {const rows = purchaseOrderFilteredRows(), period = `${$('poMonth').selectedOptions[0]?.text || ''} ${$('poYear').value}`, total = rows.reduce((sum, x) => sum + (Number(x.purchaseValue) || 0), 0); const body = `<h1>ROTI ANGET SUBUH</h1><h2>Laporan Purchase Order Material</h2><p class="center">Periode: ${escapeHtml(period)}</p><table><thead><tr><th>No</th><th>Tanggal</th><th>Supplier</th><th>Bahan Baku</th><th>Qty</th><th>UOM</th><th>Value Purchase Price</th><th>Average</th></tr></thead><tbody>${rows.map((x, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(x.purchaseDate || '-')}</td><td>${escapeHtml(x.supplierName || '-')}</td><td>${escapeHtml(x.materialName || '-')}</td><td>${Number(x.qty) || 0}</td><td>${escapeHtml(x.uomName || '-')}</td><td>${rupiah(x.purchaseValue)}</td><td>${rupiah(x.average)}</td></tr>`).join('') || '<tr><td colspan="8">Tidak ada data</td></tr>'}</tbody></table><p class="totals">Total Pembelian: ${rupiah(total)}</p>`; printDocument('Laporan Purchase Order Material', body);});

         // STOCK BAHAN BAKU: saldo kumulatif PO dikurangi pemakaian MRP Produksi.
         function getStockBahanBakuRows() {
            const poByMaterial = new Map(), usedByMaterial = new Map();
            purchaseOrderRecords.forEach(po => {const key = po.materialId || po.materialCode || po.materialName; if (!key) return; poByMaterial.set(key, (poByMaterial.get(key) || 0) + (Number(po.qty) || 0));});
            productionRecords.forEach(rec => (rec.items || []).forEach(item => {const key = item.materialId || item.code || item.name; if (!key) return; const used = Number(item.totalWeight ?? (Number(item.weight || 0) * Number(rec.qty || 0))) || 0; usedByMaterial.set(key, (usedByMaterial.get(key) || 0) + used);}));
            return [...rawMaterials].sort((a, b) => String(a.code || '').localeCompare(String(b.code || ''), undefined, {numeric: true, sensitivity: 'base'})).map(m => {
               const u = uoms.find(x => x.id === m.uomId), keys = [m.id, m.code, m.name].filter(Boolean); let qtyPO = 0, qtyProduction = 0;
               keys.forEach(k => {qtyPO = Math.max(qtyPO, poByMaterial.get(k) || 0); qtyProduction = Math.max(qtyProduction, usedByMaterial.get(k) || 0);});
               const qtyStock = qtyPO - qtyProduction, average = Number(m.average) || 0, value = average * qtyStock;
               return {code: m.code || m.id, name: m.name || '', uom: u?.name || m.uomName || '-', qtyPO, qtyProduction, qtyStock, average, value};
            });
         }
         function renderStockBahanBaku() {const body = $('stockBahanBakuTable'); if (!body) return; const rows = getStockBahanBakuRows(); body.innerHTML = rows.length ? rows.map(x => `<tr><td><b>${escapeHtml(x.code)}</b></td><td>${escapeHtml(x.name)}</td><td>${escapeHtml(x.uom)}</td><td>${forecastNumber(x.qtyPO)}</td><td>${forecastNumber(x.qtyProduction)}</td><td><b>${forecastNumber(x.qtyStock)}</b></td><td>${rupiah(x.value)}</td></tr>`).join('') : '<tr><td colspan="7" class="empty">Belum ada Master Bahan Baku.</td></tr>'; $('stockBahanBakuTotal').textContent = rupiah(rows.reduce((sum, x) => sum + x.value, 0));}
         $('printStockBahanBakuBtn')?.addEventListener('click', () => {const rows = getStockBahanBakuRows(), total = rows.reduce((sum, x) => sum + x.value, 0); const body = `<h1>ROTI ANGET SUBUH</h1><h2>Laporan Stock Bahan Baku Produksi</h2><p class="center">Dicetak: ${escapeHtml(new Date().toLocaleString('id-ID'))}</p><table><thead><tr><th>Kode Bahan Baku</th><th>Nama Bahan Baku</th><th>UOM / Unit</th><th>Qty PO</th><th>Qty Produksi</th><th>Qty Stock</th><th>Value</th></tr></thead><tbody>${rows.map(x => `<tr><td>${escapeHtml(x.code)}</td><td>${escapeHtml(x.name)}</td><td>${escapeHtml(x.uom)}</td><td>${forecastNumber(x.qtyPO)}</td><td>${forecastNumber(x.qtyProduction)}</td><td>${forecastNumber(x.qtyStock)}</td><td>${rupiah(x.value)}</td></tr>`).join('') || '<tr><td colspan="7">Belum ada data</td></tr>'}</tbody></table><p class="totals">Total Value Stock: ${rupiah(total)}</p>`; printDocument('Laporan Stock Bahan Baku Produksi', body);});

         // MASTER SUPPLIER: data supplier tersimpan di Firestore.
         function renderSuppliers() {const body = $('supplierTable'); if (!body) return; body.innerHTML = supplierRecords.length ? supplierRecords.map((x, i) => `<tr><td>${i + 1}</td><td><b>${escapeHtml(x.code || x.id)}</b></td><td>${escapeHtml(x.name || '')}</td><td>${escapeHtml(x.address || '')}</td><td>${escapeHtml(x.contact || '')}</td><td><div class="master-actions"><button type="button" class="btn btn-light" data-edit-supplier="${escapeHtml(x.id)}">Edit</button><button type="button" class="btn btn-light" data-delete-supplier="${escapeHtml(x.id)}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="6" class="empty">Belum ada data supplier.</td></tr>'; body.querySelectorAll('[data-edit-supplier]').forEach(b => b.onclick = () => {const x = supplierRecords.find(v => v.id === b.dataset.editSupplier); if (!x) return; supplierEditId = x.id; $('supplierCode').value = x.code || ''; $('supplierName').value = x.name || ''; $('supplierAddress').value = x.address || ''; $('supplierContact').value = x.contact || ''; $('saveSupplierBtn').textContent = 'Update Data'; message('supplierMessage', 'Mode edit: ubah data lalu klik Update Data.'); $('addSupplier').scrollIntoView({behavior: 'smooth', block: 'start'});}); body.querySelectorAll('[data-delete-supplier]').forEach(b => b.onclick = async () => {const x = supplierRecords.find(v => v.id === b.dataset.deleteSupplier); if (!x || !confirm(`Hapus supplier ${x.name || ''}?`)) return; try {await deleteDoc(doc(db, 'suppliers', x.id)); await loadAll(); message('supplierMessage', 'Data supplier berhasil dihapus.', 'success');} catch (err) {message('supplierMessage', 'Gagal menghapus supplier: ' + friendlyError(err), 'danger');} }); if (!supplierEditId) $('supplierCode').value = nextMasterCode(supplierRecords, 'SUP');}
         function resetSupplierForm() {supplierEditId = ''; $('supplierForm').reset(); $('supplierCode').value = nextMasterCode(supplierRecords, 'SUP'); $('saveSupplierBtn').textContent = 'Simpan Data';}
         $('supplierForm').onsubmit = async e => {e.preventDefault(); const wasEdit = Boolean(supplierEditId); const name = $('supplierName').value.trim(), address = $('supplierAddress').value.trim(), contact = $('supplierContact').value.trim(); if (!name || !address || !contact) {message('supplierMessage', 'Lengkapi Nama Supplier, Alamat Supplier, dan Contact / HP.', 'danger'); return;} try {if (supplierEditId) {await updateDoc(doc(db, 'suppliers', supplierEditId), {name, address, contact, updatedAt: serverTimestamp(), updatedBy: currentUser?.uid || null});} else {const code = await allocateSupplierCode(); await setDoc(doc(db, 'suppliers', code), {code, name, address, contact, createdAt: serverTimestamp(), createdBy: currentUser?.uid || null});} resetSupplierForm(); await loadAll(); message('supplierMessage', wasEdit ? 'Data supplier berhasil diperbarui.' : 'Data supplier berhasil disimpan.', 'success');} catch (err) {message('supplierMessage', 'Gagal menyimpan supplier: ' + friendlyError(err), 'danger');} };
         async function allocateSupplierCode() {const ref = doc(db, 'masterCounters', 'supplier'); let code = ''; await runTransaction(db, async tx => {const snap = await tx.get(ref); const base = Math.max(Number(snap.exists() ? snap.data().lastNumber : 0) || 0, supplierRecords.reduce((m, x) => Math.max(m, Number(String(x.code || '').replace(/^SUP/i, '')) || 0), 0)); const next = base + 1; tx.set(ref, {lastNumber: next, updatedAt: serverTimestamp()}, {merge: true}); code = 'SUP' + String(next).padStart(3, '0');}); return code;}
         $('resetSupplierBtn').onclick = resetSupplierForm;

         // MASTER COST OVERHEAD: master rincian dan pencatatan biaya disimpan di Firestore.
         function renderCostOverheadMasters() {const body = $('costOverheadMasterTable'); if (!body) return; body.innerHTML = costOverheadMasters.length ? costOverheadMasters.map((x, i) => `<tr><td>${i + 1}</td><td><b>${escapeHtml(x.code || x.id)}</b></td><td>${escapeHtml(x.name || '')}</td></tr>`).join('') : '<tr><td colspan="3" class="empty">Belum ada rincian biaya.</td></tr>'; if ($('costOverheadCode')) $('costOverheadCode').value = nextMasterCode(costOverheadMasters, 'COH');}
         $('costOverheadMasterForm').onsubmit = async e => {e.preventDefault(); const name = $('costOverheadName').value.trim(); if (!name) {message('costOverheadMasterMessage', 'Isi Nama Biaya terlebih dahulu.', 'danger'); return;} try {const code = await allocateMasterCode('costOverhead', 'COH', costOverheadMasters); await setDoc(doc(db, 'costOverheadMasters', code), {code, name, createdAt: serverTimestamp(), createdBy: currentUser.uid}); $('costOverheadMasterForm').reset(); await loadAll(); message('costOverheadMasterMessage', `Data ${code} berhasil disimpan.`, 'success');} catch (err) {message('costOverheadMasterMessage', 'Gagal menyimpan Master Cost Overhead: ' + friendlyError(err), 'danger');} };
         function costOverheadInputTotal() {const total = Array.from(document.querySelectorAll('[data-cost-overhead-value]')).reduce((n, input) => n + (Number(input.value) || 0), 0); $('costOverheadInputTotal').textContent = rupiah(total); return total;}
         function renderCostOverheadInput() {const body = $('costOverheadInputTable'); if (!body) return; const date = $('costOverheadPostingDate').value; if (!date) {body.innerHTML = '<tr><td colspan="4" class="empty">Pilih tanggal posting biaya terlebih dahulu.</td></tr>'; $('costOverheadInputTotal').textContent = rupiah(0); return;} body.innerHTML = costOverheadMasters.length ? costOverheadMasters.map((x, i) => {const saved = costOverheadExpenses.find(v => v.postingDate === date && v.masterId === x.id); return `<tr><td>${i + 1}</td><td><b>${escapeHtml(x.code || x.id)}</b></td><td>${escapeHtml(x.name || '')}</td><td><input type="number" min="0" step="1" data-cost-overhead-value="${escapeHtml(x.id)}" value="${saved ? Number(saved.value) || 0 : ''}" placeholder="Masukkan value" style="width:100%;min-width:120px;padding:9px;border:1px solid var(--line);border-radius:8px"></td></tr>`;}).join('') : '<tr><td colspan="4" class="empty">Belum ada Master Data Cost Overhead. Tambahkan dahulu pada menu Master Data.</td></tr>'; document.querySelectorAll('[data-cost-overhead-value]').forEach(input => input.addEventListener('input', costOverheadInputTotal)); costOverheadInputTotal();}
         $('costOverheadPostingDate').addEventListener('change', () => {message('costOverheadInputMessage', ''); renderCostOverheadInput();});
         $('saveCostOverheadExpenses').onclick = async () => {const postingDate = $('costOverheadPostingDate').value; if (!postingDate) {message('costOverheadInputMessage', 'Pilih tanggal posting biaya terlebih dahulu.', 'danger'); $('costOverheadPostingDate').focus(); return;} const inputs = Array.from(document.querySelectorAll('[data-cost-overhead-value]')); if (!inputs.length) {message('costOverheadInputMessage', 'Belum ada rincian Master Cost Overhead untuk diinput.', 'danger'); return;} const entries = inputs.map(input => {const master = costOverheadMasters.find(x => x.id === input.dataset.costOverheadValue); return {master, value: Number(input.value)};}).filter(x => x.master && Number.isFinite(x.value) && x.value >= 0); if (!entries.some(x => x.value > 0)) {message('costOverheadInputMessage', 'Isi minimal satu Value biaya lebih dari 0.', 'danger'); return;} try {for (const entry of entries) {const id = (postingDate + '_' + entry.master.id).replace(/[\\/.#$[\\]]/g, '_'); await setDoc(doc(db, 'costOverheadExpenses', id), {postingDate, masterId: entry.master.id, code: entry.master.code || '', name: entry.master.name || '', value: entry.value, updatedAt: serverTimestamp(), updatedBy: currentUser.uid}, {merge: true});} await loadAll(); renderCostOverheadInput(); message('costOverheadInputMessage', 'Biaya Cost Overhead berhasil disimpan.', 'success');} catch (err) {message('costOverheadInputMessage', 'Gagal menyimpan biaya: ' + friendlyError(err), 'danger');} };
         $('openCostOverheadInput').onclick = () => {document.querySelectorAll('.page').forEach(x => x.classList.remove('active')); $('costOverheadInput').classList.add('active'); $('pageTitle').textContent = 'Input Biaya Cost Overhead'; $('costOverheadPostingDate').value = ''; renderCostOverheadInput(); $('sidebar').classList.remove('open');};
         $('backToCostsReport').onclick = () => {document.querySelectorAll('.page').forEach(x => x.classList.remove('active')); $('reportCosts').classList.add('active'); $('pageTitle').textContent = 'Laporan Biaya'; renderAccountingReport('reportCosts');};
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
         function renderProducts() {$('productsTable').innerHTML = products.length ? products.map(p => `<tr><td><img class="thumb" src="${p.imageUrl || ''}" alt="Foto ${escapeHtml(p.name)}" data-zoom-src="${p.imageUrl || ''}" data-zoom-title="${escapeHtml(p.name)}" title="Klik untuk memperbesar" onerror="this.style.visibility='hidden'"></td><td>${escapeHtml(p.code)}</td><td>${escapeHtml(p.name)}</td><td>${rupiah(p.price)}</td><td><div class="master-actions"><button class="btn btn-light" data-edit="${p.id}" style="padding:7px 10px">Edit</button><button class="btn btn-gold" data-forecast="${p.id}" style="padding:7px 10px">Forecast</button></div></td></tr>`).join('') : '<tr><td colspan="5" class="empty">Belum ada produk.</td></tr>'; document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editProduct(b.dataset.edit)); document.querySelectorAll('[data-forecast]').forEach(b => b.onclick = () => openProductForecast(b.dataset.forecast)); $('productCode').value = awaitNextCode();}
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
         const forecastMoney = n => new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Number(n) || 0);
         const forecastNumber = n => new Intl.NumberFormat('id-ID', {maximumFractionDigits: 8}).format(Number(n) || 0);
         function selectedForecastMaterial() {return rawMaterials.find(x => x.id === $('forecastMaterialSelect').value) || null;}
         function refreshForecastMaterialFields() {const m = selectedForecastMaterial(); $('forecastUom').value = m ? (uoms.find(u => u.id === m.uomId)?.name || m.uomName || '-') : ''; $('forecastAverage').value = m ? forecastMoney(m.average) : ''; updateForecastPricePreview();}
         function updateForecastPricePreview() {const m = selectedForecastMaterial(), weight = Number($('forecastWeight').value); $('forecastPrice').value = m && weight > 0 ? forecastMoney(weight * Number(m.average || 0)) : '';}
         function calculateForecastTotals() {const hpp = forecastItems.reduce((s, x) => s + Number(x.price || 0), 0); const variableCost = Math.round(hpp * 0.01 * 100) / 100; return {hpp, variableCost, total: hpp + variableCost};}
         function renderForecastItems() {const body = $('forecastItemsTable'); if (!body) return; body.innerHTML = forecastItems.length ? forecastItems.map((x, i) => `<tr><td><b>${escapeHtml(x.code)}</b></td><td>${escapeHtml(x.name)}</td><td>${forecastNumber(x.weight)}</td><td>${escapeHtml(x.uomName)}</td><td>${forecastMoney(x.average)}</td><td>${forecastMoney(x.price)}</td><td><button type="button" class="btn btn-light" data-remove-forecast="${i}">Delete</button></td></tr>`).join('') : '<tr><td colspan="7" class="empty">Belum ada bahan baku ditambahkan.</td></tr>'; body.querySelectorAll('[data-remove-forecast]').forEach(b => b.onclick = () => {forecastItems.splice(Number(b.dataset.removeForecast), 1); renderForecastItems();}); const t = calculateForecastTotals(); $('forecastHpp').textContent = forecastMoney(t.hpp); $('forecastVariableCost').textContent = forecastMoney(t.variableCost); $('forecastHppTotal').textContent = forecastMoney(t.total);}
         function closeProductForecast() {forecastProduct = null; forecastItems = []; $('forecastPanel').classList.add('hidden'); $('productEntryPanel').classList.remove('hidden'); $('productListPanel').classList.remove('hidden');}
         async function openProductForecast(productId) {const p = products.find(x => x.id === productId); if (!p) return; if (!rawMaterials.length) {message('productMessage', 'Tambahkan data bahan baku terlebih dahulu di menu Master Bahan Baku.', 'danger'); return;} forecastProduct = p; forecastItems = []; $('productEntryPanel').classList.add('hidden'); $('productListPanel').classList.add('hidden'); $('forecastPanel').classList.remove('hidden'); $('forecastProductImage').src = p.imageUrl || ''; $('forecastProductImage').style.visibility = p.imageUrl ? 'visible' : 'hidden'; $('forecastProductName').textContent = p.name || '-'; $('forecastProductPrice').textContent = rupiah(p.price); $('forecastProductCode').textContent = p.code || ''; $('forecastMaterialSelect').innerHTML = '<option value="">Pilih bahan baku</option>' + rawMaterials.map(m => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.code || '')} — ${escapeHtml(m.name || '')}</option>`).join(''); $('forecastMaterialSelect').value = ''; $('forecastWeight').value = ''; $('forecastUom').value = ''; $('forecastAverage').value = ''; $('forecastPrice').value = ''; message('forecastMessage', 'Memuat forecast tersimpan...'); try {const snap = await getDoc(doc(db, 'productForecasts', p.id)); if (snap.exists()) {const saved = snap.data(); forecastItems = Array.isArray(saved.items) ? saved.items.map(x => ({...x})) : []; message('forecastMessage', 'Forecast tersimpan berhasil dimuat. Anda dapat menambah, menghapus, atau memperbarui bahan baku.', 'success');} else {message('forecastMessage', 'Belum ada forecast untuk produk ini. Tambahkan bahan baku lalu simpan.');} } catch (err) {message('forecastMessage', 'Gagal membaca forecast: ' + friendlyError(err), 'danger');} renderForecastItems(); $('forecastPanel').scrollIntoView({behavior: 'smooth', block: 'start'});}
         $('forecastMaterialSelect').addEventListener('change', refreshForecastMaterialFields); $('forecastWeight').addEventListener('input', updateForecastPricePreview);
         $('addForecastMaterialBtn').onclick = () => {const m = selectedForecastMaterial(), weight = Number($('forecastWeight').value); if (!m) {message('forecastMessage', 'Pilih bahan baku terlebih dahulu.', 'danger'); return;} if (!(weight > 0) || !Number.isFinite(weight)) {message('forecastMessage', 'Weight harus berupa angka lebih besar dari 0.', 'danger'); return;} const uom = uoms.find(u => u.id === m.uomId); forecastItems.push({materialId: m.id, code: m.code || m.id, name: m.name || '', weight, uomId: m.uomId || '', uomName: uom?.name || m.uomName || '-', average: Number(m.average) || 0, price: Math.round(weight * (Number(m.average) || 0) * 100) / 100}); $('forecastMaterialSelect').value = ''; $('forecastWeight').value = ''; refreshForecastMaterialFields(); renderForecastItems(); message('forecastMessage', 'Bahan baku berhasil ditambahkan ke daftar.', 'success');};
         $('saveForecastBtn').onclick = async () => {if (!forecastProduct) return; if (!forecastItems.length) {message('forecastMessage', 'Tambahkan minimal satu bahan baku sebelum menyimpan.', 'danger'); return;} const totals = calculateForecastTotals(); const payload = {productId: forecastProduct.id, productCode: forecastProduct.code || '', productName: forecastProduct.name || '', sellingPrice: Number(forecastProduct.price) || 0, items: forecastItems.map(x => ({...x})), hpp: Math.round(totals.hpp * 100) / 100, variableCostPercent: 1, variableCost: totals.variableCost, hppTotal: Math.round(totals.total * 100) / 100, updatedAt: serverTimestamp(), updatedBy: currentUser?.uid || null}; try {await setDoc(doc(db, 'productForecasts', forecastProduct.id), payload); message('forecastMessage', 'Forecast berhasil disimpan ke Firestore.', 'success');} catch (err) {message('forecastMessage', 'Gagal menyimpan forecast: ' + friendlyError(err), 'danger');} };
         $('closeForecastBtn').onclick = closeProductForecast; $('closeForecastBottomBtn').onclick = closeProductForecast;
         function updateMRPProductOptions() {const sel = $('mrpProduct'); if (!sel) return; const keep = sel.value; sel.innerHTML = '<option value="">Pilih produk</option>' + products.map(p => `<option value="${p.id}">${escapeHtml(p.code || '')} — ${escapeHtml(p.name || '')}</option>`).join(''); if (products.some(p => p.id === keep)) sel.value = keep;}
         let fgEditMode = false;
         function initFGFilters() {const month = $('fgMonth'), year = $('fgYear'); if (!month || !year) return; const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']; const now = new Date(); const currentMonth = String(now.getMonth() + 1).padStart(2, '0'), currentYear = String(now.getFullYear()); const firstInit = month.dataset.systemDateInitialized !== '1'; const previousMonth = month.value, previousYear = year.value; if (!month.options.length) month.innerHTML = months.map((m, i) => `<option value="${String(i + 1).padStart(2, '0')}">${m}</option>`).join(''); const years = new Set(Array.from({length: 10}, (_, i) => now.getFullYear() - 4 + i)); productionRecords.forEach(x => {const y = Number(String(x.productionDate || '').slice(0, 4)); if (y > 0) years.add(y);}); finishGoodRecords.forEach(x => {const y = Number(x.year); if (y > 0) years.add(y);}); year.innerHTML = [...years].sort((a, b) => a - b).map(y => `<option value="${y}">${y}</option>`).join(''); if (firstInit) {month.value = currentMonth; year.value = currentYear; month.dataset.systemDateInitialized = '1';} else {month.value = [...month.options].some(o => o.value === previousMonth) ? previousMonth : currentMonth; year.value = [...year.options].some(o => o.value === previousYear) ? previousYear : currentYear;} } function getFGRows() {const period = `${$('fgYear').value}-${$('fgMonth').value}`, map = new Map(); productionRecords.filter(x => String(x.productionDate || '').slice(0, 7) === period).forEach(rec => {const key = rec.productId || rec.productCode || rec.productName; const row = map.get(key) || {productId: rec.productId || '', code: rec.productCode || '', name: rec.productName || '', qtyRecipe: 0}; row.qtyRecipe += Number(rec.qty) || 0; map.set(key, row);}); return [...map.values()].sort((a, b) => String(a.code).localeCompare(String(b.code))).map(row => {const saved = finishGoodRecords.find(x => x.period === period && x.productId === row.productId); return {...row, qtyFG: Number(saved?.qtyFG) || 0, qtyKirim: Number(saved?.qtyKirim) || 0, id: saved?.id || ''};});}
         function renderFinishGood() {const body = $('finishGoodTable'); if (!body) return; const rows = getFGRows(); body.innerHTML = rows.length ? rows.map((x, i) => `<tr><td><b>${escapeHtml(x.code)}</b></td><td>${escapeHtml(x.name)}</td><td>${forecastNumber(x.qtyRecipe)}</td><td>${fgEditMode ? `<input type="number" min="0" step="1" data-fg-input="qtyFG" data-fg-index="${i}" value="${x.qtyFG}" style="width:90px">` : forecastNumber(x.qtyFG)}</td><td>${fgEditMode ? `<input type="number" min="0" step="1" data-fg-input="qtyKirim" data-fg-index="${i}" value="${x.qtyKirim}" style="width:90px">` : forecastNumber(x.qtyKirim)}</td><td><b>${forecastNumber(x.qtyFG - x.qtyKirim)}</b></td></tr>`).join('') : '<tr><td colspan="6" class="empty">Belum ada data MRP Produksi pada bulan dan tahun ini.</td></tr>'; body.querySelectorAll('[data-fg-input]').forEach(input => input.addEventListener('input', () => {const row = rows[Number(input.dataset.fgIndex)]; if (row) row[input.dataset.fgInput] = Math.max(0, Math.floor(Number(input.value) || 0)); const tr = input.closest('tr'); const fg = Number(tr.querySelector('[data-fg-input="qtyFG"]')?.value) || 0, kirim = Number(tr.querySelector('[data-fg-input="qtyKirim"]')?.value) || 0; tr.lastElementChild.innerHTML = `<b>${forecastNumber(fg - kirim)}</b>`;}));}
         $('fgEditBtn').onclick = () => {fgEditMode = !fgEditMode; $('fgEditBtn').textContent = fgEditMode ? 'Selesai Edit' : 'Edit Data'; renderFinishGood();};
         $('fgSaveBtn').onclick = async () => {const period = `${$('fgYear').value}-${$('fgMonth').value}`, rows = getFGRows(); if (!rows.length) {message('fgMessage', 'Tidak ada data MRP Produksi untuk disimpan pada periode ini.', 'danger'); return;} try {for (const row of rows) {const fgInput = document.querySelector(`[data-fg-input="qtyFG"][data-fg-index="${rows.indexOf(row)}"]`), sendInput = document.querySelector(`[data-fg-input="qtyKirim"][data-fg-index="${rows.indexOf(row)}"]`); const qtyFG = Math.max(0, Math.floor(Number(fgInput?.value ?? row.qtyFG) || 0)), qtyKirim = Math.max(0, Math.floor(Number(sendInput?.value ?? row.qtyKirim) || 0)); if (qtyKirim > qtyFG) throw new Error(`Qty Kirim tidak boleh lebih besar dari Qty FG untuk ${row.name}.`); const payload = {period, year: Number($('fgYear').value), month: $('fgMonth').value, productId: row.productId, productCode: row.code, productName: row.name, qtyRecipe: row.qtyRecipe, qtyFG, qtyKirim, stock: qtyFG - qtyKirim, updatedAt: serverTimestamp(), updatedBy: currentUser?.uid || null}; const id = `${period}_${row.productId || row.code}`.replace(/[\/.#$[\]]/g, '_'); await setDoc(doc(db, 'finishGood', id), payload, {merge: true}); const old = finishGoodRecords.find(x => x.id === id); if (old) Object.assign(old, payload); else finishGoodRecords.push({id, ...payload});} fgEditMode = false; $('fgEditBtn').textContent = 'Edit Data'; renderFinishGood(); if (!$('fgForecastPanel').classList.contains('hidden')) renderFGForecast(); message('fgMessage', 'Data Finish Good berhasil disimpan. Stock dihitung dari Qty FG dikurangi Qty Kirim.', 'success');} catch (err) {message('fgMessage', 'Gagal menyimpan Data FG: ' + friendlyError(err), 'danger');} };
         function renderFGForecast() {const period = `${$('fgYear').value}-${$('fgMonth').value}`, fgRows = getFGRows(), grouped = new Map(); fgRows.forEach(row => {if (row.qtyFG <= 0) return; const records = productionRecords.filter(r => r.productId === row.productId && String(r.productionDate || '').slice(0, 7) === period); const recipeMap = new Map(); records.forEach(rec => (rec.items || []).forEach(m => {const key = [m.code || '', m.name || '', m.uomName || ''].join('|'); const item = recipeMap.get(key) || {code: m.code || '', name: m.name || '', uomName: m.uomName || '-', weightPerUnit: 0, pricePerUnit: 0, sourceQty: 0}; const q = Number(rec.qty) || 0; if (q > 0) {item.weightPerUnit += Number(m.totalWeight ?? (Number(m.weight || 0) * q)) / q; item.pricePerUnit += Number(m.totalPrice ?? (Number(m.price || 0) * q)) / q; item.sourceQty++;} recipeMap.set(key, item);})); recipeMap.forEach(m => {const key = [m.code, m.name, m.uomName].join('|'); const out = grouped.get(key) || {code: m.code, name: m.name, uomName: m.uomName, weight: 0, price: 0}; out.weight += m.weightPerUnit * row.qtyFG; out.price += m.pricePerUnit * row.qtyFG; grouped.set(key, out);});}); const list = [...grouped.values()].sort((a, b) => String(a.code).localeCompare(String(b.code))); $('fgForecastTable').innerHTML = list.length ? list.map(m => `<tr><td><b>${escapeHtml(m.code)}</b></td><td>${escapeHtml(m.name)}</td><td>${forecastNumber(m.weight)}</td><td>${escapeHtml(m.uomName)}</td><td>${forecastMoney(m.price)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">Belum ada pemakaian bahan baku dari Qty FG pada periode ini.</td></tr>'; const hpp = list.reduce((s, m) => s + m.price, 0), variableCost = Math.round(hpp * .01 * 100) / 100; $('fgHpp').textContent = forecastMoney(hpp); $('fgVariableCost').textContent = forecastMoney(variableCost); $('fgHppTotal').textContent = forecastMoney(hpp + variableCost); $('fgForecastPeriod').textContent = `${$('fgMonth').selectedOptions[0]?.text || $('fgMonth').value} ${$('fgYear').value} • berdasarkan Qty FG`;}
         $('fgForecastBtn').onclick = () => {const panel = $('fgForecastPanel'), opening = panel.classList.contains('hidden'); panel.classList.toggle('hidden', !opening); $('fgForecastBtn').textContent = opening ? 'Tutup Forecast' : 'Forecast'; $('fgForecastBtn').setAttribute('aria-expanded', String(opening)); if (opening) renderFGForecast();};
         $('fgMonth').addEventListener('change', () => {fgEditMode = false; $('fgEditBtn').textContent = 'Edit Data'; renderFinishGood(); if (!$('fgForecastPanel').classList.contains('hidden')) renderFGForecast();});
         $('fgYear').addEventListener('change', () => {fgEditMode = false; $('fgEditBtn').textContent = 'Edit Data'; renderFinishGood(); if (!$('fgForecastPanel').classList.contains('hidden')) renderFGForecast();});
         function initMRPFilters() {const month = $('mrpMonth'), year = $('mrpYear'); if (!month || !year) return; const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']; if (!month.options.length) month.innerHTML = months.map((m, i) => `<option value="${String(i + 1).padStart(2, '0')}">${m}</option>`).join(''); const now = new Date(); const years = new Set(Array.from({length: 10}, (_, i) => 2026 + i)); productionRecords.map(x => Number(String(x.productionDate || '').slice(0, 4))).filter(y => Number.isFinite(y) && y > 0).forEach(y => years.add(y)); year.innerHTML = [...years].sort((a, b) => a - b).map(y => `<option value="${y}">${y}</option>`).join(''); year.value = String(years.has(now.getFullYear()) ? now.getFullYear() : 2026); month.value = String(now.getMonth() + 1).padStart(2, '0'); if (!$('mrpDate').value) $('mrpDate').value = today();}
         function renderMRPMonthlyForecast() {const month = $('mrpMonth')?.value || String(new Date().getMonth() + 1).padStart(2, '0'), year = $('mrpYear')?.value || String(new Date().getFullYear()); const period = `${year}-${month}`; const rows = productionRecords.filter(x => String(x.productionDate || '').slice(0, 7) === period); const grouped = new Map(); rows.forEach(rec => (rec.items || []).forEach(m => {const key = [m.code || '', m.name || '', m.uomName || ''].join('|'); const item = grouped.get(key) || {code: m.code || '', name: m.name || '', uomName: m.uomName || '-', weight: 0, price: 0}; item.weight += Number(m.totalWeight ?? (Number(m.weight || 0) * Number(rec.qty || 0))) || 0; item.price += Number(m.totalPrice ?? (Number(m.price || 0) * Number(rec.qty || 0))) || 0; grouped.set(key, item);})); const list = [...grouped.values()].sort((a, b) => String(a.code).localeCompare(String(b.code))); const body = $('mrpMonthlyForecastTable'); if (body) body.innerHTML = list.length ? list.map(m => `<tr><td><b>${escapeHtml(m.code)}</b></td><td>${escapeHtml(m.name)}</td><td>${forecastNumber(m.weight)}</td><td>${escapeHtml(m.uomName)}</td><td>${forecastMoney(m.price)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">Belum ada pemakaian bahan baku pada bulan dan tahun ini.</td></tr>'; const hpp = list.reduce((s, m) => s + m.price, 0), variableCost = Math.round(hpp * 0.01 * 100) / 100, total = hpp + variableCost; const periodLabel = `${$('mrpMonth').selectedOptions[0]?.text || month} ${year} • ${rows.length} catatan produksi`; if ($('mrpForecastPeriod')) $('mrpForecastPeriod').textContent = periodLabel; if ($('mrpMonthlyHpp')) $('mrpMonthlyHpp').textContent = forecastMoney(hpp); if ($('mrpMonthlyVariableCost')) $('mrpMonthlyVariableCost').textContent = forecastMoney(variableCost); if ($('mrpMonthlyHppTotal')) $('mrpMonthlyHppTotal').textContent = forecastMoney(total);}
         function renderMRPProduction() {const body = $('mrpProductionTable'); if (!body) return; const month = $('mrpMonth')?.value || String(new Date().getMonth() + 1).padStart(2, '0'), year = $('mrpYear')?.value || String(new Date().getFullYear()); const rows = productionRecords.filter(x => String(x.productionDate || '').slice(0, 7) === `${year}-${month}`); body.innerHTML = rows.length ? rows.map(x => {const expanded = expandedProductionId === x.id; const details = expanded ? `<tr class="mrp-detail-row"><td colspan="4"><div style="padding:12px;background:#faf6ef;border-radius:10px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:10px"><strong>Detail Pemakaian Bahan Baku — ${escapeHtml(x.productName || '')}</strong><span>Tanggal Produksi: ${escapeHtml(x.productionDate || '-')}</span></div><div class="table-wrap"><table><thead><tr><th>Kode Bahan Baku</th><th>Nama Bahan Baku</th><th>Weight</th><th>UOM</th><th>Price</th></tr></thead><tbody>${(x.items || []).map(m => `<tr><td><b>${escapeHtml(m.code || '')}</b></td><td>${escapeHtml(m.name || '')}</td><td>${forecastNumber(m.totalWeight ?? (Number(m.weight || 0) * Number(x.qty || 0)))}</td><td>${escapeHtml(m.uomName || '-')}</td><td>${forecastMoney(m.totalPrice ?? (Number(m.price || 0) * Number(x.qty || 0)))}</td></tr>`).join('') || '<tr><td colspan="5">Tidak ada detail bahan baku.</td></tr>'}</tbody></table></div><div style="max-width:360px;margin:12px 0 0 auto"><div style="display:flex;justify-content:space-between;padding:4px 0"><span>HPP</span><b>${forecastMoney(x.hpp)}</b></div><div style="display:flex;justify-content:space-between;padding:4px 0"><span>Variable Cost (1%)</span><b>${forecastMoney(x.variableCost)}</b></div><div style="display:flex;justify-content:space-between;border-top:1px solid var(--line);padding:8px 0;font-size:16px"><strong>HPP Total</strong><strong>${forecastMoney(x.hppTotal)}</strong></div></div></div></td></tr>` : ''; return `<tr><td><b>${escapeHtml(x.productCode || '')}</b></td><td>${escapeHtml(x.productName || '')}</td><td>${Number(x.qty) || 0}</td><td><div class="master-actions"><button type="button" class="btn btn-light" data-mrp-detail="${x.id}">${expanded ? 'Tutup Detail' : 'Detail'}</button><button type="button" class="btn btn-light" data-mrp-delete="${x.id}">Delete</button></div></td></tr>${details}`;}).join('') : '<tr><td colspan="4" class="empty">Tidak ada data produksi pada bulan dan tahun ini.</td></tr>'; body.querySelectorAll('[data-mrp-detail]').forEach(b => b.onclick = () => {expandedProductionId = expandedProductionId === b.dataset.mrpDetail ? null : b.dataset.mrpDetail; renderMRPProduction();}); body.querySelectorAll('[data-mrp-delete]').forEach(b => b.onclick = async () => {const rec = productionRecords.find(x => x.id === b.dataset.mrpDelete); if (!rec || !confirm(`Hapus catatan produksi ${rec.productName || ''} sebanyak ${rec.qty || 0}?`)) return; try {await deleteDoc(doc(db, 'productionOrders', rec.id)); productionRecords = productionRecords.filter(x => x.id !== rec.id); if (expandedProductionId === rec.id) expandedProductionId = null; renderMRPProduction(); message('mrpListMessage', 'Data produksi berhasil dihapus.', 'success'); if (!$('mrpMonthlyForecast').classList.contains('hidden')) renderMRPMonthlyForecast();} catch (e) {message('mrpListMessage', 'Gagal menghapus data produksi: ' + friendlyError(e), 'danger');} });}
         $('mrpMonth').addEventListener('change', () => {renderMRPProduction(); renderMRPMonthlyForecast();}); $('mrpYear').addEventListener('change', () => {renderMRPProduction(); renderMRPMonthlyForecast();}); $('mrpForecastBtn').onclick = () => {const box = $('mrpMonthlyForecast'); const opening = box.classList.contains('hidden'); box.classList.toggle('hidden', !opening); $('mrpForecastBtn').setAttribute('aria-expanded', String(opening)); $('mrpForecastBtn').textContent = opening ? 'Tutup Forecast' : 'Forecast'; if (opening) renderMRPMonthlyForecast();};
         $('mrpProductionForm').onsubmit = async e => {e.preventDefault(); const productId = $('mrpProduct').value, qty = Number($('mrpQty').value), productionDate = $('mrpDate').value; if (!productId || !Number.isInteger(qty) || qty < 1 || !productionDate) {message('mrpMessage', 'Pilih produk, isi Qty Produksi bilangan bulat minimal 1, dan tentukan tanggal produksi.', 'danger'); return;} try {const p = products.find(x => x.id === productId); if (!p) throw new Error('Produk tidak ditemukan.'); const snap = await getDoc(doc(db, 'productForecasts', productId)); if (!snap.exists()) throw new Error('Forecast produk belum tersedia. Silakan buat dan simpan Forecast dari Master Produk terlebih dahulu.'); const recipe = snap.data(), recipeItems = Array.isArray(recipe.items) ? recipe.items : []; if (!recipeItems.length) throw new Error('Forecast produk belum memiliki bahan baku.'); const hpp = recipeItems.reduce((sum, m) => sum + (Number(m.price) || 0) * qty, 0), variableCost = Math.round(hpp * 0.01 * 100) / 100, hppTotal = hpp + variableCost; const items = recipeItems.map(m => ({...m, totalWeight: Math.round((Number(m.weight) || 0) * qty * 100000000) / 100000000, totalPrice: Math.round((Number(m.price) || 0) * qty * 100) / 100})); const payload = {productId, productCode: p.code || recipe.productCode || '', productName: p.name || recipe.productName || '', qty, productionDate, items, hpp: Math.round(hpp * 100) / 100, variableCostPercent: 1, variableCost, hppTotal: Math.round(hppTotal * 100) / 100, createdAt: serverTimestamp(), createdBy: currentUser?.uid || null}; const ref = doc(collection(db, 'productionOrders')); await setDoc(ref, payload); productionRecords.unshift({id: ref.id, ...payload}); $('mrpProductionForm').reset(); $('mrpDate').value = today(); initMRPFilters(); $('mrpMonth').value = productionDate.slice(5, 7); $('mrpYear').value = productionDate.slice(0, 4); renderMRPProduction(); message('mrpMessage', 'Data produksi berhasil disimpan. Detail pemakaian bahan baku dihitung dari Forecast × Qty Produksi.', 'success');} catch (err) {message('mrpMessage', 'Gagal menyimpan produksi: ' + friendlyError(err), 'danger');} };
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
         $('stockForm').onsubmit = async e => {
            e.preventDefault(); const id = $('stockProduct').value, qty = Number($('stockQty').value), date = $('stockDate').value; if (!id || qty < 1) return; try {
               await runTransaction(db, async tx => {const r = doc(db, 'products', id), s = await tx.get(r); if (!s.exists()) throw new Error('Produk tidak ditemukan'); tx.update(r, {stock: (Number(s.data().stock) || 0) + qty, updatedAt: serverTimestamp()});}); await addDoc(collection(db, 'stockEntries'), {productId: id, productName: products.find(p => p.id === id)?.name || '', qty, date, createdBy: currentUser.uid, createdAt: serverTimestamp()}); message('stockMessage', 'Stock berhasil ditambahkan.', 'success'); $('stockForm').reset(); $('stockDate').value = today();
               if ($('poDate')) $('poDate').value = today(); await loadAll();
            } catch (err) {message('stockMessage', 'Gagal input stock: ' + friendlyError(err), 'danger');}
         };
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
            if (!cart.length) {message('checkoutMessage', 'Keranjang masih kosong.', 'danger'); return;}
            const method = $('paymentMethod').value, subtotal = cartSubtotal(), promo = selectedPromo(), discount = cartDiscount(), total = cartTotal(), paid = Number($('cashReceived').value || 0), qrisPaid = Number($('qrisReceived').value || 0);
            // Pemeriksaan awal stok dari data terbaru yang sedang tampil di kasir.
            for (const item of cart) {const product = products.find(p => p.id === item.id); const available = Number(product?.stock) || 0; if (!product || available < item.qty) {showStockWarning(item.name, available, item.qty); return;} }
            const enteredCustomerValue = $('customerPhone').value.trim(), phone = selectedCustomer ? normalizePhone(selectedCustomer.phone || selectedCustomer.id) : normalizePhone(enteredCustomerValue), typedName = selectedCustomer?.name || $('customerName').value.trim(), typedAddress = selectedCustomer?.address || $('customerAddress').value.trim(), promoConsent = !!(selectedCustomer?.promoConsent || $('customerPromoConsent').checked);
            if (phone && phone.length < 8) {message('checkoutMessage', 'Nomor HP pelanggan minimal 8 angka.', 'danger'); return;}
            if (phone && !typedName) {showNewCustomerFields(true); message('checkoutMessage', 'Nama konsumen wajib diisi untuk nomor baru.', 'danger'); return;}
            if (phone && !selectedCustomer && !typedAddress) {showNewCustomerFields(true); message('checkoutMessage', 'Alamat konsumen wajib diisi untuk nomor baru.', 'danger'); return;}
            if (method === 'CASH' && paid < total) {message('checkoutMessage', 'Uang diterima kurang dari total setelah discount.', 'danger'); return;}
            if (method === 'QRIS' && qrisPaid !== total) {message('checkoutMessage', qrisPaid <= 0 ? 'Masukkan nominal pembayaran QRIS terlebih dahulu.' : 'Nominal QRIS harus sama persis dengan total tagihan (' + rupiah(total) + ').', 'danger'); return;}
            const checkoutButton = $('checkoutBtn'); checkoutButton.disabled = true; checkoutButton.textContent = 'MEMPROSES…';
            try {
               const items = cart.map(x => ({...x, subtotal: x.price * x.qty})); const txRef = doc(collection(db, 'transactions'));
               const customerRef = phone ? doc(db, 'customers', phone) : null, promoRef = promo ? doc(db, 'promos', promo.id) : null; let finalCustomerName = typedName, finalCustomerCode = selectedCustomer?.customerCode || null;
               await runTransaction(db, async t => {
                  const promoSnap = promoRef ? await t.get(promoRef) : null, customerSnap = customerRef ? await t.get(customerRef) : null, customerCounterSnap = (customerRef ? await t.get(customerCounterRef()) : null), productSnapshots = [];
                  for (const item of items) {const r = doc(db, 'products', item.id), snap = await t.get(r); productSnapshots.push({item, ref: r, snap});}
                  if (promoRef && (!promoSnap?.exists() || promoSnap.data().active === false)) throw new Error('Promo tidak lagi tersedia. Muat ulang aplikasi.');
                  if (customerSnap?.exists()) {finalCustomerName = customerSnap.data().name || typedName; finalCustomerCode = customerSnap.data().customerCode || null;}
                  for (const row of productSnapshots) {if (!row.snap.exists()) throw new Error(`Produk ${row.item.name} tidak ditemukan`); const stock = Number(row.snap.data().stock) || 0; if (stock < row.item.qty) throw new Error(`STOK TIDAK CUKUP! ${row.item.name}: sisa stok hanya ${stock} pcs, sedangkan kebutuhan ${row.item.qty} pcs. Silakan input tambah stock dahulu sebelum melakukan transaksi.`);}
                  for (const row of productSnapshots) {const stock = Number(row.snap.data().stock) || 0; t.update(row.ref, {stock: stock - row.item.qty, updatedAt: serverTimestamp()});}
                  if (customerRef && !customerSnap.exists()) t.set(customerRef, {name: typedName, address: typedAddress, phone, promoConsent, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), createdBy: currentUser.uid});
                  else if (customerRef && customerSnap.exists()) t.update(customerRef, {...(typedAddress ? {address: typedAddress} : {}), promoConsent: promoConsent || !!customerSnap.data().promoConsent, lastVisitAt: serverTimestamp(), updatedAt: serverTimestamp()});
                  t.set(txRef, {invoice: txRef.id.slice(-8).toUpperCase(), items, subtotal, discount, discountPercent: promo ? Number(promo.percent) : 0, promoId: promo?.id || null, promoName: promo?.name || null, total, method, cashReceived: method === 'CASH' ? paid : null, qrisPaidAmount: method === 'QRIS' ? qrisPaid : null, change: method === 'CASH' ? paid - total : null, customerName: finalCustomerName || null, customerAddress: typedAddress || null, customerPhone: phone || null, cashierName: getLoggedInCashierName(), createdByName: getLoggedInCashierName(), createdByEmail: String(currentUser?.email || ''), merchantId: method === 'QRIS' ? MERCHANT_QRIS_ID : null, status: method === 'CASH' ? 'PAID CASH' : 'PAID QRIS', createdBy: currentUser.uid, createdAt: serverTimestamp()});
               });
               const receiptData = {id: txRef.id, invoice: txRef.id.slice(-8).toUpperCase(), items, subtotal, discount, discountPercent: promo ? Number(promo.percent) : 0, promoName: promo?.name || null, total, method, cashReceived: method === 'CASH' ? paid : null, qrisPaidAmount: method === 'QRIS' ? qrisPaid : null, change: method === 'CASH' ? paid - total : null, customerName: finalCustomerName || null, customerCode: finalCustomerCode || null, customerAddress: typedAddress || null, customerPhone: phone || null, cashierName: getLoggedInCashierName(), status: method === 'CASH' ? 'PAID CASH' : 'PAID QRIS', date: new Date()};
               cart = []; $('cashReceived').value = ''; $('qrisReceived').value = ''; $('posCode').value = ''; $('posQty').value = 1; $('customerName').value = ''; $('customerName').readOnly = false; $('customerAddress').value = ''; $('customerPromoConsent').checked = false; showNewCustomerFields(false); selectedCustomer = null; $('customerPhone').value = ''; $('customerHint').textContent = 'Masukkan nomor HP untuk memeriksa data konsumen.'; $('posPromo').value = ''; $('productPreview').innerHTML = '<div class="empty" style="width:100%">Pilih produk untuk melihat detail.</div>'; $('paymentMethod').value = 'CASH'; $('qrisFields').classList.add('hidden'); $('cashFields').classList.remove('hidden'); renderCart();
               message('checkoutMessage', method === 'CASH' ? 'Transaksi CASH berhasil disimpan sebagai PAID CASH.' : 'Pembayaran QRIS telah diperiksa kasir dan transaksi berhasil disimpan sebagai PAID QRIS.', 'success'); await loadAll(); showReceipt(receiptData);
            } catch (err) {console.error(err); const errText = String(err?.message || ''); if (errText.includes('STOK TIDAK CUKUP!')) {const match = errText.match(/STOK TIDAK CUKUP!\s*(.*?): sisa stok hanya (\d+) pcs, sedangkan kebutuhan (\d+) pcs/i); if (match) showStockWarning(match[1], Number(match[2]), Number(match[3])); else showStockWarning('Produk dalam keranjang', 0, 0); await loadAll();} else {message('checkoutMessage', 'Transaksi gagal: ' + friendlyError(err), 'danger');} }
            finally {checkoutButton.disabled = false; checkoutButton.textContent = 'PROSES TRANSAKSI';}
         };
         function getLoggedInCashierName() {
            const displayName = String(currentUser?.displayName || '').trim();
            if (displayName) return displayName;
            const localPart = String(currentUser?.email || '').split('@')[0].trim();
            if (!localPart) return 'Kasir';
            return localPart.replace(/[._-]+/g, ' ').split(/\s+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
         }
         function getTransactionUserLabel(t) {
            const savedName = String(t?.createdByName || t?.cashierName || '').trim();
            if (savedName) return savedName;
            const email = String(t?.createdByEmail || '').trim();
            if (email) {const localPart = email.split('@')[0]; return localPart.replace(/[._-]+/g, ' ').split(/\s+/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');}
            return '-';
         }
         function showReceipt(t) {
            activeReceiptForPrint = t;
            const cashierName = String(t.cashierName || getLoggedInCashierName());
            const rows = (t.items || []).map(x => `<tr><td>${escapeHtml(x.name)}<br><small>${x.qty} × ${rupiah(x.price)}</small></td><td>${rupiah(x.subtotal ?? x.price * x.qty)}</td></tr>`).join('');
            $('receiptContent').innerHTML = `<div class="receipt-center" style="margin:0 auto 6px"><img src="logo.png" alt="Logo ROTI ANGET SUBUH" style="width:76px;height:76px;object-fit:contain;display:block;margin:0 auto 5px"></div><h2>ROTI ANGET SUBUH</h2><div class="receipt-center" style="margin:4px 0 12px;font-size:10px">Jl. Raya Kuta, No. 58D, Tuban</div><div class="receipt-center">STRUK PEMBAYARAN<br>${formatDate(t.date || t.createdAt)}<br>No: ${escapeHtml(t.invoice || '')}<br>Kasir: <b>${escapeHtml(cashierName)}</b></div>${t.customerName ? `<div style="font-size:11px;margin:8px 0">Pelanggan: <b>${escapeHtml(t.customerName)}</b>${t.customerCode ? `<br>No. Pelanggan: <b>${escapeHtml(t.customerCode)}</b>` : ''}</div>` : ''}<hr><table><tbody>${rows}</tbody></table><div class="receipt-total">${t.subtotal != null ? `<div class="total-line"><span>Subtotal</span><strong>${rupiah(t.subtotal)}</strong></div>` : ''}${t.discount ? `<div class="total-line"><span>Promo ${escapeHtml(t.promoName || '')}</span><strong>- ${rupiah(t.discount)} (${Number(t.discountPercent) || 0}%)</strong></div>` : ''}<div class="total-line"><span>Total bayar</span><strong>${rupiah(t.total)}</strong></div><div class="total-line"><span>Metode</span><strong>${escapeHtml(t.method)}</strong></div><div class="total-line"><span>Status</span><strong>${escapeHtml(t.status)}</strong></div>${t.method === 'CASH' ? `<div class="total-line"><span>Uang diterima</span><strong>${rupiah(t.cashReceived)}</strong></div><div class="total-line"><span>Kembalian</span><strong>${rupiah(t.change)}</strong></div>` : t.method === 'QRIS' ? `<div class="total-line"><span>Nominal dibayar via QRIS</span><strong>${rupiah(t.qrisPaidAmount ?? t.total)}</strong></div>` : ''}</div>${t.paymentAdjustment && t.paymentAdjustment.status === 'PENDING_ADMIN' ? `<div style="margin-top:12px;padding:9px;background:#fff3df;border:1px solid #e5c58e;border-radius:7px;font-size:10px"><b>SELISIH PEMBAYARAN — TINDAK LANJUT ADMIN</b><br>${t.paymentAdjustment.direction === 'REFUND_DUE' ? 'Kelebihan pembayaran' : 'Kekurangan pembayaran'}: ${rupiah(t.paymentAdjustment.amount)}</div>` : ''}${t.correctionCount ? `<div style="font-size:9px;color:#766b5c;margin-top:8px">Transaksi telah dikoreksi ${Number(t.correctionCount)} kali.</div>` : ''}<div class="receipt-center" style="margin-top:18px">Terima kasih atas kunjungan Anda.</div>`;
            $('receiptModal').classList.add('open');
         }
         function printDocument(title, body, options = {}) {
            const w = window.open('', '_blank', options.receipt ? 'width=420,height=700' : 'width=850,height=700');
            if (!w) {alert('Izinkan pop-up browser untuk mencetak.'); return;}
            const paperWidth = Number(options.paperWidth) || 58;
            const printBody = options.receipt ? body.replaceAll('src=\"logo.png\"', `src=\"${new URL('logo.png', location.href).href}\"`) : body;
            const styles = options.receipt
               ? `@page{size:${paperWidth}mm auto;margin:0}*{box-sizing:border-box}html,body{width:${paperWidth}mm;margin:0;padding:0;background:#fff;color:#111;font-family:Arial,sans-serif}body{width:${paperWidth}mm;padding:0 1.5mm;font-size:12px;line-height:1.25;overflow-x:hidden;overflow-wrap:anywhere}h2{font-size:18px;text-align:center;margin:0 0 4px}.receipt-center{text-align:center}hr{border:0;border-top:1px dashed #555;margin:6px 0}table{width:100%;max-width:100%;table-layout:fixed;border-collapse:collapse;font-size:12px;margin-top:4px}td{padding:2.5px 0;vertical-align:top}td:first-child{width:66%;text-align:left;padding-right:2px}td:last-child{width:34%;text-align:right!important;text-align-last:right;padding-left:1px;padding-right:0;font-size:12px;white-space:nowrap;overflow:visible;overflow-wrap:normal;word-break:normal;font-variant-numeric:tabular-nums}.receipt-total{border-top:1px dashed #555;margin-top:5px;padding-top:4px}.total-line{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:baseline;column-gap:4px;margin:3px 0;font-size:12px;width:100%}.total-line span{min-width:0;text-align:left;overflow-wrap:anywhere}.total-line strong{display:block;min-width:0;text-align:right!important;white-space:nowrap;max-width:none;overflow:visible;overflow-wrap:normal;word-break:normal;font-size:12px;font-variant-numeric:tabular-nums}@media print{@page{size:${paperWidth}mm auto;margin:0}html,body{width:${paperWidth}mm!important;margin:0!important;padding:0!important}body{padding:0 1.5mm!important}}`
               : `body{font:12px Arial,sans-serif;color:#222;margin:28px}h1,h2{text-align:center}p.center{text-align:center;color:#555}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{padding:9px;border-bottom:1px solid #ddd;text-align:left}th:last-child,td:last-child{text-align:right}.totals{margin:18px 0;text-align:right;font-size:14px;font-weight:bold}.small{font-size:10px;color:#666}@media print{button{display:none}}`;
            w.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>${styles}</style></head><body>${printBody}<script>window.onload=()=>{const imgs=[...document.images];Promise.all(imgs.map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.onload=img.onerror=resolve;}))).then(()=>{window.focus();window.print();});};<\/script></body></html>`);
            w.document.close();
         }
         // INPUT DATA WASTE: dua pencatatan terpisah, memakai snapshot harga saat disimpan.
         function wasteMoney(n) {return new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(Number(n) || 0);}
         function updateWasteMaterialOptions() {const sel = $('wasteMaterialSelect'), keep = sel.value; sel.innerHTML = '<option value="">Pilih bahan baku</option>' + rawMaterials.map(m => `<option value="${m.id}">${escapeHtml(m.code || '')} — ${escapeHtml(m.name || '')}</option>`).join(''); if (rawMaterials.some(m => m.id === keep)) sel.value = keep; updateWasteMaterialPreview();}
         function updateWasteProductOptions() {const sel = $('wasteProductSelect'), keep = sel.value; sel.innerHTML = '<option value="">Pilih produk</option>' + products.map(p => `<option value="${p.id}">${escapeHtml(p.code || '')} — ${escapeHtml(p.name || '')}</option>`).join(''); if (products.some(p => p.id === keep)) sel.value = keep; updateWasteProductPreview();}
         function selectedWasteMaterial() {return rawMaterials.find(m => m.id === $('wasteMaterialSelect').value) || null;}
         function updateWasteMaterialPreview() {const m = selectedWasteMaterial(), u = m ? uoms.find(x => x.id === m.uomId) : null, qty = Number($('wasteMaterialQty').value) || 0, avg = Number(m?.average) || 0; $('wasteMaterialUom').value = m ? (u?.name || m.uomName || '-') : ''; $('wasteMaterialAverage').value = m ? wasteMoney(avg) : ''; $('wasteMaterialValue').value = m && qty > 0 ? wasteMoney(qty * avg) : '';}
         async function updateWasteProductPreview() {const p = products.find(x => x.id === $('wasteProductSelect').value) || null; if (!p) {$('wasteProductHppUnit').value = ''; $('wasteProductHppTotal').value = ''; return;} try {let f = wasteForecastCache.get(p.id); if (!f) {const snap = await getDoc(doc(db, 'productForecasts', p.id)); if (!snap.exists()) throw new Error('Forecast produk belum dibuat.'); f = snap.data(); wasteForecastCache.set(p.id, f);} const unit = Number(f.hppTotal ?? f.hpp) || 0; $('wasteProductHppUnit').value = wasteMoney(unit); const qty = Number($('wasteProductQty').value) || 0; $('wasteProductHppTotal').value = qty > 0 ? wasteMoney(qty * unit) : wasteMoney(0); $('wasteProductMessage').textContent = ''; $('wasteProductMessage').className = 'muted';} catch (e) {$('wasteProductHppUnit').value = ''; $('wasteProductHppTotal').value = ''; $('wasteProductMessage').textContent = friendlyError(e); $('wasteProductMessage').className = 'danger';} }
         function wasteDateMatch(row, startId, endId) {const d = String(row.wasteDate || ''); const a = $(startId).value, b = $(endId).value; return (!a || d >= a) && (!b || d <= b);}
         function renderWasteMaterialTable() {const rows = wasteMaterialRecords.filter(x => wasteDateMatch(x, 'wasteMaterialStart', 'wasteMaterialEnd')); $('wasteMaterialTable').innerHTML = rows.length ? rows.map(x => `<tr><td>${escapeHtml(x.wasteDate || '-')}</td><td>${escapeHtml(x.materialCode || '-')}</td><td>${escapeHtml(x.materialName || '-')}</td><td>${forecastNumber(x.qty)}</td><td>${escapeHtml(x.uomName || '-')}</td><td>${wasteMoney(x.average)}</td><td><b>${wasteMoney(x.totalValue)}</b></td></tr>`).join('') : '<tr><td colspan="7" class="empty">Tidak ada data waste bahan baku pada rentang tanggal ini.</td></tr>';}
         function renderWasteProductTable() {const rows = wasteProductRecords.filter(x => wasteDateMatch(x, 'wasteProductStart', 'wasteProductEnd')); $('wasteProductTable').innerHTML = rows.length ? rows.map(x => `<tr><td>${escapeHtml(x.wasteDate || '-')}</td><td>${escapeHtml(x.productCode || '-')}</td><td>${escapeHtml(x.productName || '-')}</td><td>${forecastNumber(x.qty)}</td><td>${wasteMoney(x.hppPerPiece)}</td><td><b>${wasteMoney(x.totalHpp)}</b></td></tr>`).join('') : '<tr><td colspan="6" class="empty">Tidak ada data waste produk pada rentang tanggal ini.</td></tr>';}
         function printWasteMaterial() {const a = $('wasteMaterialStart').value, b = $('wasteMaterialEnd').value, rows = wasteMaterialRecords.filter(x => wasteDateMatch(x, 'wasteMaterialStart', 'wasteMaterialEnd')); const body = `<h1>ROTI ANGET SUBUH</h1><h2>Laporan Waste Bahan Baku</h2><p class="center">Periode: ${a || 'Awal'} s/d ${b || 'Sekarang'}</p><table><thead><tr><th>Tanggal</th><th>Kode</th><th>Bahan Baku</th><th>Qty</th><th>UOM</th><th>Average</th><th>Value Waste</th></tr></thead><tbody>${rows.map(x => `<tr><td>${escapeHtml(x.wasteDate)}</td><td>${escapeHtml(x.materialCode || '-')}</td><td>${escapeHtml(x.materialName || '-')}</td><td>${forecastNumber(x.qty)}</td><td>${escapeHtml(x.uomName || '-')}</td><td>${wasteMoney(x.average)}</td><td>${wasteMoney(x.totalValue)}</td></tr>`).join('') || '<tr><td colspan="7">Tidak ada data</td></tr>'}</tbody></table><p><b>Total Value Waste: ${wasteMoney(rows.reduce((s, x) => s + (Number(x.totalValue) || 0), 0))}</b></p>`; printDocument('Laporan Waste Bahan Baku', body);}
         function printWasteProduct() {const a = $('wasteProductStart').value, b = $('wasteProductEnd').value, rows = wasteProductRecords.filter(x => wasteDateMatch(x, 'wasteProductStart', 'wasteProductEnd')); const body = `<h1>ROTI ANGET SUBUH</h1><h2>Laporan Waste Produk</h2><p class="center">Periode: ${a || 'Awal'} s/d ${b || 'Sekarang'}</p><table><thead><tr><th>Tanggal</th><th>Kode</th><th>Produk</th><th>Qty</th><th>HPP/Pcs</th><th>Total HPP Waste</th></tr></thead><tbody>${rows.map(x => `<tr><td>${escapeHtml(x.wasteDate)}</td><td>${escapeHtml(x.productCode || '-')}</td><td>${escapeHtml(x.productName || '-')}</td><td>${forecastNumber(x.qty)}</td><td>${wasteMoney(x.hppPerPiece)}</td><td>${wasteMoney(x.totalHpp)}</td></tr>`).join('') || '<tr><td colspan="6">Tidak ada data</td></tr>'}</tbody></table><p><b>Total HPP Waste: ${wasteMoney(rows.reduce((s, x) => s + (Number(x.totalHpp) || 0), 0))}</b></p>`; printDocument('Laporan Waste Produk', body);}
         $('wasteMaterialTab').onclick = () => {$('wasteMaterialPanel').classList.remove('hidden'); $('wasteProductPanel').classList.add('hidden'); $('wasteMaterialTab').className = 'btn btn-primary'; $('wasteProductTab').className = 'btn btn-light';};
         $('wasteProductTab').onclick = () => {$('wasteProductPanel').classList.remove('hidden'); $('wasteMaterialPanel').classList.add('hidden'); $('wasteProductTab').className = 'btn btn-primary'; $('wasteMaterialTab').className = 'btn btn-light';};
         $('wasteMaterialSelect').addEventListener('change', updateWasteMaterialPreview); $('wasteMaterialQty').addEventListener('input', updateWasteMaterialPreview);
         $('wasteProductSelect').addEventListener('change', updateWasteProductPreview); $('wasteProductQty').addEventListener('input', updateWasteProductPreview);
         $('wasteMaterialForm').onsubmit = async e => {e.preventDefault(); const m = selectedWasteMaterial(), qty = Number($('wasteMaterialQty').value), wasteDate = $('wasteMaterialDate').value; if (!m || !(qty > 0) || !Number.isFinite(qty) || !wasteDate) {message('wasteMaterialMessage', 'Pilih bahan baku, isi Qty valid, dan tanggal proses.', 'danger'); return;} const unit = uoms.find(x => x.id === m.uomId), average = Number(m.average) || 0, payload = {materialId: m.id, materialCode: m.code || '', materialName: m.name || '', qty, uomId: m.uomId || '', uomName: unit?.name || m.uomName || '-', average, totalValue: Math.round(qty * average * 100) / 100, wasteDate, createdAt: serverTimestamp(), createdBy: currentUser?.uid || null}; try {const ref = doc(collection(db, 'wasteRawMaterials')); await setDoc(ref, payload); wasteMaterialRecords.unshift({id: ref.id, ...payload}); $('wasteMaterialForm').reset(); $('wasteMaterialDate').value = today(); updateWasteMaterialPreview(); renderWasteMaterialTable(); message('wasteMaterialMessage', 'Data waste bahan baku berhasil disimpan.', 'success');} catch (err) {message('wasteMaterialMessage', 'Gagal menyimpan waste bahan baku: ' + friendlyError(err), 'danger');} };
         $('wasteProductForm').onsubmit = async e => {e.preventDefault(); const p = products.find(x => x.id === $('wasteProductSelect').value), qty = Number($('wasteProductQty').value), wasteDate = $('wasteProductDate').value; if (!p || !(qty > 0) || !Number.isFinite(qty) || !wasteDate) {message('wasteProductMessage', 'Pilih produk, isi Qty valid, dan tanggal proses.', 'danger'); return;} try {let f = wasteForecastCache.get(p.id); if (!f) {const snap = await getDoc(doc(db, 'productForecasts', p.id)); if (!snap.exists()) throw new Error('Forecast produk belum dibuat. Simpan Forecast dari Master Produk terlebih dahulu.'); f = snap.data(); wasteForecastCache.set(p.id, f);} const hppPerPiece = Number(f.hppTotal ?? f.hpp) || 0; if (!(hppPerPiece > 0)) throw new Error('Nilai HPP Forecast produk tidak valid.'); const payload = {productId: p.id, productCode: p.code || '', productName: p.name || '', qty, hppPerPiece, totalHpp: Math.round(qty * hppPerPiece * 100) / 100, wasteDate, createdAt: serverTimestamp(), createdBy: currentUser?.uid || null}; const ref = doc(collection(db, 'wasteProducts')); await setDoc(ref, payload); wasteProductRecords.unshift({id: ref.id, ...payload}); $('wasteProductForm').reset(); $('wasteProductDate').value = today(); $('wasteProductHppUnit').value = ''; $('wasteProductHppTotal').value = ''; updateWasteProductOptions(); renderWasteProductTable(); message('wasteProductMessage', 'Data waste produk berhasil disimpan.', 'success');} catch (err) {message('wasteProductMessage', 'Gagal menyimpan waste produk: ' + friendlyError(err), 'danger');} };
         $('wasteMaterialFilter').onclick = renderWasteMaterialTable; $('wasteProductFilter').onclick = renderWasteProductTable; $('wasteMaterialPrint').onclick = printWasteMaterial; $('wasteProductPrint').onclick = printWasteProduct;
         $('wasteMaterialStart').addEventListener('change', renderWasteMaterialTable); $('wasteMaterialEnd').addEventListener('change', renderWasteMaterialTable); $('wasteProductStart').addEventListener('change', renderWasteProductTable); $('wasteProductEnd').addEventListener('change', renderWasteProductTable);
         $('wasteMaterialDate').value = today(); $('wasteProductDate').value = today(); $('wasteMaterialStart').value = today(); $('wasteMaterialEnd').value = today(); $('wasteProductStart').value = today(); $('wasteProductEnd').value = today();

         // Cetak struk memakai jalur dialog cetak yang sama dengan laporan.
         // Format kertas thermal dikunci pada 58 mm untuk semua perangkat.
         const RECEIPT_PAPER_STORAGE_KEY = 'rotiAngetReceiptPaperWidth';
         let activeReceiptForPrint = null;
         function getReceiptPaperWidth() {return 58;}
         $('receiptPaperSize').value = '58';
         $('receiptPaperSize').addEventListener('change', () => {
            $('receiptPaperSize').value = '58';
            const msg = $('printerSettingMessage');
            if (msg) msg.textContent = 'Ukuran kertas struk tetap 58 mm.';
         });
         function printReceiptThermal() {
            if (!activeReceiptForPrint) {
               alert('Data struk tidak tersedia. Buka ulang struk transaksi lalu coba cetak.');
               return;
            }
            const content = $('receiptContent').innerHTML;
            // printDocument membuka jendela cetak dan memanggil window.print(),
            // sama seperti alur cetak laporan transaksi.
            printDocument('Struk Pembayaran', content, {receipt: true, paperWidth: 58});
            const msg = $('printerSettingMessage');
            if (msg) msg.textContent = 'Dialog cetak dibuka. Pilih printer Bluetooth dari daftar printer Android dan gunakan kertas 58 mm.';
         }

         function makePrinterTestTransaction() {
            return {invoice: 'TEST-P58C', date: new Date(), items: [{name: 'TEST PRINT RAS001', qty: 2, price: 5000, subtotal: 10000}], subtotal: 10000, discount: 0, total: 10000, method: 'CASH', status: 'TEST PRINT', cashReceived: 10000, change: 0};
         }
         function latestTransactionTimestamp(t) {
            const value = t?.createdAt || t?.date;
            if (value?.toMillis) return value.toMillis();
            if (value?.toDate) return value.toDate().getTime();
            if (value instanceof Date) return value.getTime();
            const parsed = value ? new Date(value).getTime() : 0;
            return Number.isFinite(parsed) ? parsed : 0;
         }
         function reprintLastTransaction() {
            const latest = transactions.slice().sort((a, b) => latestTransactionTimestamp(b) - latestTransactionTimestamp(a))[0];
            if (!latest) {alert('Belum ada transaksi penjualan yang dapat dicetak ulang.'); return;}
            const receiptDate = latest.createdAt?.toDate ? latest.createdAt.toDate() : (latest.date?.toDate ? latest.date.toDate() : (latest.date ? new Date(latest.date) : new Date()));
            showReceipt({...latest, date: receiptDate});
         }
         $('reprintLastTransactionBtn').addEventListener('click', reprintLastTransaction);
         $('testPrinterBtn')?.addEventListener('click', () => {
            const oldReceipt = activeReceiptForPrint;
            const oldContent = $('receiptContent').innerHTML;
            showReceipt(makePrinterTestTransaction());
            printReceiptThermal();
            $('receiptContent').innerHTML = oldContent;
            activeReceiptForPrint = oldReceipt;
            $('receiptModal').classList.remove('open');
         });
         $('showPrinterGuideBtn')?.addEventListener('click', () => {
            const target = document.querySelector('#printerSettings .panel:nth-of-type(2)');
            target?.scrollIntoView({behavior: 'smooth', block: 'start'});
         });
         $('printReceiptBtn').onclick = printReceiptThermal;
         $('closeReceiptBtn').onclick = () => $('receiptModal').classList.remove('open');
         $('receiptModal').addEventListener('click', e => {if (e.target === $('receiptModal')) $('receiptModal').classList.remove('open');});
         // CANCEL TRANSAKSI: transaksi tidak dihapus; stok dan nilai penjualan dibalik secara atomik.
         let cancellationTarget = null;
         const paidTransactionStatuses = ['PAID', 'PAID CASH', 'PAID QRIS'];
         function findCancellationTransaction(value) {
            const key = String(value || '').trim().toUpperCase();
            if (!key) return null;
            return transactions.find(t => String(t.invoice || '').trim().toUpperCase() === key || String(t.id || '').trim().toUpperCase() === key || String(t.id || '').slice(-8).toUpperCase() === key);
         }
         function showCancellationTransaction(t) {
            cancellationTarget = t || null;
            const box = $('cancelTransactionDetails');
            if (!t) {box.classList.add('hidden'); $('cancelTransactionSummary').innerHTML = ''; return;}
            const status = String(t.status || '').toUpperCase();
            const canCancel = paidTransactionStatuses.includes(status) && !t.cancelledAt && !t.cancellation;
            const itemRows = (t.items || []).map(it => `<tr><td>${escapeHtml(it.name || it.productName || 'Produk')}</td><td style="text-align:center">${Number(it.qty) || 0}</td><td style="text-align:right">${rupiah(it.subtotal ?? ((Number(it.price) || 0) * (Number(it.qty) || 0)))}</td></tr>`).join('');
            $('cancelTransactionSummary').innerHTML = `<b>No. Transaksi:</b> ${escapeHtml(t.invoice || t.id)}<br><b>Tanggal:</b> ${escapeHtml(formatDate(t.createdAt))}<br><b>Pelanggan:</b> ${escapeHtml(t.customerName || '-')}<br><b>Metode:</b> ${escapeHtml(t.method || '-')}<br><b>Status:</b> <b>${escapeHtml(t.status || '-')}</b><div class="table-wrap" style="margin-top:10px"><table><thead><tr><th>Item</th><th>Qty</th><th>Subtotal</th></tr></thead><tbody>${itemRows || '<tr><td colspan="3">Tidak ada detail item.</td></tr>'}</tbody></table></div><div style="text-align:right;margin-top:10px"><b>Total Pembayaran: ${rupiah(t.total)}</b></div>`;
            $('cancelReason').value = ''; $('cancelAdminPassword').value = '';
            $('cancelTransactionBtn').disabled = !canCancel;
            $('cancelEligibilityMessage').textContent = canCancel ? 'Transaksi berstatus lunas dan dapat dibatalkan setelah alasan serta password Admin diverifikasi.' : status === 'CANCELLED' || t.cancelledAt || t.cancellation ? 'Transaksi ini sudah dibatalkan. Pembatalan tidak dapat dilakukan dua kali.' : 'Transaksi tidak berstatus lunas sehingga tidak dapat dibatalkan melalui fitur ini.';
            box.classList.remove('hidden');
         }
         $('cancelSearchBtn').onclick = () => {
            const key = $('cancelInvoiceSearch').value.trim();
            $('cancelActionMessage').textContent = '';
            if (!key) {message('cancelSearchMessage', 'Masukkan kode/nomor transaksi terlebih dahulu.', 'danger'); showCancellationTransaction(null); return;}
            const found = findCancellationTransaction(key);
            if (!found) {message('cancelSearchMessage', 'Transaksi tidak ditemukan. Periksa kembali kode transaksi.', 'danger'); showCancellationTransaction(null); return;}
            message('cancelSearchMessage', 'Transaksi ditemukan. Periksa detail sebelum melanjutkan.', 'success');
            showCancellationTransaction(found);
         };
         $('cancelInvoiceSearch').addEventListener('keydown', e => {if (e.key === 'Enter') {$('cancelSearchBtn').click();} });
         $('cancelTransactionBtn').onclick = async () => {
            const target = cancellationTarget;
            if (!target) return;
            const reason = $('cancelReason').value.trim(), adminPassword = $('cancelAdminPassword').value;
            if (!reason) {message('cancelActionMessage', 'Alasan pembatalan wajib diisi.', 'danger'); $('cancelReason').focus(); return;}
            if (!adminPassword) {message('cancelActionMessage', 'Password Admin wajib diisi.', 'danger'); $('cancelAdminPassword').focus(); return;}
            if (!confirm(`Yakin membatalkan transaksi ${target.invoice || target.id}? Stok item akan dikembalikan dan nilai penjualan dibalik dalam laporan.`)) return;
            const btn = $('cancelTransactionBtn'); btn.disabled = true; btn.textContent = 'MEMVERIFIKASI & MEMBATALKAN…';
            let adminApp = null, adminAuth = null;
            try {
               // Auth Admin terpisah dan in-memory: sesi kasir utama tetap aktif.
               adminApp = initializeApp(firebaseConfig, 'admin-cancel-' + Date.now() + '-' + Math.floor(Math.random() * 100000));
               adminAuth = getAuth(adminApp);
               await setPersistence(adminAuth, inMemoryPersistence);
               const adminCredential = await signInWithEmailAndPassword(adminAuth, ADMIN_EMAIL, adminPassword);
               const adminUser = adminCredential.user;
               if (String(adminUser.email || '').trim().toLowerCase() !== ADMIN_EMAIL) throw new Error('Akun yang digunakan bukan akun Admin.');
               const adminDb = getFirestore(adminApp);
               const txRef = doc(adminDb, 'transactions', target.id);
               const auditRef = doc(collection(adminDb, 'transactions', target.id, 'cancellations'));
               await runTransaction(adminDb, async tx => {
                  const txSnap = await tx.get(txRef);
                  if (!txSnap.exists()) throw new Error('Transaksi tidak ditemukan di database.');
                  const live = txSnap.data(), liveStatus = String(live.status || '').toUpperCase();
                  if (!paidTransactionStatuses.includes(liveStatus)) throw new Error(liveStatus === 'CANCELLED' || live.cancelledAt ? 'Transaksi sudah dibatalkan sebelumnya.' : 'Status transaksi sudah berubah dan tidak dapat dibatalkan.');
                  const qtyByProduct = new Map();
                  (Array.isArray(live.items) ? live.items : []).forEach(item => {
                     const productId = String(item.id || item.productId || '');
                     const qty = Number(item.qty) || 0;
                     if (!productId || !Number.isFinite(qty) || qty <= 0) throw new Error('Detail item transaksi tidak valid; pembatalan dihentikan agar stok tidak salah.');
                     qtyByProduct.set(productId, (qtyByProduct.get(productId) || 0) + qty);
                  });
                  if (!qtyByProduct.size) throw new Error('Transaksi tidak memiliki detail item untuk pengembalian stok.');
                  const productRows = [];
                  for (const [productId, qty] of qtyByProduct.entries()) {
                     const productRef = doc(adminDb, 'products', productId), productSnap = await tx.get(productRef);
                     if (!productSnap.exists()) throw new Error('Data produk tidak ditemukan sehingga stok tidak dapat dikembalikan: ' + productId);
                     productRows.push({productId, qty, ref: productRef, snap: productSnap, oldStock: Number(productSnap.data().stock) || 0});
                  }
                  const stockAdjustments = productRows.map(row => ({productId: row.productId, productName: row.snap.data().name || '', qtyReturned: row.qty, oldStock: row.oldStock, newStock: row.oldStock + row.qty}));
                  productRows.forEach(row => tx.update(row.ref, {stock: row.oldStock + row.qty, updatedAt: serverTimestamp()}));
                  const originalTotal = Number(live.total) || 0, originalStatus = live.status || '';
                  const cancellationData = {reason, originalStatus, amountReversed: originalTotal, paymentMethod: live.method || null, accountingStatus: 'REVENUE_REVERSED', cancelledAt: serverTimestamp(), cancelledByEmail: adminUser.email || ADMIN_EMAIL, cancelledByUid: adminUser.uid};
                  tx.update(txRef, {status: 'CANCELLED', cancellation: cancellationData, cancelReason: reason, cancelledAt: serverTimestamp(), cancelledByEmail: adminUser.email || ADMIN_EMAIL, cancelledByUid: adminUser.uid, amountReversed: originalTotal, accountingReversalStatus: 'REVENUE_REVERSED', updatedAt: serverTimestamp()});
                  tx.set(auditRef, {transactionId: target.id, invoice: live.invoice || target.id.slice(-8).toUpperCase(), reason, originalStatus, originalTotal, paymentMethod: live.method || null, accountingStatus: 'REVENUE_REVERSED', adminEmail: adminUser.email || ADMIN_EMAIL, adminUid: adminUser.uid, stockAdjustments, createdAt: serverTimestamp()});
               });
               $('cancelAdminPassword').value = '';
               message('cancelActionMessage', 'Transaksi berhasil dibatalkan. Stok telah dikembalikan dan nilai penjualan dibalik dalam pencatatan.', 'success');
               await loadAll();
               const updated = transactions.find(x => x.id === target.id);
               if (updated) showCancellationTransaction(updated);
            } catch (err) {
               console.error('Cancel transaksi:', err);
               const errText = err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found' ? 'Password Admin tidak sesuai atau akun Admin tidak ditemukan.' : friendlyError(err);
               message('cancelActionMessage', 'Pembatalan gagal: ' + errText, 'danger');
            } finally {
               if (adminAuth?.currentUser) {try {await signOut(adminAuth);} catch (signOutError) {console.warn('Sesi verifikasi Admin tidak dapat ditutup:', signOutError);} }
               if (adminApp) {try {await deleteApp(adminApp);} catch (deleteError) {console.warn('Aplikasi verifikasi Admin tidak dapat ditutup:', deleteError);} }
               btn.disabled = !cancellationTarget || !paidTransactionStatuses.includes(String(cancellationTarget.status || '').toUpperCase()) || !!cancellationTarget.cancelledAt || !!cancellationTarget.cancellation;
               btn.textContent = 'Batalkan Transaksi';
            }
         };
         function transactionDateKey(t) {const d = t.createdAt?.toDate ? t.createdAt.toDate() : (t.date?.toDate ? t.date.toDate() : (t.date ? new Date(t.date) : null)); if (!d || Number.isNaN(d.getTime())) return ''; return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;}
         let filteredTransactions = []; let historyFilterActive = true;
         let historyPageSize = 10, historyCurrentPage = 1, customerPageSize = 10, customerCurrentPage = 1;
         function setHistoryToday() {const now = new Date(), key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; $('historyStart').value = key; $('historyEnd').value = key; historyFilterActive = true; filteredTransactions = transactions.filter(t => transactionDateKey(t) === key); historyCurrentPage = 1; renderHistory();}
         function applyHistoryFilter() {historyFilterActive = true; const from = $('historyStart').value, to = $('historyEnd').value; filteredTransactions = transactions.filter(t => {const day = transactionDateKey(t); return day && (!from || day >= from) && (!to || day <= to);}); historyCurrentPage = 1; renderHistory();}
         $('filterHistoryBtn').onclick = () => {if (!$('historyStart').value && !$('historyEnd').value) {alert('Pilih minimal satu tanggal transaksi terlebih dahulu.'); return;} if ($('historyStart').value && $('historyEnd').value && $('historyStart').value > $('historyEnd').value) {alert('Tanggal awal tidak boleh melewati tanggal akhir.'); return;} applyHistoryFilter();};
         $('resetHistoryBtn').onclick = () => setHistoryToday();
         $('historyPageSize').onchange = () => {historyPageSize = Number($('historyPageSize').value) || 10; historyCurrentPage = 1; renderHistory();};
         (function initHistoryDateRange() {const now = new Date(), key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; $('historyStart').value = key; $('historyEnd').value = key;})();
         function renderHistory() {
            const list = filteredTransactions.slice().sort((a, b) => transactionDateKey(b).localeCompare(transactionDateKey(a)));
            const totalPages = Math.max(1, Math.ceil(list.length / historyPageSize)); historyCurrentPage = Math.min(historyCurrentPage, totalPages);
            const start = (historyCurrentPage - 1) * historyPageSize, visible = list.slice(start, start + historyPageSize);
            $('historyTable').innerHTML = visible.length ? visible.map(t => {const items = t.items || []; const itemNames = items.map(x => `<div>${escapeHtml(x.name || x.productName || 'Produk')}</div>`).join(''); const itemQty = items.map(x => `<div style="font-variant-numeric:tabular-nums">${Number(x.qty) || 0}</div>`).join(''); const corrected = Number(t.correctionCount || 0) > 0 || !!t.correctedAt; const cancelled = String(t.status || '').toUpperCase() === 'CANCELLED' || !!t.cancelledAt || !!t.cancellation; const reason = String(t.lastCorrectionReason || '').trim(); const cancelReason = String(t.cancelReason || t.cancellation?.reason || '').trim(); const auditText = cancelled ? `DIBATALKAN • Alasan: ${cancelReason || 'Tidak tersedia'}${t.cancelledAt ? ' • ' + formatCorrectionDate(t.cancelledAt) : ''}` : corrected ? `Alasan Koreksi: ${reason || 'Alasan tidak tersedia pada data koreksi lama'}${t.correctedAt ? ' • ' + formatCorrectionDate(t.correctedAt) : ''}` : 'Transaksi Normal'; return `<tr><td>${formatDate(t.createdAt)}</td><td>${escapeHtml(t.invoice || t.id.slice(-8))}</td><td><div style="display:grid;gap:5px">${itemNames || '-'}</div></td><td><div style="display:grid;gap:5px;text-align:center;font-weight:700">${itemQty || '-'}</div></td><td><span class="tag">${escapeHtml(t.method || '')}</span></td><td><small>${escapeHtml(t.status || '')}</small></td><td>${rupiah(t.total)}</td><td><button class="btn btn-light" data-receipt="${t.id}" style="padding:6px 9px">Lihat</button></td><td><button class="btn btn-gold" data-correct="${t.id}" style="padding:6px 9px" ${cancelled ? 'disabled title="Transaksi sudah dibatalkan"' : ''}>Koreksi</button></td><td>${cancelled ? `<span class="tag" style="background:#fde8e7;color:#9b2c25">DIBATALKAN</span><br><small>${escapeHtml(auditText)}</small>` : corrected ? `<span class="tag" style="background:#fff0d8;color:#80520b">SUDAH DIKOREKSI</span><br><small>${escapeHtml(auditText)}</small>` : '<small style="color:#888">Transaksi Normal</small>'}</td><td>${escapeHtml(getTransactionUserLabel(t))}</td></tr>`;}).join('') : '<tr><td colspan="11" class="empty">Tidak ada transaksi pada rentang tanggal yang dipilih.</td></tr>';
            $('historyCount').textContent = list.length; $('historyRevenue').textContent = rupiah(list.filter(t => ['PAID', 'PAID CASH', 'PAID QRIS'].includes(String(t.status || '').toUpperCase())).reduce((sum, t) => sum + (Number(t.total) || 0), 0));
            $('historyPagination').innerHTML = `<span>Menampilkan ${list.length ? start + 1 : 0}–${Math.min(start + historyPageSize, list.length)} dari ${list.length} transaksi sesuai tanggal filter</span><div class="pagination-actions"><button class="btn btn-light" id="historyPrev" type="button" ${historyCurrentPage <= 1 ? 'disabled' : ''}>‹ Sebelumnya</button><span>Halaman ${historyCurrentPage} / ${totalPages}</span><button class="btn btn-light" id="historyNext" type="button" ${historyCurrentPage >= totalPages ? 'disabled' : ''}>Berikutnya ›</button></div>`;
            $('historyPrev').onclick = () => {if (historyCurrentPage > 1) {historyCurrentPage--; renderHistory();} }; $('historyNext').onclick = () => {if (historyCurrentPage < totalPages) {historyCurrentPage++; renderHistory();} };
            document.querySelectorAll('[data-receipt]').forEach(b => b.onclick = () => {const t = transactions.find(x => x.id === b.dataset.receipt); if (t) showReceipt({...t, date: t.createdAt?.toDate ? t.createdAt.toDate() : (t.date?.toDate ? t.date.toDate() : (t.date ? new Date(t.date) : new Date()))});});
            document.querySelectorAll('[data-correct]').forEach(b => b.onclick = () => openCorrectionById(b.dataset.correct));
         }

         // LAPORAN SO STOCK: qty terjual dari transaksi lunas dalam periode tanggal.
         function initSOStockDates() {const d = new Date(), k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; $('soStart').value = k; $('soEnd').value = k;}
         function soDateKey(t) {const d = t.createdAt?.toDate ? t.createdAt.toDate() : (t.date?.toDate ? t.date.toDate() : (t.date ? new Date(t.date) : null)); if (!d || Number.isNaN(d.getTime())) return ''; return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;}
         function getSOStockRows() {const from = $('soStart').value, to = $('soEnd').value, sold = {}; transactions.forEach(t => {const day = soDateKey(t), status = String(t.status || '').toUpperCase(); if (!day || (from && day < from) || (to && day > to) || !['PAID', 'PAID CASH', 'PAID QRIS'].includes(status)) return; (t.items || []).forEach(it => {const id = String(it.id || it.productId || ''); if (id) sold[id] = (sold[id] || 0) + (Number(it.qty) || 0);});}); return products.map(p => ({product: p, qty: sold[p.id] || 0, value: (sold[p.id] || 0) * (Number(p.price) || 0)})).sort((a, b) => String(a.product.code || '').localeCompare(String(b.product.code || '')));}
         function renderSOStock() {const el = $('soStockTable'); if (!el) return; const rows = getSOStockRows(); el.innerHTML = rows.length ? rows.map(({product: p, qty, value}) => `<tr><td>${escapeHtml(p.code || '-')}</td><td>${p.imageUrl ? `<img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" style="width:48px;height:48px;object-fit:cover;border-radius:7px">` : '-'}</td><td>${escapeHtml(p.name || '-')}</td><td>${rupiah(p.price)}</td><td style="text-align:center;font-weight:700">${qty}</td><td>${rupiah(value)}</td><td style="text-align:center">${Number(p.stock) || 0}</td></tr>`).join('') : '<tr><td colspan="7" class="empty">Belum ada data produk.</td></tr>'; $('soPeriodLabel').textContent = `${$('soStart').value || 'Awal'} s/d ${$('soEnd').value || 'Akhir'}`; $('soTotalQty').textContent = rows.reduce((n, r) => n + r.qty, 0).toLocaleString('id-ID'); $('soTotalValue').textContent = rupiah(rows.reduce((n, r) => n + r.value, 0));}
         $('soFilterBtn').onclick = () => {if ($('soStart').value && $('soEnd').value && $('soStart').value > $('soEnd').value) {alert('Tanggal awal tidak boleh melewati tanggal akhir.'); return;} renderSOStock();};
         $('soPrintBtn').onclick = () => {if ($('soStart').value && $('soEnd').value && $('soStart').value > $('soEnd').value) {alert('Tanggal awal tidak boleh melewati tanggal akhir.'); return;} const rows = getSOStockRows(); const body = `<h1>ROTI ANGET SUBUH</h1><h2>LAPORAN SO STOCK / STOCK OPNAME</h2><p class="center">Periode: ${$('soStart').value || 'Tidak dibatasi'} s/d ${$('soEnd').value || 'Tidak dibatasi'}</p><table><thead><tr><th>Kode Item</th><th>Image</th><th>Nama Item</th><th>Price (Harga Jual)</th><th>Qty Terjual</th><th>Total Value</th><th>Stock Qty</th></tr></thead><tbody>${rows.map(({product: p, qty, value}) => `<tr><td>${escapeHtml(p.code || '-')}</td><td>${p.imageUrl ? `<img src="${p.imageUrl}" style="width:42px;height:42px;object-fit:cover">` : '-'}</td><td>${escapeHtml(p.name || '-')}</td><td>${rupiah(p.price)}</td><td style="text-align:center">${qty}</td><td>${rupiah(value)}</td><td style="text-align:center">${Number(p.stock) || 0}</td></tr>`).join('')}</tbody></table><div class="totals" style="text-align:left">Total Qty Terjual: ${rows.reduce((n, r) => n + r.qty, 0).toLocaleString('id-ID')}<br>Total Value: ${rupiah(rows.reduce((n, r) => n + r.value, 0))}</div><p class="small">Stock Qty adalah posisi stok saat laporan dicetak. Qty terjual dihitung dari transaksi lunas.</p>`; printDocument('SO Stock ROTI ANGET SUBUH', body);};

         // KOREKSI TRANSAKSI: Admin-only UI; stok dan transaksi diperbarui atomik di Firestore.
         let correctionTransaction = null;
         function correctionInvoiceValue(t) {return String(t.invoice || t.id || '').trim().toUpperCase();}
         function openCorrectionById(id) {
            if (!isAdminUser()) {alert('Menu koreksi hanya dapat digunakan Admin.'); return;}
            const t = transactions.find(x => x.id === id); if (!t) {alert('Transaksi tidak ditemukan.'); return;} if (String(t.status || '').toUpperCase() === 'CANCELLED' || t.cancelledAt || t.cancellation) {alert('Transaksi yang sudah dibatalkan tidak dapat dikoreksi kembali.'); return;}
            correctionTransaction = t; $('correctionInvoice').value = correctionInvoiceValue(t); $('correctionEditor').classList.remove('hidden'); $('correctionReason').value = ''; $('correctionMessage').textContent = '';
            $('correctionMeta').innerHTML = `<b>No. Transaksi:</b> ${escapeHtml(correctionInvoiceValue(t))}<br><b>Tanggal:</b> ${escapeHtml(formatDate(t.createdAt))}<br><b>Pelanggan:</b> ${escapeHtml(t.customerName || '-')}<br><b>Metode / Status:</b> ${escapeHtml(t.method || '-')} / ${escapeHtml(t.status || '-')}`;
            $('correctionItems').innerHTML = ''; (t.items || []).forEach(item => addCorrectionRow(item));
            $('correctionPromo').innerHTML = '<option value="">Tanpa Promo</option>' + promos.filter(p => p.active !== false).map(p => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} — ${Number(p.percent) || 0}%</option>`).join('');
            $('correctionPromo').value = t.promoId && promos.some(p => p.id === t.promoId && p.active !== false) ? t.promoId : '';
            $('correctionPromo').onchange = updateCorrectionTotals;
            updateCorrectionTotals(); $('correctionModal').classList.add('open');
         }
         function findCorrectionTransaction(value) {
            const key = String(value || '').trim().toUpperCase();
            return transactions.find(t => correctionInvoiceValue(t) === key || String(t.id || '').toUpperCase() === key || String(t.id || '').slice(-8).toUpperCase() === key);
         }
         $('correctionSearchBtn').onclick = () => {if (!isAdminUser()) return; const t = findCorrectionTransaction($('correctionInvoice').value); if (!t) {$('correctionEditor').classList.add('hidden'); alert('Nomor transaksi tidak ditemukan pada data yang sudah dimuat.'); return;} openCorrectionById(t.id);};
         $('correctionInvoice').addEventListener('keydown', e => {if (e.key === 'Enter') $('correctionSearchBtn').click();});
         function addCorrectionRow(item = {}) {
            const tr = document.createElement('tr');
            const selectedId = String(item.id || item.productId || '');
            tr.innerHTML = `<td><select class="correction-product"><option value="">Pilih produk</option>${products.map(p => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.code ? p.code + ' • ' : '')}${escapeHtml(p.name)} — ${rupiah(p.price)}</option>`).join('')}</select></td><td><input class="correction-qty" type="number" min="1" step="1" value="${Math.max(1, Number(item.qty) || 1)}"></td><td class="correction-price">-</td><td class="correction-subtotal">-</td><td><button type="button" class="btn btn-danger correction-remove" style="padding:5px 9px">×</button></td>`;
            $('correctionItems').appendChild(tr);
            const select = tr.querySelector('.correction-product'); if (selectedId && products.some(p => p.id === selectedId)) select.value = selectedId; else if (item.name) {const match = products.find(p => p.name === item.name); if (match) select.value = match.id;}
            select.addEventListener('change', updateCorrectionTotals); tr.querySelector('.correction-qty').addEventListener('input', updateCorrectionTotals); tr.querySelector('.correction-remove').onclick = () => {tr.remove(); updateCorrectionTotals();}; updateCorrectionTotals();
         }
         $('correctionAddItemBtn').onclick = () => addCorrectionRow();
         function getCorrectionItems() {
            const rows = [...$('correctionItems').querySelectorAll('tr')], result = [];
            for (const tr of rows) {const id = tr.querySelector('.correction-product').value, qty = Number(tr.querySelector('.correction-qty').value), p = products.find(x => x.id === id); if (!id || !p || !Number.isInteger(qty) || qty < 1) throw new Error('Pilih produk dan masukkan Qty bilangan bulat minimal 1 pada setiap baris.'); result.push({id: p.id, code: p.code || '', name: p.name, price: Number(p.price) || 0, qty, subtotal: (Number(p.price) || 0) * qty});}
            if (!result.length) throw new Error('Transaksi harus memiliki minimal satu item.'); return result;
         }
         function correctionTotals(items) {
            const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
            const promo = promos.find(p => p.id === $('correctionPromo').value && p.active !== false) || null;
            const discountPercent = promo ? Math.max(0, Math.min(100, Number(promo.percent) || 0)) : 0;
            const discount = promo ? Math.round(subtotal * discountPercent / 100) : 0;
            return {subtotal, discount, discountPercent, total: Math.max(0, subtotal - discount), promoId: promo?.id || null, promoName: promo?.name || null};
         }
         function updateCorrectionTotals() {
            if (!correctionTransaction) return;
            try {
               const items = getCorrectionItems(), tot = correctionTotals(items);
               $('correctionItems').querySelectorAll('tr').forEach((tr, i) => {tr.querySelector('.correction-price').textContent = rupiah(items[i].price); tr.querySelector('.correction-subtotal').textContent = rupiah(items[i].subtotal);});
               const previousTotal = Number(correctionTransaction.total) || 0;
               const delta = previousTotal - tot.total;
               $('correctionTotals').innerHTML = `Subtotal baru: <b>${rupiah(tot.subtotal)}</b><br>Promo: <b>${escapeHtml(tot.promoName || 'Tanpa Promo')}</b> (${tot.discountPercent}%)<br>Diskon: <b>${rupiah(tot.discount)}</b><br>Total baru: <b>${rupiah(tot.total)}</b><br>Total transaksi sebelumnya: ${rupiah(previousTotal)}`;
               $('correctionPaymentNote').textContent = delta === 0 ? 'Tidak ada selisih terhadap total transaksi sebelumnya.' : delta > 0 ? `Kelebihan pembayaran / dana yang perlu dikembalikan: ${rupiah(delta)}. Perhitungan berdasarkan total lama dikurangi total baru.` : `Kekurangan pembayaran / dana yang perlu ditagihkan: ${rupiah(Math.abs(delta))}. Perhitungan berdasarkan total lama dikurangi total baru.`;
            } catch (e) {
               $('correctionTotals').textContent = e.message;
               $('correctionPaymentNote').textContent = 'Lengkapi item untuk melihat selisih pembayaran.';
            }
         }
         $('correctionItems').addEventListener('input', e => {if (e.target.matches('.correction-qty')) updateCorrectionTotals();});
         $('correctionItems').addEventListener('change', e => {if (e.target.matches('.correction-product')) updateCorrectionTotals();});
         function closeCorrection() {$('correctionModal').classList.remove('open'); correctionTransaction = null;}
         $('correctionCloseBtn').onclick = closeCorrection; $('correctionCancelBtn').onclick = closeCorrection; $('correctionModal').addEventListener('click', e => {if (e.target === $('correctionModal')) closeCorrection();});
         $('correctionSaveBtn').onclick = async () => {
            if (!isAdminUser() || !correctionTransaction) return;
            const btn = $('correctionSaveBtn'); btn.disabled = true; btn.textContent = 'MENYIMPAN…';
            try {
               const before = JSON.parse(JSON.stringify({...correctionTransaction, createdAt: undefined, updatedAt: undefined}));
               const items = getCorrectionItems(), totals = correctionTotals(items), reason = $('correctionReason').value.trim(); if (!reason) throw new Error('Alasan koreksi wajib diisi.');
               const txRef = doc(db, 'transactions', correctionTransaction.id), auditRef = doc(collection(db, 'transactions', correctionTransaction.id, 'corrections'));
               const qtyByProduct = arr => {const m = {}; arr.forEach(x => {const id = String(x.id || x.productId || ''); if (id) m[id] = (m[id] || 0) + (Number(x.qty) || 0);}); return m;};
               const oldQty = qtyByProduct(correctionTransaction.items || []), newQty = qtyByProduct(items), ids = [...new Set([...Object.keys(oldQty), ...Object.keys(newQty)])];
               // Selisih koreksi dihitung dari TOTAL TRANSAKSI LAMA - TOTAL BARU.
               // Nominal uang tunai yang diserahkan (cashReceived) tidak dipakai karena sudah termasuk kembalian.
               const previousTotal = Number(correctionTransaction.total) || 0;
               const paymentDelta = previousTotal - totals.total;
               const paymentAdjustment = {amount: Math.abs(paymentDelta), direction: paymentDelta > 0 ? 'REFUND_DUE' : paymentDelta < 0 ? 'COLLECTION_DUE' : 'NONE', status: paymentDelta === 0 ? 'NO_DIFFERENCE' : 'PENDING_ADMIN', previousTotal, newTotal: totals.total, method: correctionTransaction.method || null, updatedAt: serverTimestamp()};
               const after = {items, subtotal: totals.subtotal, discount: totals.discount, discountPercent: totals.discountPercent, promoId: totals.promoId, promoName: totals.promoName, total: totals.total, paymentAdjustment, correctedAt: serverTimestamp(), correctedBy: currentUser.uid, lastCorrectionReason: reason, lastCorrectedByEmail: currentUser.email || '', correctionCount: (Number(correctionTransaction.correctionCount) || 0) + 1, updatedAt: serverTimestamp()};
               await runTransaction(db, async t => {
                  const txSnap = await t.get(txRef); if (!txSnap.exists()) throw new Error('Transaksi sudah tidak ditemukan. Muat ulang data.');
                  if (Number(txSnap.data().correctionCount || 0) !== Number(correctionTransaction.correctionCount || 0)) throw new Error('Data transaksi berubah sejak dibuka. Muat ulang sebelum koreksi kembali.');
                  const productSnaps = []; for (const id of ids) {const ref = doc(db, 'products', id), snap = await t.get(ref); if (!snap.exists()) throw new Error('Produk yang terkait transaksi tidak ditemukan: ' + id); productSnaps.push({id, ref, snap});}
                  for (const row of productSnaps) {const delta = (oldQty[row.id] || 0) - (newQty[row.id] || 0), stock = Number(row.snap.data().stock) || 0; if (delta < 0 && stock < Math.abs(delta)) throw new Error(`Stok ${row.snap.data().name || row.id} tidak cukup untuk koreksi. Tersedia ${stock}, tambahan dibutuhkan ${Math.abs(delta)}.`);}
                  for (const row of productSnaps) {const delta = (oldQty[row.id] || 0) - (newQty[row.id] || 0); if (delta) t.update(row.ref, {stock: (Number(row.snap.data().stock) || 0) + delta, updatedAt: serverTimestamp()});}
                  t.update(txRef, after);
                  t.set(auditRef, {transactionId: correctionTransaction.id, invoice: correctionTransaction.invoice || correctionTransaction.id.slice(-8).toUpperCase(), before, after: {...after, correctedAt: new Date(), updatedAt: new Date()}, reason, adminEmail: currentUser.email || '', adminUid: currentUser.uid, correctedAt: serverTimestamp(), stockAdjustments: ids.map(id => ({productId: id, oldQty: oldQty[id] || 0, newQty: newQty[id] || 0, delta: (oldQty[id] || 0) - (newQty[id] || 0)}))});
               });
               message('correctionMessage', 'Koreksi berhasil disimpan. Stok dan data transaksi telah diperbarui. Selisih pembayaran berstatus tindak lanjut Admin.', 'success');
               await loadAll(); const updated = transactions.find(x => x.id === correctionTransaction.id); if (updated) correctionTransaction = updated; closeCorrection();
               if (updated && confirm('Koreksi tersimpan. Apakah Anda ingin melihat dan mencetak struk terbaru?')) showReceipt({...updated, date: updated.createdAt?.toDate ? updated.createdAt.toDate() : new Date()});
            } catch (err) {console.error('Koreksi transaksi:', err); message('correctionMessage', 'Gagal menyimpan koreksi: ' + friendlyError(err), 'danger');}
            finally {btn.disabled = false; btn.textContent = 'Simpan Koreksi';}
         };
         $('printReportBtn').onclick = () => {
            const from = $('historyStart').value, to = $('historyEnd').value; const list = filteredTransactions;
            const paid = list.filter(t => ['PAID', 'PAID CASH', 'PAID QRIS'].includes(String(t.status || '').toUpperCase()));
            const cancelledList = list.filter(t => String(t.status || '').toUpperCase() === 'CANCELLED' || !!t.cancelledAt || !!t.cancellation);
            const totalCancelled = cancelledList.reduce((sum, t) => sum + (Number(t.amountReversed ?? t.total) || 0), 0);
            const rows = list.map(t => {const items = t.items || []; const corrected = Number(t.correctionCount || 0) > 0 || !!t.correctedAt; const cancelled = String(t.status || '').toUpperCase() === 'CANCELLED' || !!t.cancelledAt || !!t.cancellation; const reason = String(t.lastCorrectionReason || '').trim(); const cancelReason = String(t.cancelReason || t.cancellation?.reason || '').trim(); const auditText = cancelled ? `DIBATALKAN • Alasan: ${cancelReason || 'Tidak tersedia'}` : corrected ? `Alasan Koreksi: ${reason || 'Alasan tidak tersedia pada data koreksi lama'}${t.correctedAt ? ' • ' + formatCorrectionDate(t.correctedAt) : ''}` : 'Transaksi Normal'; return `<tr><td>${escapeHtml(formatDate(t.createdAt))}</td><td>${escapeHtml(t.invoice || t.id.slice(-8))}</td><td>${items.map(x => escapeHtml(x.name || x.productName || 'Produk')).join('<br>')}</td><td style="text-align:center">${items.map(x => Number(x.qty) || 0).join('<br>')}</td><td>${escapeHtml(t.customerName || '-')}<br>${escapeHtml(t.customerPhone || '')}</td><td>${escapeHtml(t.promoName || '-')} ${t.discount ? `(${Number(t.discountPercent) || 0}% / ${rupiah(t.discount)})` : ''}</td><td>${escapeHtml(t.method || '')}</td><td>${escapeHtml(t.status || '')}</td><td>${rupiah(t.total)}</td><td>${escapeHtml(auditText)}</td><td>${escapeHtml(getTransactionUserLabel(t))}</td></tr>`;}).join('');
            const totalLunas = paid.reduce((s, t) => s + (Number(t.total) || 0), 0);
            const totalQris = paid.filter(t => t.method === 'QRIS').reduce((s, t) => s + (Number(t.total) || 0), 0);
            const totalCash = paid.filter(t => t.method === 'CASH').reduce((s, t) => s + (Number(t.total) || 0), 0);
            const body = `<h1>ROTI ANGET SUBUH</h1><h2>LAPORAN TRANSAKSI PENJUALAN</h2><p class="center">Periode: ${from || 'Tanggal awal tidak dibatasi'} s/d ${to || 'Tanggal akhir tidak dibatasi'}</p><p>Jumlah transaksi: <b>${list.length}</b> | Transaksi lunas: <b>${paid.length}</b> | Transaksi dibatalkan: <b>${cancelledList.length}</b></p><table><thead><tr><th>Tanggal</th><th>No. Transaksi</th><th>Item</th><th>Qty</th><th>Pelanggan</th><th>Promo / Diskon</th><th>Metode</th><th>Status</th><th>Total</th><th>Keterangan</th><th>User</th></tr></thead><tbody>${rows || '<tr><td colspan="11">Tidak ada transaksi</td></tr>'}</tbody></table><div class="totals" style="text-align:left;max-width:420px;margin-left:auto;line-height:1.9"><div><b>Total penjualan lunas:</b> <span style="float:right">${rupiah(totalLunas)}</span></div><div><b>Total nilai transaksi dibatalkan (pembalik):</b> <span style="float:right">${rupiah(totalCancelled)}</span></div><div>Pembayaran QRIS <span style="float:right">${rupiah(totalQris)}</span></div><div>Pembayaran CASH <span style="float:right">${rupiah(totalCash)}</span></div></div><p class="small">Rincian pembayaran dipisahkan berdasarkan metode untuk membantu pencocokan setoran kas. Pembayaran QRIS dan CASH dihitung sebagai transaksi lunas setelah diperiksa.</p>`;
            printDocument('Laporan Transaksi Bakery', body);
         };

         let activeCustomerCard = null;
         function customerCardMarkup(c) {
            const code = c.customerCode || 'NPRAS—';
            return `<div class="member-card-top"><div class="member-card-brand">ROTI ANGET SUBUH<small>BAKERY • MEMBER PRIVILEGE</small></div><div class="member-card-chip"></div></div><div class="member-card-label">CUSTOMER MEMBERSHIP NUMBER</div><div class="member-card-number">${escapeHtml(code)}</div><div class="member-card-name">${escapeHtml(c.name || 'Pelanggan')}</div><div style="font-size:8px;color:#e4d4b9;margin-top:5px">HP ${escapeHtml(c.phone || c.id || '-')}</div><div style="font-size:8px;color:#e4d4b9;margin-top:3px;max-width:85%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">ALAMAT ${escapeHtml(c.address || '-')}</div><div class="member-card-bottom"><span>MEMBER SINCE ${escapeHtml(c.createdAt?.toDate ? c.createdAt.toDate().getFullYear() : new Date().getFullYear())}</span><span>FRESH • WARM • SPECIAL</span></div>`;
         }
         function drawCustomerCardCanvas(c) {
            const canvas = document.createElement('canvas'); canvas.width = 1060; canvas.height = 668;
            const ctx = canvas.getContext('2d'), g = ctx.createLinearGradient(0, 0, 1060, 668);
            g.addColorStop(0, '#17140f'); g.addColorStop(.58, '#34291e'); g.addColorStop(1, '#795a33');
            ctx.fillStyle = g; ctx.fillRect(0, 0, 1060, 668);
            const glow = ctx.createRadialGradient(930, 80, 10, 930, 80, 470); glow.addColorStop(0, 'rgba(207,164,94,.38)'); glow.addColorStop(1, 'rgba(207,164,94,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 0, 1060, 668);
            ctx.strokeStyle = '#d9bd83'; ctx.lineWidth = 3; ctx.strokeRect(18, 18, 1024, 632);
            ctx.beginPath(); ctx.arc(1040, 650, 260, Math.PI, Math.PI * 1.5); ctx.strokeStyle = 'rgba(226,197,143,.65)'; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = '#f9f0df'; ctx.font = '600 43px Georgia'; ctx.fillText('ROTI ANGET SUBUH', 65, 100);
            ctx.fillStyle = '#dfc18b'; ctx.font = '22px Arial'; ctx.letterSpacing = '5px'; ctx.fillText('BAKERY  •  MEMBER PRIVILEGE', 67, 140);
            const chip = ctx.createLinearGradient(850, 60, 950, 125); chip.addColorStop(0, '#a77b3d'); chip.addColorStop(.5, '#f0d8a5'); chip.addColorStop(1, '#8d6738'); ctx.fillStyle = chip; ctx.beginPath(); ctx.roundRect(900, 65, 92, 65, 12); ctx.fill();
            ctx.fillStyle = '#dfc18b'; ctx.font = '22px Arial'; ctx.fillText('CUSTOMER MEMBERSHIP NUMBER', 67, 255);
            ctx.fillStyle = '#fff7e8'; ctx.font = 'bold 62px Arial'; ctx.fillText(c.customerCode || 'NPRAS—', 67, 335);
            ctx.fillStyle = '#fff7e8'; ctx.font = 'bold 42px Georgia'; ctx.fillText(String(c.name || 'Pelanggan').slice(0, 32), 67, 425);
            ctx.fillStyle = '#e4d4b9'; ctx.font = '21px Arial'; ctx.fillText('MEMBER SINCE ' + (c.createdAt?.toDate ? c.createdAt.toDate().getFullYear() : new Date().getFullYear()), 67, 505);
            ctx.font = '19px Arial'; ctx.fillText('HP ' + String(c.phone || c.id || '-').slice(0, 42), 67, 550);
            ctx.font = '17px Arial'; ctx.fillText('ALAMAT ' + String(c.address || '-').slice(0, 68), 67, 595);
            ctx.textAlign = 'right'; ctx.font = '18px Arial'; ctx.fillText('FRESH  •  WARM  •  SPECIAL', 990, 625); ctx.textAlign = 'left';
            return canvas;
         }
         function openCustomerCard(c) {
            activeCustomerCard = c;
            $('customerCardArtwork').innerHTML = customerCardMarkup(c);
            $('customerCardDetails').innerHTML = `<b>Nama:</b> ${escapeHtml(c.name || '-')}<br><b>Nomor pelanggan:</b> ${escapeHtml(c.customerCode || 'Belum tersedia')}<br><b>Nomor HP:</b> ${escapeHtml(c.phone || c.id || '-')}<br><b>Alamat:</b> ${escapeHtml(c.address || '-')}<br><b>Status promo WhatsApp:</b> ${c.promoConsent ? 'Disetujui' : 'Belum disetujui'}`;
            $('customerCardModal').classList.add('open');
         }
         function downloadCustomerCard() {
            if (!activeCustomerCard) return;
            const canvas = drawCustomerCardCanvas(activeCustomerCard), link = document.createElement('a');
            link.download = `Kartu-${activeCustomerCard.customerCode || 'Pelanggan'}.png`; link.href = canvas.toDataURL('image/png'); link.click();
         }
         $('downloadCustomerCardBtn').onclick = downloadCustomerCard;
         $('closeCustomerCardBtn').onclick = () => $('customerCardModal').classList.remove('open');
         $('customerCardModal').addEventListener('click', e => {if (e.target === $('customerCardModal')) $('customerCardModal').classList.remove('open');});
         $('shareCustomerCardBtn').onclick = async () => {
            if (!activeCustomerCard) return;
            const c = activeCustomerCard, canvas = drawCustomerCardCanvas(c), phone = normalizePhone(c.phone || c.id), waPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
            const messageText = `Halo ${c.name || 'Pelanggan'}, berikut Kartu Pelanggan ROTI ANGET SUBUH Anda. Nomor pelanggan: ${c.customerCode || '-'}. Tunjukkan nomor ini saat bertransaksi. Terima kasih telah menjadi pelanggan kami.`;
            try {
               const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
               const file = new File([blob], `Kartu-${c.customerCode || 'Pelanggan'}.png`, {type: 'image/png'});
               if (navigator.canShare && navigator.canShare({files: [file]}) && navigator.share) {
                  await navigator.share({files: [file], title: 'Kartu Pelanggan ROTI ANGET SUBUH', text: messageText});
               } else {
                  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
                  window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(messageText + ' Silakan lampirkan gambar kartu yang baru tersimpan.')}`, '_blank', 'noopener');
                  alert('Gambar kartu telah diunduh. Lampirkan file PNG tersebut pada chat WhatsApp pelanggan.');
               }
            } catch (err) {if (err.name !== 'AbortError') {console.error(err); alert('Tidak dapat membagikan kartu. Gunakan tombol Simpan Kartu PNG lalu kirim melalui WhatsApp.');} }
         };

         // MANAGEMENT: Data konsumen dan pengiriman promo WhatsApp bertahap.
         function renderCustomers() {
            const q = String($('customerSearch')?.value || '').trim().toLowerCase();
            const list = customers.filter(c => !q || String(c.name || '').toLowerCase().includes(q) || String(c.phone || c.id).includes(q) || String(c.customerCode || '').toLowerCase().includes(q) || String(c.address || '').toLowerCase().includes(q)).sort((a, b) => {const an = customerSequence(a.customerCode), bn = customerSequence(b.customerCode); if (an && bn) return an - bn; if (an) return -1; if (bn) return 1; return String(a.customerCode || '').localeCompare(String(b.customerCode || ''), 'id');});
            const totalPages = Math.max(1, Math.ceil(list.length / customerPageSize)); customerCurrentPage = Math.min(customerCurrentPage, totalPages);
            const start = (customerCurrentPage - 1) * customerPageSize, visible = list.slice(start, start + customerPageSize);
            $('customerCount').textContent = `${customers.length} konsumen`;
            $('customersTable').innerHTML = visible.length ? visible.map(c => `<tr><td><span class="tag">${escapeHtml(c.customerCode || 'Belum dibuat')}</span></td><td><b>${escapeHtml(c.name || '-')}</b></td><td>${escapeHtml(c.address || '-')}</td><td>${escapeHtml(c.phone || c.id)}</td><td><span class="tag ${c.promoConsent ? '' : 'tag-muted'}">${c.promoConsent ? 'Bersedia' : 'Belum setuju'}</span></td><td><div class="customer-action-buttons"><button class="btn btn-primary" data-customer-card="${escapeHtml(c.id)}" type="button">Buat Kartu</button><button class="btn ${c.promoConsent ? 'btn-light' : 'btn-gold'}" data-consent-customer="${escapeHtml(c.id)}" data-consent-next="${c.promoConsent ? 'false' : 'true'}">${c.promoConsent ? 'Nonaktifkan Promo' : 'Izinkan Promo'}</button></div></td></tr>`).join('') : '<tr><td colspan="6" class="empty">Belum ada data konsumen.</td></tr>';
            $('customerPagination').innerHTML = `<span>Menampilkan ${list.length ? start + 1 : 0}–${Math.min(start + customerPageSize, list.length)} dari ${list.length} konsumen${q ? ' (hasil pencarian)' : ''}</span><div class="pagination-actions"><button class="btn btn-light" id="customerPrev" type="button" ${customerCurrentPage <= 1 ? 'disabled' : ''}>‹ Sebelumnya</button><span>Halaman ${customerCurrentPage} / ${totalPages}</span><button class="btn btn-light" id="customerNext" type="button" ${customerCurrentPage >= totalPages ? 'disabled' : ''}>Berikutnya ›</button></div>`;
            $('customerPrev').onclick = () => {if (customerCurrentPage > 1) {customerCurrentPage--; renderCustomers();} }; $('customerNext').onclick = () => {if (customerCurrentPage < totalPages) {customerCurrentPage++; renderCustomers();} };
            document.querySelectorAll('[data-customer-card]').forEach(btn => btn.onclick = () => {const c = customers.find(x => x.id === btn.dataset.customerCard); if (c) openCustomerCard(c);});
            document.querySelectorAll('[data-consent-customer]').forEach(btn => btn.onclick = async () => {const id = btn.dataset.consentCustomer, next = btn.dataset.consentNext === 'true'; if (!confirm(next ? 'Aktifkan izin promo WhatsApp untuk konsumen ini? Pastikan konsumen sudah menyetujui.' : 'Nonaktifkan izin promo WhatsApp?')) return; try {await updateDoc(doc(db, 'customers', id), {promoConsent: next, updatedAt: serverTimestamp()}); const c = customers.find(x => x.id === id); if (c) c.promoConsent = next; renderCustomers(); renderBlastDrafts();} catch (err) {alert('Gagal memperbarui izin promo: ' + friendlyError(err));} });
         }
         $('customerPageSize').onchange = () => {customerPageSize = Number($('customerPageSize').value) || 10; customerCurrentPage = 1; renderCustomers();};
         $('customerSearch').addEventListener('input', () => {customerCurrentPage = 1; renderCustomers();});
         $('refreshCustomersBtn').onclick = async () => {try {const snap = await getDocs(collection(db, 'customers')); customers = snap.docs.map(d => ({id: d.id, ...d.data()})); customerCurrentPage = 1; renderCustomers(); renderBlastDrafts();} catch (err) {alert('Gagal memuat data konsumen: ' + friendlyError(err));} };
         $('blastForm').onsubmit = async e => {e.preventDefault(); const title = $('blastTitle').value.trim(), body = $('blastMessage').value.trim(); if (!title || !body) {message('blastSaveMessage', 'Judul dan isi promo wajib diisi.', 'danger'); return;} try {await addDoc(collection(db, 'promoBlasts'), {title, body, createdBy: currentUser.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp()}); $('blastForm').reset(); message('blastSaveMessage', 'Draft promo berhasil disimpan.', 'success'); const snap = await getDocs(query(collection(db, 'promoBlasts'), orderBy('createdAt', 'desc'))); blastDrafts = snap.docs.map(d => ({id: d.id, ...d.data()})); renderBlastDrafts();} catch (err) {message('blastSaveMessage', 'Gagal menyimpan draft: ' + friendlyError(err), 'danger');} };
         function renderBlastDrafts() {const el = $('blastDraftList'); if (!el) return; el.innerHTML = blastDrafts.length ? blastDrafts.map(d => `<div class="promo-chip blast-draft"><div><b>${escapeHtml(d.title)}</b><small>${escapeHtml((d.body || '').slice(0, 95))}${(d.body || '').length > 95 ? '…' : ''}</small></div><button class="btn btn-gold" type="button" data-select-blast="${escapeHtml(d.id)}">Pilih Draft</button></div>`).join('') : '<span class="muted">Belum ada draft promo.</span>'; el.querySelectorAll('[data-select-blast]').forEach(b => b.onclick = () => prepareBlast(b.dataset.selectBlast));}
         function prepareBlast(id) {activeBlastDraft = blastDrafts.find(d => d.id === id); if (!activeBlastDraft) return; activeBlastRecipients = customers.filter(c => c.promoConsent === true && normalizePhone(c.phone || c.id).length >= 8).sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'id')); activeBlastIndex = 0; $('blastSelectedInfo').textContent = `Draft: ${activeBlastDraft.title}. ${activeBlastRecipients.length} konsumen memiliki izin menerima promo WhatsApp. Pengiriman dilakukan satu per satu; tekan tombol Buka WhatsApp lalu kirim dari aplikasi WhatsApp.`; renderBlastQueue();}
         function renderBlastQueue() {const el = $('blastQueue'); if (!activeBlastDraft) {el.innerHTML = '<div class="empty">Belum ada pengiriman yang disiapkan.</div>'; return;} if (!activeBlastRecipients.length) {el.innerHTML = '<div class="empty">Belum ada penerima yang menyetujui promo WhatsApp. Minta persetujuan pelanggan terlebih dahulu melalui Data Konsumen.</div>'; return;} if (activeBlastIndex >= activeBlastRecipients.length) {el.innerHTML = `<div class="notice">Daftar selesai dibuka. Pastikan pesan sudah benar-benar dikirim di WhatsApp untuk setiap penerima.</div><button class="btn btn-light" id="restartBlastBtn" type="button">Ulangi dari awal</button>`; $('restartBlastBtn').onclick = () => {activeBlastIndex = 0; renderBlastQueue();}; return;} const c = activeBlastRecipients[activeBlastIndex], phone = normalizePhone(c.phone || c.id), waPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone; const body = String(activeBlastDraft.body || '').replaceAll('{nama}', c.name || 'Pelanggan'); const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(body)}`; el.innerHTML = `<div class="blast-recipient"><div class="blast-progress">PENERIMA ${activeBlastIndex + 1} DARI ${activeBlastRecipients.length}</div><h3>${escapeHtml(c.name || 'Konsumen')}</h3><p>${escapeHtml(c.phone || c.id)}</p><p class="blast-message-preview">${escapeHtml(body)}</p><div class="actions"><button class="btn btn-primary" id="openWhatsAppBtn" type="button">Buka WhatsApp & Kirim</button><button class="btn btn-gold" id="nextBlastBtn" type="button">Berikutnya →</button></div><p class="customer-hint">Setelah WhatsApp terbuka, periksa pesan dan tekan Kirim di WhatsApp. Tombol Berikutnya hanya berpindah ke penerima selanjutnya.</p></div>`; $('openWhatsAppBtn').onclick = () => window.open(url, '_blank', 'noopener'); $('nextBlastBtn').onclick = () => {activeBlastIndex++; renderBlastQueue();};}

         function formatDate(ts) {try {return ts?.toDate ? ts.toDate().toLocaleString('id-ID') : new Date().toLocaleString('id-ID')} catch {return '-'} }
         function formatCorrectionDate(ts) {try {const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date(ts)); if (!d || Number.isNaN(d.getTime())) return '-'; const date = new Intl.DateTimeFormat('id-ID', {day: 'numeric', month: 'numeric', year: 'numeric'}).format(d); const time = [d.getHours(), d.getMinutes(), d.getSeconds()].map(v => String(v).padStart(2, '0')).join('.'); return `${date}, ${time}`;} catch {return '-';} }
         // ACCOUNTING: laporan dibentuk dari data yang memang sudah dicatat di aplikasi.
         const accountingReportMeta = {
            reportProductionFG: {title: 'Laporan Produksi FG', columns: ['Tanggal Produksi', 'Kode Produk', 'Nama Produk', 'Qty Produksi', 'HPP Total'], rows: () => productionRecords.map(x => [x.productionDate || '-', x.productCode || '-', x.productName || '-', Number(x.qty) || 0, Number(x.hppTotal) || 0])},
            reportShipment: {title: 'Laporan Stock Finish Good dan Pengiriman', columns: ['Periode', 'Kode Produk', 'Nama Produk', 'Qty FG', 'Qty Dikirim', 'Sisa FG'], rows: () => finishGoodRecords.map(x => [x.period || '-', x.productCode || '-', x.productName || '-', Number(x.qtyFG) || 0, Number(x.qtyKirim) || 0, Number(x.stock ?? (Number(x.qtyFG || 0) - Number(x.qtyKirim || 0)))])},
            reportSales: {
               title: 'Laporan Sales Penjualan', columns: ['Tanggal', 'Sumber', 'Kode / Store', 'Nama / Keterangan', 'Qty', 'Nilai Penjualan'], rows: () => [
                  ...salesRecords.map(x => [x.salesDate || '-', 'Marketing', x.storeCode || '-', x.storeName || '-', '-', Number(x.salesValue) || 0]),
                  ...transactions.filter(x => ['PAID', 'PAID CASH', 'PAID QRIS'].includes(String(x.status || '').toUpperCase())).map(x => [transactionDateKey(x) || '-', 'Kasir', x.invoiceNo || x.id || '-', (Array.isArray(x.items) ? x.items.map(i => i.name).join(', ') : 'Transaksi Kasir'), (Array.isArray(x.items) ? x.items.reduce((n, i) => n + (Number(i.qty) || 0), 0) : '-'), Number(x.total) || 0])
               ]
            },
            reportCosts: {title: 'Laporan Cost Overhead', columns: ['Tanggal', 'Kode Biaya', 'Nama Biaya', 'Nilai Biaya'], rows: () => costOverheadExpenses.map(x => [x.postingDate || '-', x.code || '-', x.name || '-', Number(x.value) || 0])},
            reportCOGS: {title: 'Laporan COGS Produksi', columns: ['Tanggal Produksi', 'Kode Produk', 'Nama Produk', 'Qty Produksi'], rows: () => []},
            reportStockFG: {title: 'Print Semua Laporan', columns: ['Periode', 'Kode Produk', 'Nama Produk', 'Qty Produksi FG', 'Qty Dikirim', 'Stock FG'], rows: () => finishGoodRecords.map(x => [x.period || '-', x.productCode || '-', x.productName || '-', Number(x.qtyFG) || 0, Number(x.qtyKirim) || 0, Number(x.stock ?? (Number(x.qtyFG || 0) - Number(x.qtyKirim || 0)))])},
            reportStockRM: {title: 'Laporan Stock Bahan Baku', columns: ['Kode', 'Nama Bahan Baku', 'UOM', 'Weight (Master)', 'Purchase Price', 'Average', 'Qty Pembelian', 'Qty Pemakaian', 'Qty Stock', 'Value'], rows: () => accountingStockMaterialRows()},
            reportProfitLoss: {
               title: 'Laporan Laba/Rugi', columns: ['Komponen', 'Keterangan', 'Nilai'], rows: () => {
                  const paid = transactions.filter(t => ['PAID', 'PAID CASH', 'PAID QRIS'].includes(String(t.status || '').toUpperCase()));
                  const sales = paid.reduce((n, t) => n + (Number(t.total) || 0), 0) + salesRecords.reduce((n, x) => n + (Number(x.salesValue) || 0), 0);
                  const cogs = productionRecords.reduce((n, x) => n + (Number(x.hppTotal) || 0), 0);
                  const waste = wasteMaterialRecords.reduce((n, x) => n + (Number(x.totalValue) || 0), 0) + wasteProductRecords.reduce((n, x) => n + (Number(x.totalHpp) || 0), 0); const overhead = costOverheadExpenses.reduce((n, x) => n + (Number(x.value) || 0), 0);
                  return [['Pendapatan', 'Transaksi kasir lunas + Input Sales Marketing', sales], ['HPP Produksi', 'Total HPP dari catatan produksi', cogs], ['Waste', 'Waste bahan baku dan produk', waste], ['Cost Overhead', 'Total biaya overhead', overhead], ['Estimasi Laba/Rugi', 'Pendapatan - HPP Produksi - Waste - Cost Overhead', sales - cogs - waste - overhead]];
               }
            }
         };
         function accountingDateInRange(value, start, end) {let d = String(value || '').slice(0, 10); if (/^\d{4}-\d{2}$/.test(d)) d = d + '-01'; return (!start || d >= start) && (!end || d <= end);}
         function accountingStockMaterialRows() {
            const section = $('reportStockRM');
            const printPeriod = accountingPrintPeriodOverride;
            const start = printPeriod ? `${printPeriod.year}-${printPeriod.month}-01` : (section?.querySelector('[data-report-start]')?.value || '');
            const end = printPeriod ? `${printPeriod.year}-${printPeriod.month}-${new Date(Number(printPeriod.year), Number(printPeriod.month), 0).getDate()}` : (section?.querySelector('[data-report-end]')?.value || '');
            const filtered = Boolean(start || end);
            if (!filtered) return getStockBahanBakuRows().map(x => {const m = rawMaterials.find(v => (v.code || v.id) === x.code) || rawMaterials.find(v => v.name === x.name); return [x.code, x.name, x.uom, Number(m?.weight) || 0, Number(m?.purchasePrice) || 0, x.average, x.qtyPO, x.qtyProduction, x.qtyStock, x.value];});
            const rows = rawMaterials.map(m => {
               const u = uoms.find(v => v.id === m.uomId), keys = [m.id, m.code, m.name].filter(Boolean).map(String); let qtyPurchase = 0, qtyUsage = 0;
               purchaseOrderRecords.filter(po => accountingDateInRange(po.purchaseDate || po.date, start, end)).forEach(po => {const refs = [po.materialId, po.materialCode, po.materialName].filter(Boolean).map(String); if (refs.some(k => keys.includes(k))) qtyPurchase += Number(po.qty) || 0;});
               productionRecords.filter(rec => accountingDateInRange(rec.productionDate, start, end)).forEach(rec => (rec.items || []).forEach(item => {const refs = [item.materialId, item.code, item.name].filter(Boolean).map(String); if (refs.some(k => keys.includes(k))) qtyUsage += Number(item.totalWeight ?? (Number(item.weight || 0) * Number(rec.qty || 0))) || 0;}));
               const average = Number(m.average) || 0, qtyStock = qtyPurchase - qtyUsage; return [m.code || m.id, m.name || '-', u?.name || m.uomName || '-', Number(m.weight) || 0, Number(m.purchasePrice) || 0, average, qtyPurchase, qtyUsage, qtyStock, average * qtyStock];
            }); return rows;
         }
         function cogsSelectedPeriod() {const month = $('cogsMonth')?.value || String(new Date().getMonth() + 1).padStart(2, '0'); const year = $('cogsYear')?.value || String(new Date().getFullYear()); return {period: `${year}-${month}`};}
         function accountingCOGSData() {
            const {period} = cogsSelectedPeriod();
            const productions = productionRecords.filter(x => String(x.productionDate || '').slice(0, 7) === period);
            const fgRows = productions.map(x => [x.productionDate || '-', x.productCode || '-', x.productName || '-', Number(x.qty) || 0]);
            const usedByMaterial = new Map();
            // Hitung kebutuhan bahan per produk: pemakaian per pcs x qty produksi produk tersebut.
            // Setelah itu jumlahkan hasil semua produk berdasarkan bahan baku yang sama.
            productions.forEach(rec => {
               const productionQty = Math.max(0, Number(rec.qty) || 0);
               (Array.isArray(rec.items) ? rec.items : []).forEach(item => {
                  const aliases = [item.materialId, item.id, item.code, item.materialCode, item.name, item.materialName].filter(Boolean).map(v => String(v).trim());
                  const master = rawMaterials.find(m => aliases.includes(String(m.id || '')) || aliases.includes(String(m.code || '')) || aliases.includes(String(m.name || '')));
                  const key = String(master?.id || master?.code || aliases[0] || '');
                  if (!key) return;
                  const perPiece = Number(item.weight);
                  // Untuk catatan lama yang tidak menyimpan weight per pcs, gunakan totalWeight / qty produksi.
                  const unitUsage = Number.isFinite(perPiece) && perPiece > 0 ? perPiece : (productionQty > 0 ? (Number(item.totalWeight) || 0) / productionQty : 0);
                  const totalUsage = unitUsage * productionQty;
                  usedByMaterial.set(key, (usedByMaterial.get(key) || 0) + totalUsage);
               });
            });
            const stockRows = getStockBahanBakuRows();
            const materialRows = stockRows.map(x => {
               const m = rawMaterials.find(v => (v.code || v.id) === x.code) || rawMaterials.find(v => v.name === x.name);
               const key = String(m?.id || m?.code || x.code || '');
               const qty = usedByMaterial.get(key) || 0;
               const avg = Number(x.average) || 0;
               return [x.code, x.name, x.uom, Number(m?.weight) || 0, avg, qty, qty * avg];
            }).filter(r => r[5] > 0);
            const totalValue = materialRows.reduce((n, r) => n + (Number(r[6]) || 0), 0);
            const variableCost = totalValue * 0.01;
            return {fgRows, materialRows, period, totalValue, variableCost, totalUsageValue: totalValue + variableCost};
         }
         function accountingFormatCell(v, idx, reportId) {if (typeof v === 'number') {const moneyCols = {reportSales: [5], reportCosts: [3], reportCOGS: [4, 5, 6], reportProfitLoss: [2], reportStockRM: [4, 5, 9], reportProductionFG: [4]}; return (moneyCols[reportId] || []).includes(idx) ? rupiah(v) : new Intl.NumberFormat('id-ID').format(v);} return escapeHtml(String(v ?? '-'));}
         let accountingPrintPeriodOverride = null;
         function accountingSelectedPeriod(id) {
            if (id === 'reportProfitLoss' && accountingPrintPeriodOverride) return accountingPrintPeriodOverride;
            if (id === 'reportProfitLoss') {
               if (accountingPrintPeriodOverride) return accountingPrintPeriodOverride;
               const section = $(id), start = section?.querySelector('[data-report-start]')?.value || '', end = section?.querySelector('[data-report-end]')?.value || '';
               return {month: null, year: null, period: start || end ? `${start || 'Awal'} – ${end || 'Sekarang'}` : 'Semua Periode'};
            }
            const section = $(id);
            const month = section?.querySelector('[data-report-month]')?.value || String(new Date().getMonth() + 1).padStart(2, '0');
            const year = section?.querySelector('[data-report-year]')?.value || String(Math.min(2035, Math.max(2026, new Date().getFullYear())));
            return {month, year, period: `${year}-${month}`};
         }
         function accountingValueInPeriod(value, period) {return String(value || '').trim().slice(0, 7) === period;}
         function accountingRowsFor(id) {
            const meta = accountingReportMeta[id]; if (!meta) return [];
            if (id === 'reportStockRM') return meta.rows();
            const {period} = accountingSelectedPeriod(id);
            if (id === 'reportProfitLoss') {
               const section = $(id), start = section?.querySelector('[data-report-start]')?.value || '', end = section?.querySelector('[data-report-end]')?.value || '';
               const inPeriod = value => accountingPrintPeriodOverride ? accountingValueInPeriod(value, period) : accountingDateInRange(value, start, end);
               const paid = transactions.filter(t => ['PAID', 'PAID CASH', 'PAID QRIS'].includes(String(t.status || '').toUpperCase()) && inPeriod(transactionDateKey(t)));
               const sales = paid.reduce((n, t) => n + (Number(t.total) || 0), 0) + salesRecords.filter(x => inPeriod(x.salesDate)).reduce((n, x) => n + (Number(x.salesValue) || 0), 0);
               const cogs = productionRecords.filter(x => inPeriod(x.productionDate)).reduce((n, x) => n + (Number(x.hppTotal) || 0), 0);
               const waste = wasteMaterialRecords.filter(x => inPeriod(x.wasteDate)).reduce((n, x) => n + (Number(x.totalValue) || 0), 0) + wasteProductRecords.filter(x => inPeriod(x.wasteDate)).reduce((n, x) => n + (Number(x.totalHpp) || 0), 0);
               const overhead = costOverheadExpenses.filter(x => inPeriod(x.postingDate)).reduce((n, x) => n + (Number(x.value) || 0), 0);
               return [['Pendapatan', 'Transaksi kasir lunas + Input Sales Marketing', sales], ['HPP Produksi', 'Total HPP dari catatan produksi', cogs], ['Waste', 'Waste bahan baku dan produk', waste], ['Cost Overhead', 'Total biaya overhead', overhead], ['Estimasi Laba/Rugi', 'Pendapatan - HPP Produksi - Waste - Cost Overhead', sales - cogs - waste - overhead]];
            }
            return meta.rows().filter(r => accountingValueInPeriod(r[0], period));
         }

         let accountingSalesPage = 1;
         function renderAccountingReport(id) {
            const meta = accountingReportMeta[id], section = $(id); if (!meta || !section) return; const body = section.querySelector('[data-report-body]');
            if (id === 'reportCOGS') {
               const {fgRows, materialRows, period, totalValue, variableCost, totalUsageValue} = accountingCOGSData();
               const makeTable = (title, cols, rows) => `<h4 class="accounting-subtitle">${title}</h4><div class="table-wrap"><table><thead><tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(r => `<tr>${r.map((v, i) => `<td>${typeof v === 'number' ? ([4, 6].includes(i) ? rupiah(v) : new Intl.NumberFormat('id-ID').format(v)) : escapeHtml(String(v ?? '-'))}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${cols.length}" class="empty">Belum ada data untuk periode ini.</td></tr>`}</tbody></table></div>`;
               const summary = `<div class="accounting-summary"><div><span>Periode</span><strong>${period}</strong></div><div><span>Qty Produksi FG</span><strong>${new Intl.NumberFormat('id-ID').format(fgRows.reduce((n, r) => n + (Number(r[3]) || 0), 0))}</strong></div><div><span>Jenis Bahan Terpakai</span><strong>${materialRows.length}</strong></div><div><span>Total Value Pemakaian</span><strong>${rupiah(totalUsageValue)}</strong></div></div>`;
               const totals = `<div class="accounting-cogs-totals"><div><span>Total Value</span><strong>${rupiah(totalValue)}</strong></div><div><span>Variable Cost 1%</span><strong>${rupiah(variableCost)}</strong></div><div class="grand-total"><span>Total Value Pemakaian Bahan Baku</span><strong>${rupiah(totalUsageValue)}</strong></div></div>`;
               body.innerHTML = summary + makeTable('Summary Produksi FG', ['Tanggal Produksi', 'Kode Produk', 'Nama Produk', 'Qty Produksi'], fgRows) + makeTable('Summary Pemakaian Bahan Baku Produksi', ['Kode Bahan Baku', 'Nama Bahan Baku', 'UOM', 'Weight', 'Average', 'Qty Pemakaian', 'Value'], materialRows) + totals;
               return;
            }
            const rows = accountingRowsFor(id), moneyReports = ['reportSales', 'reportCosts', 'reportCOGS', 'reportProductionFG', 'reportProfitLoss']; let sum = 0;
            if (id === 'reportSales') sum = rows.reduce((n, r) => n + (Number(r[5]) || 0), 0); else if (id === 'reportCosts') sum = rows.reduce((n, r) => n + (Number(r[3]) || 0), 0); else if (id === 'reportProductionFG') sum = rows.reduce((n, r) => n + (Number(r[4]) || 0), 0); else if (id === 'reportProfitLoss') sum = Number(rows.at(-1)?.[2]) || 0;
            const salesPageSize = id === 'reportSales' ? Math.max(10, Number($('reportSalesPageSize')?.value) || 10) : rows.length || 10;
            const salesPageCount = id === 'reportSales' ? Math.max(1, Math.ceil(rows.length / salesPageSize)) : 1;
            if (id === 'reportSales') accountingSalesPage = Math.min(Math.max(1, accountingSalesPage), salesPageCount);
            const visibleRows = id === 'reportSales' ? rows.slice((accountingSalesPage - 1) * salesPageSize, accountingSalesPage * salesPageSize) : rows;
            const table = `<div class="table-wrap"><table><thead><tr>${meta.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${visibleRows.length ? visibleRows.map(r => `<tr>${r.map((v, i) => `<td>${accountingFormatCell(v, i, id)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${meta.columns.length}" class="empty">Belum ada data untuk laporan ini.</td></tr>`}</tbody></table></div>`;
            const stockValue = id === 'reportStockRM' ? rows.reduce((n, r) => n + (Number(r[9]) || 0), 0) : 0;
            const selectedPeriod = accountingSelectedPeriod(id).period;
            const summary = id === 'reportStockRM' ? `<div class="accounting-summary"><div><span>Jumlah Baris</span><strong>${rows.length}</strong></div><div><span>Jenis Laporan</span><strong>Posisi Stock Saat Ini</strong></div><div><span>Tanggal</span><strong>${new Date().toLocaleDateString('id-ID')}</strong></div><div><span>Total Stock Value</span><strong>${rupiah(stockValue)}</strong></div></div>` : moneyReports.includes(id) ? `<div class="accounting-summary"><div><span>Periode</span><strong>${selectedPeriod}</strong></div><div><span>${id === 'reportProfitLoss' ? 'Estimasi Laba/Rugi' : 'Total Nilai'}</span><strong>${rupiah(sum)}</strong></div><div><span>Jumlah Baris</span><strong>${rows.length}</strong></div></div>` : `<div class="accounting-summary"><div><span>Periode</span><strong>${selectedPeriod}</strong></div><div><span>Jumlah Baris</span><strong>${rows.length}</strong></div><div><span>Tanggal</span><strong>${new Date().toLocaleDateString('id-ID')}</strong></div></div>`;
            const salesPager = id === 'reportSales' ? `<div class="actions" style="justify-content:space-between;align-items:center;margin-top:12px"><span class="muted" style="font-size:12px">Menampilkan ${rows.length ? ((accountingSalesPage - 1) * salesPageSize + 1) : 0}–${Math.min(accountingSalesPage * salesPageSize, rows.length)} dari ${rows.length} data</span><div class="actions"><button type="button" class="btn btn-light" data-sales-report-prev ${accountingSalesPage <= 1 ? 'disabled' : ''}>Sebelumnya</button><span class="muted" style="align-self:center;font-size:12px">Halaman ${accountingSalesPage} / ${salesPageCount}</span><button type="button" class="btn btn-light" data-sales-report-next ${accountingSalesPage >= salesPageCount ? 'disabled' : ''}>Berikutnya</button></div></div>` : '';
            body.innerHTML = summary + table + salesPager;
            if (id === 'reportSales') {
               body.querySelector('[data-sales-report-prev]')?.addEventListener('click', () => {accountingSalesPage = Math.max(1, accountingSalesPage - 1); renderAccountingReport('reportSales');});
               body.querySelector('[data-sales-report-next]')?.addEventListener('click', () => {accountingSalesPage = Math.min(salesPageCount, accountingSalesPage + 1); renderAccountingReport('reportSales');});
            }
         }
         $('reportSalesPageSize')?.addEventListener('change', () => {accountingSalesPage = 1; renderAccountingReport('reportSales');});
         function openAccountingReport(id) {document.querySelectorAll('.page').forEach(x => x.classList.remove('active')); $(id)?.classList.add('active'); document.querySelectorAll('.nav button[data-page]').forEach(x => x.classList.toggle('active', x.dataset.page === 'accounting')); $('pageTitle').textContent = accountingReportMeta[id]?.title || 'Accounting'; renderAccountingReport(id); $('sidebar').classList.remove('open');}
         document.querySelectorAll('[data-report-page]').forEach(b => b.addEventListener('click', () => openAccountingReport(b.dataset.reportPage)));
         document.querySelectorAll('[data-accounting-home]').forEach(b => b.addEventListener('click', () => {document.querySelectorAll('.page').forEach(x => x.classList.remove('active')); $('accounting').classList.add('active'); $('pageTitle').textContent = 'Accounting'; document.querySelectorAll('.nav button[data-page]').forEach(x => x.classList.toggle('active', x.dataset.page === 'accounting'));}));
         const accountingNow = new Date(), accountingDefaultMonth = String(accountingNow.getMonth() + 1).padStart(2, '0'), accountingDefaultYear = String(Math.min(2035, Math.max(2026, accountingNow.getFullYear())));
         document.querySelectorAll('.accounting-report-page').forEach(section => {
            const monthSelect = section.querySelector('[data-report-month]'), yearSelect = section.querySelector('[data-report-year]');
            if (monthSelect) monthSelect.value = accountingDefaultMonth; if (yearSelect) yearSelect.value = accountingDefaultYear;
            section.querySelector('[data-refresh-report]')?.addEventListener('click', () => renderAccountingReport(section.id));
            section.querySelector('[data-report-start]')?.addEventListener('change', () => renderAccountingReport(section.id));
            section.querySelector('[data-report-end]')?.addEventListener('change', () => renderAccountingReport(section.id));
            monthSelect?.addEventListener('change', () => {if (section.id === 'reportSales') accountingSalesPage = 1; renderAccountingReport(section.id);});
            yearSelect?.addEventListener('change', () => {if (section.id === 'reportSales') accountingSalesPage = 1; renderAccountingReport(section.id);});
         });
         if ($('printAllMonth')) $('printAllMonth').value = accountingDefaultMonth; if ($('printAllYear')) $('printAllYear').value = accountingDefaultYear;
         if ($('cogsMonth')) $('cogsMonth').value = accountingDefaultMonth; if ($('cogsYear')) $('cogsYear').value = accountingDefaultYear; $('cogsMonth')?.addEventListener('change', () => renderAccountingReport('reportCOGS')); $('cogsYear')?.addEventListener('change', () => renderAccountingReport('reportCOGS'));
         function printAccountingReport(id) {
            const meta = accountingReportMeta[id]; if (!meta) return;
            if (id === 'reportCOGS') {
               const {fgRows, materialRows, period, totalValue, variableCost, totalUsageValue} = accountingCOGSData();
               const w = window.open('', '_blank'); if (!w) {alert('Izinkan pop-up browser untuk mencetak laporan.'); return;}
               const tbl = (title, cols, rows) => `<h3>${title}</h3><table><thead><tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(r => `<tr>${r.map((v, i) => `<td>${typeof v === 'number' ? ([4, 6].includes(i) ? rupiah(v) : new Intl.NumberFormat('id-ID').format(v)) : escapeHtml(String(v ?? '-'))}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${cols.length}">Tidak ada data</td></tr>`}</tbody></table>`;
               const totals = `<div class="totals"><p><span>Total Value</span><b>${rupiah(totalValue)}</b></p><p><span>Variable Cost 1%</span><b>${rupiah(variableCost)}</b></p><p class="grand"><span>Total Value Pemakaian Bahan Baku</span><b>${rupiah(totalUsageValue)}</b></p></div>`;
               w.document.write(`<!doctype html><html><head><title>${escapeHtml(meta.title)}</title><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;padding:24px;color:#222}h1,h2,p{text-align:center}h3{margin-top:26px}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #aaa;padding:7px;text-align:left;font-size:10px}th{background:#eee}.totals{max-width:420px;margin:24px 0 0 auto}.totals p{display:flex;justify-content:space-between;text-align:left;border-bottom:1px solid #ddd;padding:7px;margin:0}.totals .grand{font-weight:bold;border-top:2px solid #333;font-size:14px}</style></head><body><h1>ROTI ANGET SUBUH</h1><h2>${escapeHtml(meta.title)}</h2><p>Periode: ${period}</p>${tbl('Summary Produksi FG', ['Tanggal Produksi', 'Kode Produk', 'Nama Produk', 'Qty Produksi'], fgRows)}${tbl('Summary Pemakaian Bahan Baku Produksi', ['Kode Bahan Baku', 'Nama Bahan Baku', 'UOM', 'Weight', 'Average', 'Qty Pemakaian', 'Value'], materialRows)}${totals}<script>window.onload=()=>window.print()<\/script></body></html>`);
               w.document.close(); return;
            }
            const rows = accountingRowsFor(id), section = $(id);
            const start = section.querySelector('[data-report-start]')?.value || '';
            const end = section.querySelector('[data-report-end]')?.value || '';
            const reportPeriod = ['reportProductionFG', 'reportShipment', 'reportSales', 'reportCosts'].includes(id) ? accountingSelectedPeriod(id).period : (id === 'reportProfitLoss' ? 'Semua Periode' : `${start || 'Semua'} s/d ${end || 'Semua'}`);
            const table = `<table><thead><tr>${meta.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((v, i) => `<td>${accountingFormatCell(v, i, id)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
            const stockSummary = id === 'reportStockRM' ? `<p><strong>Jumlah Baris:</strong> ${rows.length} &nbsp; | &nbsp; <strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID')} &nbsp; | &nbsp; <strong>Total Stock Value:</strong> ${rupiah(rows.reduce((n, r) => n + (Number(r[9]) || 0), 0))}</p>` : '';
            const w = window.open('', '_blank'); if (!w) {alert('Izinkan pop-up browser untuk mencetak laporan.'); return;}
            w.document.write(`<!doctype html><html><head><title>${escapeHtml(meta.title)}</title><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;padding:24px;color:#222}h1,h2,p{text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #aaa;padding:8px;text-align:left;font-size:11px}th{background:#eee}@media print{button{display:none}}</style></head><body><h1>ROTI ANGET SUBUH</h1><h2>${escapeHtml(meta.title)}</h2><p>Periode: ${reportPeriod}</p>${stockSummary}${table}<script>window.onload=()=>{window.focus();window.print();};<\/script></body></html>`);
            w.document.close();
         }

         function printAllAccountingReports() {
            const month = $('printAllMonth')?.value || accountingDefaultMonth, year = $('printAllYear')?.value || accountingDefaultYear, period = `${year}-${month}`;
            ['reportProductionFG', 'reportShipment', 'reportSales', 'reportCosts'].forEach(id => {const sec = $(id); if (sec?.querySelector('[data-report-month]')) sec.querySelector('[data-report-month]').value = month; if (sec?.querySelector('[data-report-year]')) sec.querySelector('[data-report-year]').value = year;});
            if ($('cogsMonth')) $('cogsMonth').value = month; if ($('cogsYear')) $('cogsYear').value = year;
            const ids = ['reportProductionFG', 'reportShipment', 'reportSales', 'reportCosts', 'reportCOGS', 'reportStockRM', 'reportProfitLoss'];
            accountingPrintPeriodOverride = {month, year, period};
            const tbl = (title, cols, rows, id) => `<h3>${escapeHtml(title)}</h3><table><thead><tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(r => `<tr>${r.map((v, i) => `<td>${accountingFormatCell(v, i, id)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${cols.length}">Tidak ada data untuk periode ini.</td></tr>`}</tbody></table>`;
            const blocks = [];
            for (const id of ids) {
               const meta = accountingReportMeta[id];
               if (id === 'reportCOGS') {
                  const d = accountingCOGSData();
                  const simple = (title, cols, rows) => `<h3>${escapeHtml(title)}</h3><table><thead><tr>${cols.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(r => `<tr>${r.map((v, i) => `<td>${typeof v === 'number' ? ([4, 6].includes(i) ? rupiah(v) : new Intl.NumberFormat('id-ID').format(v)) : escapeHtml(String(v ?? '-'))}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${cols.length}">Tidak ada data</td></tr>`}</tbody></table>`;
                  blocks.push(`<h2>${escapeHtml(meta.title)}</h2><p>Periode: ${period}</p>` + simple('Summary Produksi FG', ['Tanggal Produksi', 'Kode Produk', 'Nama Produk', 'Qty Produksi'], d.fgRows) + simple('Summary Pemakaian Bahan Baku Produksi', ['Kode Bahan Baku', 'Nama Bahan Baku', 'UOM', 'Weight', 'Average', 'Qty Pemakaian', 'Value'], d.materialRows) + `<p class="total">Total Value: ${rupiah(d.totalValue)} | Variable Cost 1%: ${rupiah(d.variableCost)} | Total Value Pemakaian Bahan Baku: ${rupiah(d.totalUsageValue)}</p>`);
                  continue;
               }
               const rows = accountingRowsFor(id);
               blocks.push(`<h2>${escapeHtml(meta.title)}</h2><p>Periode: ${period}</p>` + tbl(meta.title, meta.columns, rows, id));
            }
            accountingPrintPeriodOverride = null;
            const w = window.open('', '_blank'); if (!w) {alert('Izinkan pop-up browser untuk mencetak laporan.'); return;}
            w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Semua Laporan Accounting ${period}</title><style>body{font-family:Arial,sans-serif;padding:22px;color:#222}h1{text-align:center}h2{margin:30px 0 6px;border-top:2px solid #333;padding-top:18px}p{text-align:center;margin:5px 0 12px}h3{margin:16px 0 8px}table{width:100%;border-collapse:collapse;margin:8px 0 18px}th,td{border:1px solid #aaa;padding:6px;text-align:left;font-size:10px}th{background:#eee}.total{text-align:right;font-weight:bold}@media print{h2{break-before:page}h2:first-of-type{break-before:auto}}</style></head><body><h1>ROTI ANGET SUBUH<br>SEMUA LAPORAN ACCOUNTING</h1><p>Periode: ${period}</p>${blocks.join('')}<script>window.onload=()=>{window.focus();window.print();};<\/script></body></html>`); w.document.close();
         }
         $('printAllAccountingReports')?.addEventListener('click', printAllAccountingReports);

         document.addEventListener('click', event => {const target = event.target; if (!(target instanceof Element)) return; const button = target.closest('[data-print-report]'); if (!button) return; const section = button.closest('.accounting-report-page'); if (section) printAccountingReport(section.id);});

         function renderDashboard() {
            const paid = transactions.filter(t => ['PAID', 'PAID CASH', 'PAID QRIS'].includes(String(t.status || '').toUpperCase()));
            const day = today(), daily = paid.filter(t => transactionDateKey(t) === day);
            $('statSales').textContent = rupiah(daily.reduce((sum, t) => sum + (Number(t.total) || 0), 0));
            $('statOrders').textContent = daily.length; $('statProducts').textContent = products.length;
            $('statStock').textContent = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0) + ' pcs';
            // Ranking produk hanya dari transaksi lunas pada bulan dan tahun berjalan.
            const now = new Date(), year = now.getFullYear(), month = now.getMonth(), monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const monthPaid = paid.filter(t => {const key = transactionDateKey(t); if (!key) return false; const parts = key.split('-').map(Number); return parts[0] === year && parts[1] === month + 1;});
            $('topProductsMonth').textContent = monthNames[month] + ' ' + year;
            const productTotals = new Map(); let totalUnits = 0;
            monthPaid.forEach(t => (Array.isArray(t.items) ? t.items : []).forEach(item => {
               const qty = Math.max(0, Number(item.qty) || 0); if (!qty) return;
               const key = String(item.id || item.productId || item.code || item.name || 'Produk');
               const current = productTotals.get(key) || {name: item.name || item.productName || 'Produk', qty: 0};
               current.qty += qty; totalUnits += qty; productTotals.set(key, current);
            }));
            const best = Array.from(productTotals.values()).sort((a, b) => b.qty - a.qty || a.name.localeCompare(b.name, 'id')).slice(0, 5);
            const topEl = $('topProductsChart');
            if (!best.length) topEl.innerHTML = '<div class="chart-empty">Belum ada penjualan roti lunas pada bulan ini.</div>';
            else {const maxQty = Math.max(...best.map(x => x.qty), 1); topEl.innerHTML = best.map((item, i) => {const share = totalUnits ? item.qty / totalUnits * 100 : 0; return `<div class="top-product-row ${i === 0 ? 'rank-first' : ''}"><div class="top-product-rank">${i === 0 ? '★' : String(i + 1).padStart(2, '0')}</div><div class="top-product-info"><div class="top-product-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div><div class="top-product-share">${share.toFixed(1).replace('.', ',')}% dari seluruh roti terjual</div></div><div class="top-product-track"><div class="top-product-fill" style="width:${Math.max(2, item.qty / maxQty * 100)}%"></div></div><div class="top-product-qty">${item.qty} pcs<small>${i === 0 ? 'Terlaris' : 'Terjual'}</small></div></div>`;}).join('');}
            // Kelompok mingguan kalender: tanggal 1-7, 8-14, 15-21, 22-28, dan 29-akhir bulan.
            $('salesChartMonth').textContent = monthNames[month] + ' ' + year;
            const weekLabels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'], weekTotals = [0, 0, 0, 0, 0];
            paid.forEach(t => {const key = transactionDateKey(t); if (!key) return; const parts = key.split('-').map(Number); if (parts[0] === year && parts[1] === month + 1) {const week = Math.min(4, Math.floor((parts[2] - 1) / 7)); weekTotals[week] += Number(t.total) || 0;} });
            const maxSales = Math.max(...weekTotals, 0), salesEl = $('monthlySalesChart');
            if (maxSales === 0) salesEl.innerHTML = '<div class="chart-empty">Belum ada transaksi lunas pada bulan ini.</div>';
            else salesEl.innerHTML = weekTotals.map((amount, i) => {const height = amount ? Math.max(3, amount / maxSales * 100) : 0; return `<div class="sales-week"><div class="sales-week-value">${amount ? rupiah(amount) : '—'}</div><div class="sales-week-track"><div class="sales-week-bar" style="height:${height}%"></div></div><div class="sales-week-label">${weekLabels[i]}</div></div>`;}).join('');
         }


         // HUB GRID UNTUK SEMUA MENU UTAMA: tombol kartu memanggil navigasi lama agar hak akses tetap berlaku.
         const moduleHubMap = {inputDataToggle: 'hubMasterData', purchasingToggle: 'hubPurchasing', productionToggle: 'hubProduction', marketingToggle: 'hubMarketing', cashierToggle: 'hubCashier', managementToggle: 'hubManagement'};
         Object.entries(moduleHubMap).forEach(([toggleId, hubId]) => {
            const toggle = $(toggleId); if (!toggle) return;
            toggle.addEventListener('click', event => {
               event.preventDefault(); event.stopImmediatePropagation();
               if (toggle.closest('.nav-group')?.classList.contains('admin-only') && !isAdminUser()) return;
               document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
               const hub = $(hubId); if (hub) hub.classList.add('active');
               document.querySelectorAll('.nav button[data-page]').forEach(button => button.classList.remove('active'));
               document.querySelectorAll('.nav-group').forEach(group => {group.classList.remove('expanded'); const t = group.querySelector('.nav-parent'); if (t) t.setAttribute('aria-expanded', 'false');});
               $('pageTitle').textContent = ({inputDataToggle: 'Master Data', purchasingToggle: 'Purchasing', productionToggle: 'Produksi', marketingToggle: 'Marketing', cashierToggle: 'Kasir', managementToggle: 'Management'})[toggleId] || 'Menu';
               $('sidebar').classList.remove('open');
            }, true);
         });
         // Navigasi grid: buka hanya halaman tujuan, tutup seluruh daftar submenu sidebar,
         // lalu sediakan tombol kembali ke hub menu utama (pola yang sama dengan Accounting).
         const hubTitles = {hubMasterData: 'Master Data', hubPurchasing: 'Purchasing', hubProduction: 'Produksi', hubMarketing: 'Marketing', hubCashier: 'Kasir', hubManagement: 'Management'};
         const targetToHub = {};
         Object.entries(moduleHubMap).forEach(([toggleId, hubId]) => {
            const hub = $(hubId); if (!hub) return;
            hub.querySelectorAll('[data-hub-target]').forEach(card => {targetToHub[card.dataset.hubTarget] = hubId;});
         });
         function closeSidebarSubmenus() {
            document.querySelectorAll('.nav-group').forEach(group => {
               group.classList.remove('expanded');
               const parent = group.querySelector('.nav-parent');
               if (parent) parent.setAttribute('aria-expanded', 'false');
            });
         }
         function showModuleHub(hubId) {
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            const hub = $(hubId); if (hub) hub.classList.add('active');
            document.querySelectorAll('.nav button[data-page]').forEach(button => button.classList.remove('active'));
            closeSidebarSubmenus();
            $('pageTitle').textContent = hubTitles[hubId] || 'Menu Utama';
            $('sidebar').classList.remove('open');
         }
         function addModuleBackButton(target, hubId) {
            const page = $(target); if (!page) return;
            let bar = page.querySelector('.module-detail-back');
            if (!bar) {
               bar = document.createElement('div'); bar.className = 'module-detail-back';
               const button = document.createElement('button'); button.type = 'button';
               button.addEventListener('click', () => showModuleHub(hubId));
               bar.append(button); page.prepend(bar);
            }
            const button = bar.querySelector('button');
            button.innerHTML = '<span class="back-arrow" aria-hidden="true">←</span><span class="back-title"></span>';
            button.querySelector('.back-title').textContent = hubTitles[hubId] || 'Menu Utama';
         }
         document.querySelectorAll('[data-hub-target]').forEach(card => card.addEventListener('click', () => {
            const target = card.dataset.hubTarget, hubId = card.closest('.page')?.id || targetToHub[target];
            const navButton = document.querySelector('.nav button[data-page="' + target + '"]');
            if (!navButton) return;
            // Gunakan navigasi asli agar pemeriksaan hak akses dan proses modul tetap berjalan.
            navButton.click();
            closeSidebarSubmenus();
            if (hubId) addModuleBackButton(target, hubId);
            $('sidebar').classList.remove('open');
         }));
