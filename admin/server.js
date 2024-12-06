const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Simulasi database (ganti dengan database yang sesungguhnya)
let pembelianData = [];

// Endpoint untuk membuat pembelian baru (POST)
app.post('/api/checkout', (req, res) => {
    const { pelanggan, produkBeli, ongkir } = req.body;

    // Simulasi penambahan data pembelian
    const id_pembelian = `${Date.now()}`;  // Generate ID unik berdasarkan timestamp
    const total_pembelian = produkBeli.reduce((total, product) => total + product.subharga, 0) + ongkir.tarif;

    const pembelian = {
        id_pembelian,
        id_pelanggan: pelanggan.id_pelanggan,
        alamat_pengirim: req.body.alamat_pengirim,
        nama_kota: ongkir.nama_kota,
        tarif: ongkir.tarif,
        total_pembelian
    };

    // Simpan pembelian (contoh menggunakan array)
    pembelianData.push(pembelian);

    // Simulasi data pelanggan dan produk yang dibeli
    const message = generateWhatsAppMessage(pelanggan, pembelian, produkBeli);
    const whatsappUrl = `https://wa.me/+6281280760582?text=${encodeURIComponent(message)}`;

    res.json({
        message: 'Pembelian berhasil',
        whatsappUrl: whatsappUrl,
        pembelian: pembelian
    });
});

// Endpoint untuk mengambil detail pembelian
app.get('/api/pembelian/:id', (req, res) => {
    const id_pembelian = req.params.id;

    const pembelian = pembelianData.find(item => item.id_pembelian === id_pembelian);

    if (pembelian) {
        const pelanggan = getPelanggan(pembelian.id_pelanggan);
        const produkBeli = getProdukBeli(pembelian.id_pembelian);
        const message = generateWhatsAppMessage(pelanggan, pembelian, produkBeli);
        const whatsappUrl = `https://wa.me/+6281280760582?text=${encodeURIComponent(message)}`;

        res.json({
            message: message,
            whatsappUrl: whatsappUrl
        });
    } else {
        res.status(404).json({ error: 'Pembelian tidak ditemukan' });
    }
});

// Fungsi untuk membuat pesan WhatsApp
function generateWhatsAppMessage(pelanggan, pembelian, produkBeli) {
    let message = `Nota Pembelian Baru\n\n`;
    message += `Nama: ${pelanggan.nama_pelanggan}\n`;
    message += `Telepon: ${pelanggan.telepon_pelanggan}\n`;
    message += `Alamat: ${pembelian.alamat_pengirim}\n`;
    message += `Kota: ${pembelian.nama_kota} (Ongkir: Rp. ${pembelian.tarif.toLocaleString()})\n`;
    message += `Total Belanja: Rp. ${pembelian.total_pembelian.toLocaleString()}\n\n`;
    message += `Detail Pembelian:\n`;

    produkBeli.forEach(product => {
        message += `${product.nama} x${product.jumlah} = Rp. ${product.subharga.toLocaleString()}\n`;
    });

    return message;
}

// Simulasi data pelanggan
function getPelanggan(id_pelanggan) {
    // Simulasi data pelanggan (harusnya diambil dari database)
    return {
        id_pelanggan: '1',
        nama_pelanggan: 'John Doe',
        telepon_pelanggan: '08123456789'
    };
}

// Simulasi produk yang dibeli (harusnya diambil dari database atau keranjang)
function getProdukBeli(id_pembelian) {
    // Simulasi data produk yang dibeli
    return [
        { nama: "Produk A", jumlah: 2, subharga: 50000 },
        { nama: "Produk B", jumlah: 1, subharga: 100000 }
    ];
}

// Mulai server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
