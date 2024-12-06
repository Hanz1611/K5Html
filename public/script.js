// Simulasi data pelanggan dan produk
const pelanggan = {
    id_pelanggan: '1',
    nama_pelanggan: 'John Doe',
    telepon_pelanggan: '08123456789'
};

const produkBeli = [
    { nama: "Produk A", jumlah: 2, subharga: 50000 },
    { nama: "Produk B", jumlah: 1, subharga: 100000 }
];

const ongkir = {
    nama_kota: 'Jakarta',
    tarif: 20000
};

// Mengirim data checkout ke server
document.getElementById('checkoutForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const alamat_pengirim = document.getElementById('shippingAddress').value;

    if (!alamat_pengirim) {
        alert('Alamat pengirim harus diisi');
        return;
    }

    const requestData = {
        pelanggan: pelanggan,
        produkBeli: produkBeli,
        ongkir: ongkir,
        alamat_pengirim: alamat_pengirim
    };

    fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Tampilkan pesan sukses dan redirect ke URL WhatsApp
        alert('Pembelian berhasil!');
        window.location.href = data.whatsappUrl;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat checkout');
    });
});
