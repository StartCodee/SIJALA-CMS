// Dummy data for Raja Ampat Conservation Fee Ticketing Admin Dashboard
export const SERVICE_RATE_VALIDITY_OPTIONS = [
  '30 hari',
  '60 hari',
  '90 hari',
  '120 hari',
  '150 hari',
  '180 hari',
  '210 hari',
  '240 hari',
  '270 hari',
  '300 hari',
  '330 hari',
  '365 hari',
];

export const DEFAULT_SERVICE_RATE_VALIDITY = SERVICE_RATE_VALIDITY_OPTIONS[11];

// Fee pricing constants
export const FEE_PRICING = {
  wisatawan_domestik_pbd: {
    label: 'Wisatawan Domestik (Papua Barat Daya)',
    price: 150000,
    needsApproval: false,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
  wisatawan_domestik_papua: {
    label: 'Wisatawan Domestik (Papua luar PBD)',
    price: 250000,
    needsApproval: false,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
  wisatawan_domestik_luar_papua: {
    label: 'Wisatawan Domestik',
    price: 500000,
    needsApproval: false,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
  wisatawan_mancanegara: {
    label: 'Wisatawan Mancanegara',
    price: 1000000,
    needsApproval: false,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
  peneliti_domestik: {
    label: 'Peneliti Domestik',
    price: 500000,
    needsApproval: true,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
  peneliti_mancanegara: {
    label: 'Peneliti Mancanegara',
    price: 1000000,
    needsApproval: true,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
  mooring: {
    label: 'Mooring',
    price: 75000000,
    needsApproval: true,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
  sport_fishing: {
    label: 'Sport Fishing',
    price: 2500000,
    needsApproval: true,
    validity: DEFAULT_SERVICE_RATE_VALIDITY,
  },
};

export const DOMISILI_LABELS = {
  pbd: 'Papua Barat Daya',
  papua_luar_pbd: 'Papua luar PBD',
  mancanegara: 'Mancanegara',
};

export const BOOKING_TYPE_LABELS = {
  perorangan: 'Perorangan',
  group: 'Grup',
};

export const GENDER_LABELS = {
  L: 'Laki-laki',
  P: 'Perempuan',
  U: 'Tidak diketahui',
};

export const OPERATOR_TYPE_LABELS = {
  loket: 'Loket',
  qris: 'QRIS',
  transfer: 'Transfer',
  doku: 'Doku',
};

export const REFUND_TYPE_LABELS = {
  full: 'Penuh',
  partial: 'Parsial',
};

export const ROLE_LABELS = {
  admin_utama: 'Admin Utama',
  admin_tiket: 'Admin Tiket',
  petugas_tiket: 'Petugas Tiket',
};

export const dummyPermissionMatrix = [
  { perm: 'Ringkasan', admin_utama: true, admin_tiket: true, petugas_tiket: true },
  { perm: 'Tiket', admin_utama: true, admin_tiket: true, petugas_tiket: true },
  { perm: 'Edit tiket', admin_utama: true, admin_tiket: true, petugas_tiket: true },
  { perm: 'Invoice', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Edit invoice', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Pembayaran', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Pengembalian Dana', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Antrian Persetujuan', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Approval Invoice', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Buat tiket', admin_utama: true, admin_tiket: true, petugas_tiket: true },
  { perm: 'Edit tiket', admin_utama: true, admin_tiket: true, petugas_tiket: true },
  { perm: 'Kirim tiket', admin_utama: true, admin_tiket: true, petugas_tiket: true },
  { perm: 'Laporan Keuangan', admin_utama: true, admin_tiket: false, petugas_tiket: false },
  { perm: 'Manajemen Pengguna', admin_utama: true, admin_tiket: false, petugas_tiket: false },
  { perm: 'Akses screenshoot', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Export Data (XLS, PDF, Print)', admin_utama: true, admin_tiket: true, petugas_tiket: false },
  { perm: 'Tampilan Tiket', admin_utama: true, admin_tiket: true, petugas_tiket: true },
  { perm: 'Log Aktivitas', admin_utama: true, admin_tiket: true, petugas_tiket: false },
];

// Dummy Tickets
export const dummyTickets = [
  {
    id: 'RA-2024-001',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_pbd',
    domisiliOCR: 'pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'L',
    operatorType: 'loket',
    ocrConfidence: 95,
    namaLengkap: 'Budi Santoso',
    email: 'budi@gmail.com',
    noHP: '081234567890',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 150000,
    totalBiaya: 150000,
    approvalStatus: 'disetujui',
    paymentStatus: 'no_activity',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Sistem',
    lastActionAt: '2024-01-15T10:30:00',
    createdAt: '2024-01-15T10:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-002',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_luar_papua',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'P',
    operatorType: 'qris',
    ocrConfidence: 88,
    namaLengkap: 'Siti Rahayu',
    email: 'siti@gmail.com',
    noHP: '081234567891',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 500000,
    totalBiaya: 500000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Sistem',
    lastActionAt: '2024-01-16T14:00:00',
    createdAt: '2024-01-16T12:00:00',
    paidAt: '2024-01-16T14:00:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-003',
    bookingType: 'group',
    feeCategory: 'wisatawan_domestik_luar_papua',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'L',
    operatorType: 'transfer',
    ocrConfidence: 92,
    namaLengkap: 'Ahmad Wijaya',
    email: 'ahmad@gmail.com',
    noHP: '081234567892',
    ktmUrl: '/placeholder.svg',
    jumlahDomestik: 5,
    jumlahMancanegara: 2,
    hargaPerOrang: 500000,
    totalBiaya: 4500000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'masuk',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Pemindai Gerbang',
    lastActionAt: '2024-01-17T08:30:00',
    createdAt: '2024-01-16T18:00:00',
    paidAt: '2024-01-16T20:00:00',
    enteredAt: '2024-01-17T08:30:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-004',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'Australia',
    genderOCR: 'L',
    operatorType: 'doku',
    ocrConfidence: 99,
    namaLengkap: 'John Smith',
    email: 'john@email.com',
    noHP: '+61412345678',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'keluar',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Pemindai Gerbang',
    lastActionAt: '2024-01-18T16:00:00',
    createdAt: '2024-01-15T09:00:00',
    paidAt: '2024-01-15T11:00:00',
    enteredAt: '2024-01-16T07:00:00',
    exitedAt: '2024-01-18T16:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-005',
    bookingType: 'perorangan',
    feeCategory: 'peneliti_domestik',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'P',
    operatorType: 'loket',
    ocrConfidence: 87,
    namaLengkap: 'Dr. Maria Putri',
    email: 'maria.putri@univ.ac.id',
    noHP: '081234567895',
    ktmUrl: '/placeholder.svg',
    anggotaPeneliti: [
      {
        nama: 'Dr. Maria Putri',
        dokumenIdentitasUrl: '/placeholder.svg',
      },
      {
        nama: 'Budi Santoso',
        dokumenIdentitasUrl: '/placeholder.svg',
      },
    ],
    lokasiKKPN: 'KKPN Misool Selatan',
    namaInstitusi: 'Universitas Cenderawasih',
    asalInstitusi: 'Indonesia',
    alamatInstitusi: 'Jl. Kampus Baru, Kota Jayapura',
    provinsi: 'Papua',
    kabupatenKota: 'Kota Jayapura',
    nomorTeleponInstitusiPeneliti: '0967-123456',
    emailInstitusiPeneliti: 'riset.uncen@ac.id',
    judulPenelitian: 'Keanekaragaman Karang di Perairan Misool',
    tujuanPenelitian: 'Memetakan kesehatan terumbu karang pada zona konservasi',
    uraianSingkatPenelitian: 'Survei ekologi bawah laut dan pengambilan sampel kualitas air.',
    tanggalMulaiKegiatan: '2024-02-01',
    tanggalSelesaiKegiatan: '2024-02-10',
    researchPermitUrl: '/placeholder.svg',
    researchRequestLetterUrl: '/placeholder.svg',
    namaLengkapPenanggungJawab: 'Dr. Maria Putri',
    kewarganegaraanPenanggungJawab: 'Indonesia',
    fotoIdentitasPenanggungJawabUrl: '/placeholder.svg',
    nomorSelulerPenanggungJawab: '081234567895',
    saranaPenelitianDigunakan: 'Kapal penelitian',
    jumlahKapalPenelitianIndonesia: 1,
    namaKapalPenelitianIndonesia: ['KM Bahari Sains 01'],
    jumlahKapalPenelitianAsing: 0,
    namaKapalPenelitianAsing: [],
    hargaPerOrang: 500000,
    totalBiaya: 500000,
    approvalStatus: 'menunggu',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    lastActionBy: 'Sistem',
    lastActionAt: '2024-01-18T10:00:00',
    createdAt: '2024-01-18T10:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-006',
    bookingType: 'perorangan',
    feeCategory: 'peneliti_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'United Kingdom',
    genderOCR: 'L',
    operatorType: 'doku',
    ocrConfidence: 96,
    namaLengkap: 'Dr. James Wilson',
    email: 'jwilson@oxford.edu',
    noHP: '+44123456789',
    ktmUrl: '/placeholder.svg',
    lokasiKKPN: 'KKPN Waigeo Timur',
    namaInstitusi: 'Oxford Marine Research Institute',
    asalInstitusi: 'United Kingdom',
    alamatInstitusi: '15 Norham Gardens, Oxford',
    provinsi: 'Papua Barat Daya',
    kabupatenKota: 'Kabupaten Raja Ampat',
    nomorTeleponInstitusiPeneliti: '+44 1865 123456',
    emailInstitusiPeneliti: 'field.office@oxmri.ac.uk',
    judulPenelitian: 'Marine Megafauna Migration in Raja Ampat',
    tujuanPenelitian: 'Mengidentifikasi pola migrasi dan habitat prioritas konservasi',
    uraianSingkatPenelitian: 'Pemantauan satelit dan pengamatan lapangan pada area inti konservasi.',
    tanggalMulaiKegiatan: '2024-01-11',
    tanggalSelesaiKegiatan: '2024-01-25',
    researchPermitUrl: '/placeholder.svg',
    researchRequestLetterUrl: '/placeholder.svg',
    namaLengkapPenanggungJawab: 'Dr. James Wilson',
    kewarganegaraanPenanggungJawab: 'United Kingdom',
    fotoIdentitasPenanggungJawabUrl: '/placeholder.svg',
    nomorSelulerPenanggungJawab: '+44123456789',
    saranaPenelitianDigunakan: 'Kapal penelitian dan ROV',
    jumlahKapalPenelitianIndonesia: 1,
    namaKapalPenelitianIndonesia: ['KM Raja Samudra'],
    jumlahKapalPenelitianAsing: 1,
    namaKapalPenelitianAsing: ['RV Ocean Pioneer'],
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'masuk',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: true,
    approvedBy: 'Dewi Anggraini',
    approvedAt: '2024-01-10T09:00:00',
    lastActionBy: 'Pemindai Gerbang',
    lastActionAt: '2024-01-12T07:30:00',
    createdAt: '2024-01-09T15:00:00',
    paidAt: '2024-01-10T10:00:00',
    enteredAt: '2024-01-12T07:30:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-007',
    bookingType: 'perorangan',
    feeCategory: 'mooring',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'U',
    operatorType: 'transfer',
    ocrConfidence: 91,
    namaLengkap: 'PT. Phinisi Jaya',
    email: 'info@phinisijaya.com',
    noHP: '021234567890',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 75000000,
    totalBiaya: 75000000,
    approvalStatus: 'ditolak',
    rejectionReason: 'Dokumen tidak valid, kapal tidak terdaftar',
    paymentStatus: 'unsuccessful',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    approvedBy: 'Rudi Hartono',
    approvedAt: '2024-01-14T11:00:00',
    lastActionBy: 'Rudi Hartono',
    lastActionAt: '2024-01-14T11:00:00',
    createdAt: '2024-01-13T14:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-008',
    bookingType: 'perorangan',
    feeCategory: 'sport_fishing',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'U',
    operatorType: 'transfer',
    ocrConfidence: 89,
    namaLengkap: 'Klub Memancing Indonesia',
    email: 'club@fishingindo.com',
    noHP: '081234567898',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 2500000,
    totalBiaya: 2500000,
    approvalStatus: 'ditolak',
    rejectionReason: 'Dokumen izin memancing tidak lengkap',
    paymentStatus: 'unsuccessful',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    lastActionBy: 'Dewi Anggraini',
    lastActionAt: '2024-01-17T16:00:00',
    createdAt: '2024-01-17T10:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-009',
    bookingType: 'group',
    feeCategory: 'wisatawan_domestik_papua',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'L',
    operatorType: 'qris',
    ocrConfidence: 94,
    namaLengkap: 'Kelompok Wisata Papua',
    email: 'kwp@gmail.com',
    noHP: '081234567899',
    ktmUrl: '/placeholder.svg',
    jumlahDomestik: 8,
    jumlahMancanegara: 0,
    hargaPerOrang: 250000,
    totalBiaya: 2000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'masuk',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Pemindai Gerbang',
    lastActionAt: '2024-01-19T09:00:00',
    createdAt: '2024-01-18T08:00:00',
    paidAt: '2024-01-18T12:00:00',
    enteredAt: '2024-01-19T09:00:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-010',
    bookingType: 'perorangan',
    feeCategory: 'mooring',
    domisiliOCR: 'mancanegara',
    countryOCR: 'Netherlands',
    genderOCR: 'U',
    operatorType: 'doku',
    ocrConfidence: 97,
    namaLengkap: 'Kapal Coral Explorer',
    email: 'charter@coralexplorer.com',
    noHP: '+6281234567800',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 75000000,
    totalBiaya: 75000000,
    approvalStatus: 'menunggu',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    lastActionBy: 'Sistem',
    lastActionAt: '2024-01-19T11:00:00',
    createdAt: '2024-01-19T11:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-011',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_pbd',
    domisiliOCR: 'pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'L',
    operatorType: 'qris',
    ocrConfidence: 93,
    namaLengkap: 'Yohanes Wambrauw',
    email: 'yohanes@gmail.com',
    noHP: '085234567801',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 150000,
    totalBiaya: 150000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'keluar',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Pemindai Gerbang',
    lastActionAt: '2024-01-14T17:30:00',
    createdAt: '2024-01-12T09:00:00',
    paidAt: '2024-01-12T10:00:00',
    enteredAt: '2024-01-13T08:00:00',
    exitedAt: '2024-01-14T17:30:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-012',
    bookingType: 'group',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'Germany',
    genderOCR: 'U',
    operatorType: 'doku',
    ocrConfidence: 98,
    namaLengkap: 'Kelompok Penyelam Eropa',
    email: 'tour@eudivers.eu',
    noHP: '+49123456789',
    ktmUrl: '/placeholder.svg',
    jumlahDomestik: 0,
    jumlahMancanegara: 12,
    hargaPerOrang: 1000000,
    totalBiaya: 12000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Sistem',
    lastActionAt: '2024-01-19T16:00:00',
    createdAt: '2024-01-19T14:00:00',
    paidAt: '2024-01-19T16:00:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-013',
    bookingType: 'perorangan',
    feeCategory: 'peneliti_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'France',
    genderOCR: 'P',
    operatorType: 'doku',
    ocrConfidence: 90,
    namaLengkap: 'Dr. Lina Kartika',
    email: 'lina.kartika@univ.ac.id',
    noHP: '081234567812',
    ktmUrl: '/placeholder.svg',
    lokasiKKPN: 'KKPN Selat Dampier',
    namaInstitusi: 'Institut Teknologi Bandung',
    asalInstitusi: 'Indonesia',
    alamatInstitusi: 'Jl. Ganesha 10, Bandung',
    provinsi: 'Jawa Barat',
    kabupatenKota: 'Kota Bandung',
    nomorTeleponInstitusiPeneliti: '022-2500935',
    emailInstitusiPeneliti: 'oceanography@itb.ac.id',
    judulPenelitian: 'Pemodelan Arus Laut Mikro di Raja Ampat',
    tujuanPenelitian: 'Menyusun model arus untuk mitigasi dampak wisata bahari',
    uraianSingkatPenelitian: 'Pemasangan alat ukur arus dan validasi data numerik.',
    tanggalMulaiKegiatan: '2024-02-05',
    tanggalSelesaiKegiatan: '2024-02-18',
    researchPermitUrl: '/placeholder.svg',
    researchRequestLetterUrl: '/placeholder.svg',
    namaLengkapPenanggungJawab: 'Dr. Lina Kartika',
    kewarganegaraanPenanggungJawab: 'Indonesia',
    fotoIdentitasPenanggungJawabUrl: '/placeholder.svg',
    nomorSelulerPenanggungJawab: '081234567812',
    saranaPenelitianDigunakan: 'Kapal penelitian',
    jumlahKapalPenelitianIndonesia: 2,
    namaKapalPenelitianIndonesia: ['KM Nusa Riset 03', 'KM Nusa Riset 07'],
    jumlahKapalPenelitianAsing: 0,
    namaKapalPenelitianAsing: [],
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    approvedBy: 'Dewi Anggraini',
    approvedAt: '2024-01-20T09:00:00',
    lastActionBy: 'Dewi Anggraini',
    lastActionAt: '2024-01-20T09:00:00',
    createdAt: '2024-01-20T08:30:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-014',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_pbd',
    domisiliOCR: 'pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'L',
    operatorType: 'qris',
    ocrConfidence: 94,
    namaLengkap: 'Andi Saputra',
    email: 'andi.saputra@gmail.com',
    noHP: '081234567820',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 150000,
    totalBiaya: 150000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'masuk',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Pemindai Gerbang',
    lastActionAt: '2024-01-19T09:45:00',
    createdAt: '2024-01-19T09:30:00',
    paidAt: '2024-01-19T09:40:00',
    enteredAt: '2024-01-19T09:45:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-015',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_luar_papua',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'P',
    operatorType: 'transfer',
    ocrConfidence: 92,
    namaLengkap: 'Nadia Prameswari',
    email: 'nadia.prameswari@gmail.com',
    noHP: '081234567821',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 500000,
    totalBiaya: 500000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Sistem',
    lastActionAt: '2024-01-19T10:20:00',
    createdAt: '2024-01-19T10:15:00',
    paidAt: '2024-01-19T10:20:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-016',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'Australia',
    genderOCR: 'L',
    operatorType: 'doku',
    ocrConfidence: 96,
    namaLengkap: 'Michael Green',
    email: 'mgreen@mail.com',
    noHP: '+61456789012',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Sistem',
    lastActionAt: '2024-01-19T12:35:00',
    createdAt: '2024-01-19T12:20:00',
    paidAt: '2024-01-19T12:35:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-017',
    bookingType: 'perorangan',
    feeCategory: 'peneliti_domestik',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'P',
    operatorType: 'loket',
    ocrConfidence: 91,
    namaLengkap: 'Fitri Handayani',
    email: 'fitri.handayani@kampus.ac.id',
    noHP: '081234567822',
    ktmUrl: '/placeholder.svg',
    lokasiKKPN: 'KKPN Ayau-Asia',
    namaInstitusi: 'Universitas Papua',
    asalInstitusi: 'Indonesia',
    alamatInstitusi: 'Jl. Gunung Salju, Manokwari',
    provinsi: 'Papua Barat',
    kabupatenKota: 'Kabupaten Manokwari',
    nomorTeleponInstitusiPeneliti: '0986-211111',
    emailInstitusiPeneliti: 'litbang@unipa.ac.id',
    judulPenelitian: 'Studi Lamun sebagai Habitat Ikan Juvenil',
    tujuanPenelitian: 'Menganalisis hubungan tutupan lamun dan kelimpahan ikan',
    uraianSingkatPenelitian: 'Pengambilan data transek lamun dan dokumentasi visual.',
    tanggalMulaiKegiatan: '2024-02-12',
    tanggalSelesaiKegiatan: '2024-02-20',
    researchPermitUrl: '/placeholder.svg',
    researchRequestLetterUrl: '/placeholder.svg',
    namaLengkapPenanggungJawab: 'Fitri Handayani',
    kewarganegaraanPenanggungJawab: 'Indonesia',
    fotoIdentitasPenanggungJawabUrl: '/placeholder.svg',
    nomorSelulerPenanggungJawab: '081234567822',
    saranaPenelitianDigunakan: 'Kapal penelitian',
    jumlahKapalPenelitianIndonesia: 1,
    namaKapalPenelitianIndonesia: ['KM Biota Nusantara'],
    jumlahKapalPenelitianAsing: 0,
    namaKapalPenelitianAsing: [],
    hargaPerOrang: 500000,
    totalBiaya: 500000,
    approvalStatus: 'disetujui',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    approvedBy: 'Rudi Hartono',
    approvedAt: '2024-01-19T15:20:00',
    lastActionBy: 'Rudi Hartono',
    lastActionAt: '2024-01-19T15:20:00',
    createdAt: '2024-01-19T15:10:00',
    qrActive: false,
  },
  {
    id: 'RA-2023-018',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_pbd',
    domisiliOCR: 'pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'L',
    operatorType: 'qris',
    ocrConfidence: 93,
    namaLengkap: 'Yusuf Kambu',
    email: 'yusuf.kambu@gmail.com',
    noHP: '081234567823',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 150000,
    totalBiaya: 150000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'keluar',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Pemindai Gerbang',
    lastActionAt: '2023-01-19T17:10:00',
    createdAt: '2023-01-19T11:40:00',
    paidAt: '2023-01-19T12:00:00',
    enteredAt: '2023-01-19T12:30:00',
    exitedAt: '2023-01-19T17:10:00',
    qrActive: false,
  },
  {
    id: 'RA-2023-019',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_luar_papua',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'P',
    operatorType: 'transfer',
    ocrConfidence: 90,
    namaLengkap: 'Melati Rarasati',
    email: 'melati.rarasati@gmail.com',
    noHP: '081234567824',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 500000,
    totalBiaya: 500000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Sistem',
    lastActionAt: '2023-01-19T13:20:00',
    createdAt: '2023-01-19T13:05:00',
    paidAt: '2023-01-19T13:20:00',
    qrActive: true,
  },
  {
    id: 'RA-2026-020',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'Indonesia',
    genderOCR: 'L',
    operatorType: 'doku',
    ocrConfidence: 97,
    namaLengkap: 'Daniel Harper',
    email: 'daniel.harper@email.com',
    noHP: '+61400111222',
    childTicketIds: ['RA-2026-022', 'RA-2026-023'],
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Dwi Prasetyo',
    lastActionAt: '2026-02-10T10:40:00',
    createdAt: '2026-02-10T10:15:00',
    paidAt: '2026-02-10T10:30:00',
    qrActive: true,
  },
  {
    id: 'RA-2026-022',
    parentTicketId: 'RA-2026-020',
    relationshipToParent: 'anak',
    childAge: 10,
    isChildVisitor: true,
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'Australia',
    genderOCR: 'L',
    identityType: 'paspor',
    identityNumber: 'PHDAN2016041',
    operatorType: 'doku',
    ocrConfidence: 96,
    namaLengkap: 'Ethan Harper',
    email: 'daniel.harper@email.com',
    noHP: '+61400111222',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Dwi Prasetyo',
    lastActionAt: '2026-02-10T10:40:00',
    createdAt: '2026-02-10T10:17:00',
    paidAt: '2026-02-10T10:30:00',
    qrActive: true,
  },
  {
    id: 'RA-2026-023',
    parentTicketId: 'RA-2026-020',
    relationshipToParent: 'anak',
    childAge: 7,
    isChildVisitor: true,
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    countryOCR: 'Australia',
    genderOCR: 'P',
    identityType: 'paspor',
    identityNumber: 'PHDAN2019038',
    operatorType: 'doku',
    ocrConfidence: 95,
    namaLengkap: 'Olivia Harper',
    email: 'daniel.harper@email.com',
    noHP: '+61400111222',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'Dwi Prasetyo',
    lastActionAt: '2026-02-10T10:40:00',
    createdAt: '2026-02-10T10:18:00',
    paidAt: '2026-02-10T10:30:00',
    qrActive: true,
  },
  {
    id: 'RA-2026-021',
    bookingType: 'group',
    feeCategory: 'peneliti_domestik',
    domisiliOCR: 'papua_luar_pbd',
    countryOCR: 'Indonesia',
    genderOCR: 'U',
    operatorType: 'transfer',
    ocrConfidence: 95,
    namaLengkap: 'Tim Peneliti Mangrove Nusantara',
    email: 'tim.riset@lipi.go.id',
    noHP: '081298761234',
    ktmUrl: '/placeholder.svg',
    jumlahDomestik: 2,
    jumlahMancanegara: 0,
    anggotaPeneliti: [
      {
        nama: 'Dr. Rani Kusuma',
        dokumenIdentitasUrl: '/placeholder.svg',
      },
      {
        nama: 'M. Fajar Pratama',
        dokumenIdentitasUrl: '/placeholder.svg',
      },
    ],
    lokasiKKPN: 'KKPN Misool Selatan',
    namaInstitusi: 'BRIN Pusat Riset Kelautan',
    asalInstitusi: 'Indonesia',
    alamatInstitusi: 'Jl. Raya Jakarta-Bogor KM 46, Cibinong',
    provinsi: 'Jawa Barat',
    kabupatenKota: 'Kabupaten Bogor',
    nomorTeleponInstitusiPeneliti: '021-87914567',
    emailInstitusiPeneliti: 'kelautan@brin.go.id',
    judulPenelitian: 'Monitoring Rehabilitasi Mangrove dan Biota Asosiasi',
    tujuanPenelitian: 'Mengevaluasi keberhasilan rehabilitasi mangrove pada area prioritas konservasi',
    uraianSingkatPenelitian: 'Pengukuran transek vegetasi, sampling sedimen, dan dokumentasi biodiversitas.',
    tanggalMulaiKegiatan: '2026-03-05',
    tanggalSelesaiKegiatan: '2026-03-12',
    researchPermitUrl: '/placeholder.svg',
    researchRequestLetterUrl: '/placeholder.svg',
    ktpPenanggungJawabUrl: '/placeholder.svg',
    namaLengkapPenanggungJawab: 'Dr. Rani Kusuma',
    kewarganegaraanPenanggungJawab: 'Indonesia',
    fotoIdentitasPenanggungJawabUrl: '/placeholder.svg',
    nomorSelulerPenanggungJawab: '081298761235',
    saranaPenelitianDigunakan: 'Kapal penelitian dan perahu kecil',
    jumlahKapalPenelitianIndonesia: 1,
    namaKapalPenelitianIndonesia: ['KM Riset Cakrawala'],
    jumlahKapalPenelitianAsing: 0,
    namaKapalPenelitianAsing: [],
    hargaPerOrang: 500000,
    totalBiaya: 1000000,
    approvalStatus: 'menunggu',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    lastActionBy: 'Sistem',
    lastActionAt: '2026-02-12T11:10:00',
    createdAt: '2026-02-12T11:00:00',
    qrActive: false,
  },
];

// Dummy Refunds
export const dummyRefunds = [
  {
    id: 'REF-2024-001',
    ticketId: 'RA-2024-002',
    ticketName: 'Siti Rahayu',
    originalAmount: 500000,
    refundAmount: 500000,
    type: 'full',
    reason: 'Perubahan jadwal perjalanan',
    status: 'requested',
    requestedAt: '2024-01-19T10:00:00',
    requestedBy: 'Pelanggan',
  },
  {
    id: 'REF-2024-002',
    ticketId: 'RA-2024-003',
    ticketName: 'Ahmad Wijaya (Grup)',
    originalAmount: 4500000,
    refundAmount: 1000000,
    type: 'partial',
    reason: '2 peserta membatalkan',
    status: 'requested',
    requestedAt: '2024-01-18T14:00:00',
    requestedBy: 'Pelanggan',
  },
  {
    id: 'REF-2024-003',
    ticketId: 'RA-2024-005',
    ticketName: 'Dr. Maria Putri',
    originalAmount: 500000,
    refundAmount: 500000,
    type: 'full',
    reason: 'Penelitian dibatalkan',
    status: 'completed',
    requestedAt: '2024-01-10T09:00:00',
    requestedBy: 'Pelanggan',
    processedBy: 'Dewi Anggraini',
    processedAt: '2024-01-10T11:00:00',
    completedAt: '2024-01-11T10:00:00',
    referenceNumber: 'TRF-20240111-001',
    proofUrl: '/placeholder.svg',
  },
  {
    id: 'REF-2024-004',
    ticketId: 'RA-2024-007',
    ticketName: 'PT. Phinisi Jaya',
    originalAmount: 75000000,
    refundAmount: 75000000,
    type: 'full',
    reason: 'Izin operasi ditolak',
    status: 'rejected',
    requestedAt: '2024-01-15T10:00:00',
    requestedBy: 'Pelanggan',
    processedBy: 'Rudi Hartono',
    processedAt: '2024-01-15T14:00:00',
    notes: 'Tiket belum dibayar, tidak memenuhi syarat pengembalian dana',
  },
  {
    id: 'REF-2024-005',
    ticketId: 'RA-2024-009',
    ticketName: 'Kelompok Wisata Papua',
    originalAmount: 2000000,
    refundAmount: 250000,
    type: 'partial',
    reason: '1 anggota sakit tidak bisa ikut',
    status: 'completed',
    requestedAt: '2024-01-17T08:00:00',
    requestedBy: 'Pelanggan',
    processedBy: 'Dewi Anggraini',
    processedAt: '2024-01-17T10:00:00',
    completedAt: '2024-01-17T15:00:00',
    referenceNumber: 'TRF-20240117-002',
    proofUrl: '/placeholder.svg',
  },
  {
    id: 'REF-2024-006',
    ticketId: 'RA-2024-012',
    ticketName: 'Kelompok Penyelam Eropa',
    originalAmount: 12000000,
    refundAmount: 2000000,
    type: 'partial',
    reason: '2 peserta membatalkan di menit terakhir',
    status: 'rejected',
    requestedAt: '2024-01-19T18:00:00',
    requestedBy: 'Pelanggan',
    notes: 'Dibatalkan oleh pelanggan',
  },
];

// Dummy Admin Users
export const dummyAdminUsers = [
  {
    id: 'ADM-001',
    name: 'Rudi Hartono',
    email: 'rudi.hartono@rajaampat.go.id',
    role: 'admin_utama',
    status: 'active',
    lastLogin: '2024-01-19T08:30:00',
    createdAt: '2023-01-01T00:00:00',
  },
  {
    id: 'ADM-002',
    name: 'Dewi Anggraini',
    email: 'dewi.anggraini@rajaampat.go.id',
    role: 'admin_tiket',
    status: 'active',
    lastLogin: '2024-01-19T09:15:00',
    createdAt: '2023-03-15T00:00:00',
  },
  {
    id: 'ADM-003',
    name: 'Bambang Susilo',
    email: 'bambang.susilo@rajaampat.go.id',
    role: 'petugas_tiket',
    status: 'active',
    lastLogin: '2024-01-18T16:45:00',
    createdAt: '2023-06-01T00:00:00',
  },
];

// Dummy Audit Logs
export const dummyAuditLogs = [
  {
    id: 'LOG-001',
    timestamp: '2024-01-19T16:00:00',
    adminUser: 'Sistem',
    adminRole: 'admin_utama',
    actionType: 'payment_received',
    entityType: 'Payment',
    entityId: 'RA-2024-012',
    afterValue: 'Rp 12.000.000',
    note: 'Pembayaran otomatis disetujui via QRIS',
  },
  {
    id: 'LOG-002',
    timestamp: '2024-01-19T11:00:00',
    adminUser: 'Sistem',
    adminRole: 'admin_utama',
    actionType: 'ticket_created',
    entityType: 'Ticket',
    entityId: 'RA-2024-010',
    note: 'Tiket sandar baru menunggu persetujuan',
  },
  {
    id: 'LOG-003',
    timestamp: '2024-01-18T16:00:00',
    adminUser: 'Rudi Hartono',
    adminRole: 'admin_utama',
    actionType: 'refund_processing',
    entityType: 'Refund',
    entityId: 'REF-2024-002',
    beforeValue: 'requested',
    afterValue: 'processing',
    note: 'Mulai memproses pengembalian parsial',
  },
  {
    id: 'LOG-004',
    timestamp: '2024-01-17T16:00:00',
    adminUser: 'Dewi Anggraini',
    adminRole: 'admin_tiket',
    actionType: 'ticket_rejected',
    entityType: 'Ticket',
    entityId: 'RA-2024-008',
    beforeValue: 'menunggu',
    afterValue: 'ditolak',
    note: 'Dokumen izin memancing tidak lengkap',
  },
  {
    id: 'LOG-005',
    timestamp: '2024-01-17T15:00:00',
    adminUser: 'Dewi Anggraini',
    adminRole: 'admin_tiket',
    actionType: 'refund_completed',
    entityType: 'Refund',
    entityId: 'REF-2024-005',
    afterValue: 'Rp 250.000',
    note: 'Transfer selesai - TRF-20240117-002',
  },
  {
    id: 'LOG-006',
    timestamp: '2024-01-14T11:00:00',
    adminUser: 'Rudi Hartono',
    adminRole: 'admin_utama',
    actionType: 'ticket_rejected',
    entityType: 'Ticket',
    entityId: 'RA-2024-007',
    beforeValue: 'menunggu',
    afterValue: 'ditolak',
    note: 'Dokumen tidak valid, kapal tidak terdaftar',
  },
  {
    id: 'LOG-007',
    timestamp: '2024-01-10T09:00:00',
    adminUser: 'Dewi Anggraini',
    adminRole: 'admin_tiket',
    actionType: 'ticket_approved',
    entityType: 'Ticket',
    entityId: 'RA-2024-006',
    beforeValue: 'menunggu',
    afterValue: 'disetujui',
    note: 'Izin penelitian diverifikasi',
  },
  {
    id: 'LOG-008',
    timestamp: '2024-01-05T14:30:00',
    adminUser: 'Rudi Hartono',
    adminRole: 'admin_utama',
    actionType: 'user_disabled',
    entityType: 'User',
    entityId: 'ADM-005',
    beforeValue: 'active',
    afterValue: 'disabled',
    note: 'Akun ditangguhkan menunggu tinjauan',
  },
];

// Dummy Invoices
const baseDummyInvoices = [
  // ✅ GROUP INVOICE: 1 invoice bayar banyak tiket perorangan
  {
    id: 'INV-2024-001',
    ticketId: 'RA-2024-002',
    amount: 500000,
    method: 'qris',
    paidAt: '2024-01-16T14:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },
  {
    id: 'INV-2024-001',
    ticketId: 'RA-2024-004',
    amount: 1000000,
    method: 'qris',
    paidAt: '2024-01-16T14:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },
  {
    id: 'INV-2024-001',
    ticketId: 'RA-2024-011',
    amount: 150000,
    method: 'qris',
    paidAt: '2024-01-16T14:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },

  
  // ✅ PERORANGAN INVOICE: 1 invoice = 1 tiket (contoh peneliti)
  {
    id: 'INV-2024-003',
    ticketId: 'RA-2024-006',
    amount: 1000000,
    method: 'bank_transfer',
    paidAt: '2024-01-10T10:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },

  // ✅ PERORANGAN INVOICE: tiket bookingType group tapi invoicenya single (tetap perorangan invoice)
  {
    id: 'INV-2024-004',
    ticketId: 'RA-2024-012',
    amount: 12000000,
    method: 'credit_card',
    paidAt: '2024-01-19T16:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },

  // ✅ GROUP INVOICE: dibuat tapi belum bayar (banyak tiket)
  {
    id: 'INV-2024-005',
    ticketId: 'RA-2024-001',
    amount: 150000,
    method: 'bank_transfer',
    paymentStatus: 'belum_bayar',
    realisasiStatus: 'belum_terealisasi',
    refundFlag: false,
  },
  {
    id: 'INV-2024-005',
    ticketId: 'RA-2024-005',
    amount: 500000,
    method: 'bank_transfer',
    paymentStatus: 'belum_bayar',
    realisasiStatus: 'belum_terealisasi',
    refundFlag: false,
  },

  // ✅ PERORANGAN INVOICE: mooring (unpaid)
  {
    id: 'INV-2024-006',
    ticketId: 'RA-2024-010',
    amount: 75000000,
    method: 'bank_transfer',
    paymentStatus: 'belum_bayar',
    realisasiStatus: 'belum_terealisasi',
    refundFlag: false,
  },
];

const PAID_TICKET_STATUSES = new Set([
  'sudah_bayar',
  'refund_diajukan',
  'refund_diproses',
  'refund_selesai',
]);

export const isChildVisitorTicket = (ticket) =>
  Boolean(
    ticket?.isChildVisitor ||
    ticket?.relationshipToParent === 'anak' ||
    ticket?.parentTicketId,
  );

const OPERATOR_INVOICE_METHOD_MAP = {
  loket: 'cash',
  qris: 'qris',
  transfer: 'bank_transfer',
  doku: 'credit_card',
};

const autoGeneratedPaidInvoices = dummyTickets
  .filter((ticket) => !isChildVisitorTicket(ticket))
  .filter((ticket) => !baseDummyInvoices.some((inv) => inv.ticketId === ticket.id))
  .filter((ticket) => ticket.approvalStatus !== 'ditolak')
  .map((ticket, index) => ({
    id: `INV-AUTO-${String(index + 1).padStart(3, '0')}`,
    ticketId: ticket.id,
    amount: Number(ticket.totalBiaya || ticket.hargaPerOrang || 0),
    method: OPERATOR_INVOICE_METHOD_MAP[ticket.operatorType] || 'bank_transfer',
    paidAt: PAID_TICKET_STATUSES.has(ticket.paymentStatus) ? ticket.paidAt || '' : '',
    paymentStatus: PAID_TICKET_STATUSES.has(ticket.paymentStatus) ? ticket.paymentStatus : 'belum_bayar',
    realisasiStatus: ticket.realisasiStatus || 'belum_terealisasi',
    refundFlag: String(ticket.paymentStatus || '').startsWith('refund_'),
  }));

export const dummyInvoices = [...baseDummyInvoices, ...autoGeneratedPaidInvoices];

// ===== Helpers untuk multi-ticket invoice (GROUPING by invoice.id) =====

export const groupInvoiceLinesById = (lines) =>
  lines.reduce((acc, line) => {
    (acc[line.id] ||= []).push(line);
    return acc;
  }, {});

export const getInvoiceLinesById = (invoiceId) =>
  getAllInvoiceLines().filter((inv) => inv.id === invoiceId);

export const getInvoiceIdByTicketId = (ticketId) =>
  getAllInvoiceLines().find((inv) => inv.ticketId === ticketId)?.id;

export const getInvoiceIdForTicket = (ticketId) => {
  return getInvoiceIdByTicketId(ticketId);
};

export const getInvoiceLinesByInvoiceId = (invoiceId) => {
  return getAllInvoiceLines().filter((inv) => inv.id === invoiceId);
};

export const getTicketIdsByInvoiceId = (invoiceId) => {
  return getInvoiceLinesByInvoiceId(invoiceId).map((inv) => inv.ticketId);
};


// Finance Report Summary
export const financeReportSummary = {
  totalPaid: 21150000,
  totalRealized: 8650000,
  totalUnrealized: 12500000,
  totalRefunds: 750000,
  netRealized: 7900000,
  breakdown: {
    byCategory: [
      { category: 'Wisatawan Domestik (Papua Barat Daya)', amount: 150000, count: 1 },
      { category: 'Wisatawan Domestik (Papua luar PBD)', amount: 2000000, count: 1 },
      { category: 'Wisatawan Domestik', amount: 5000000, count: 2 },
      { category: 'Wisatawan Mancanegara', amount: 13000000, count: 2 },
      { category: 'Peneliti Domestik', amount: 0, count: 0 },
      { category: 'Peneliti Mancanegara', amount: 1000000, count: 1 },
      { category: 'Mooring', amount: 0, count: 0 },
      { category: 'Sport Fishing', amount: 0, count: 0 },
    ],
    byCountry: [
      { country: 'Indonesia', amount: 7150000 },
      { country: 'Australia', amount: 1000000 },
      { country: 'Germany', amount: 12000000 },
      { country: 'United Kingdom', amount: 1000000 },
    ],
    byDomisili: [
      { domisili: 'Papua Barat Daya', amount: 150000 },
      { domisili: 'Papua luar PBD', amount: 7000000 },
      { domisili: 'Mancanegara', amount: 14000000 },
    ],
  },
  dailyTrend: [
    { date: '2026-01-12', total: 150000, realized: 150000, refunds: 0 },
    { date: '2026-01-15', total: 1000000, realized: 1000000, refunds: 0 },
    { date: '2026-01-16', total: 5000000, realized: 4500000, refunds: 250000 },
    { date: '2026-01-18', total: 2000000, realized: 2000000, refunds: 0 },
    { date: '2026-01-19', total: 13000000, realized: 1000000, refunds: 500000 },
  ],
};

const OVERVIEW_DISTRIBUTION_CATEGORY_LABELS = {
  'Wisatawan Domestik (Papua Barat Daya)': 'Papua Barat Daya',
  'Wisatawan Domestik (Papua luar PBD)': 'Tanah Papua',
  'Wisatawan Domestik': 'Domestik',
  'Wisatawan Mancanegara': 'Mancanegara',
  'Peneliti Domestik': 'Peneliti Domestik',
  'Peneliti Mancanegara': 'Peneliti Mancanegara',
  Mooring: 'Mooring',
  'Sport Fishing': 'Sport Fishing',
};

const OVERVIEW_COUNTRY_NAME_ALIASES = {
  'United States': 'United States of America',
  USA: 'United States of America',
  'Russian Federation': 'Russia',
};

const OVERVIEW_OPERATOR_CATEGORY_LABELS = {
  homestay: 'Homestay',
  resort: 'Resort',
  kapal: 'Kapal',
  dive_center: 'Dive Center',
  mandiri: 'Mandiri',
  lainnya: 'Lainnya',
};

const OVERVIEW_OPERATOR_CATEGORY_ORDER = [
  'homestay',
  'resort',
  'kapal',
  'dive_center',
  'mandiri',
  'lainnya',
];

const OVERVIEW_WAFFLE_TOTAL_CELLS = 100;
const OVERVIEW_BOOKING_DUMMY_COUNTS_BY_YEAR = {
  '2026': { group: 34, individual: 66 },
  '2024': { group: 42, individual: 58 },
  '2023': { group: 29, individual: 71 },
};

export const OVERVIEW_TREND_FILTER_OPTIONS = [
  { label: 'Rentang Waktu', value: 'range', days: 30 },
];

const toInputDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const overviewTrendDefaultEndDate = financeReportSummary.dailyTrend.length
  ? new Date(
      Math.max(
        ...financeReportSummary.dailyTrend.map((item) => new Date(item.date).getTime()),
      ),
    )
  : new Date();

const overviewTrendDefaultStartDate = new Date(overviewTrendDefaultEndDate);
overviewTrendDefaultStartDate.setDate(overviewTrendDefaultStartDate.getDate() - 29);

export const OVERVIEW_DEFAULT_TREND_DATE_FROM = toInputDate(overviewTrendDefaultStartDate);
export const OVERVIEW_DEFAULT_TREND_DATE_TO = toInputDate(overviewTrendDefaultEndDate);

export const OVERVIEW_BOOKING_YEAR_OPTIONS = Array.from(
  new Set(dummyTickets.map((ticket) => new Date(ticket.createdAt).getFullYear())),
)
  .filter((year) => Number.isFinite(year))
  .sort((a, b) => b - a)
  .map((year) => String(year));

export const OVERVIEW_DEFAULT_BOOKING_YEAR =
  OVERVIEW_BOOKING_YEAR_OPTIONS[0] || String(new Date().getFullYear());

export const OVERVIEW_DEFAULT_SUMMARY_SELECTION = [
  'payment_success',
  'payment_pending',
  'payment_failed',
  'visitor_active',
  'visitor_due',
  'refund_requested',
  'refund_success',
  'approval_wait',
  'approval_approved',
  'visitor_registered',
  'revenue_in',
  'revenue_pending',
  'revenue_total',
  'failed_payment_amount',
];

export const OVERVIEW_DEFAULT_SUMMARY_ORDER = [
  'payment_success',
  'payment_pending',
  'payment_failed',
  'visitor_active',
  'visitor_due',
  'refund_requested',
  'refund_success',
  'approval_wait',
  'approval_approved',
  'visitor_registered',
  'revenue_in',
  'revenue_pending',
  'revenue_total',
  'failed_payment_amount',
];

export const OVERVIEW_SUMMARY_OPTIONS = [
  { id: 'payment_success', label: 'Pembayaran Sukses' },
  { id: 'payment_pending', label: 'Pembayaran Pending' },
  { id: 'payment_failed', label: 'Pembayaran Gagal' },
  { id: 'visitor_active', label: 'Pengunjung Aktif' },
  { id: 'visitor_due', label: 'Pengunjung Jatuh Tempo' },
  { id: 'refund_requested', label: 'Pengajuan Pengembalian' },
  { id: 'refund_success', label: 'Pengembalian Sukses' },
  { id: 'approval_wait', label: 'Konfirmasi Persetujuan' },
  { id: 'approval_approved', label: 'Persetujuan Berhasil' },
  { id: 'visitor_registered', label: 'Pengunjung Terdaftar' },
  { id: 'failed_payment_amount', label: 'Gagal Bayar' },
  { id: 'revenue_in', label: 'Pendapatan Masuk' },
  { id: 'revenue_pending', label: 'Pendapatan Pending' },
  { id: 'revenue_total', label: 'Potensi Pendapatan' },
];

const toDate = (value) => new Date(value);

const isBetweenDate = (date, start, end) => date >= start && date <= end;

const getTicketVisitorCount = (ticket) => {
  if (ticket.bookingType === 'group') {
    const totalGroup =
      Number(ticket.jumlahDomestik || 0) + Number(ticket.jumlahMancanegara || 0);
    return totalGroup > 0 ? totalGroup : 1;
  }
  return 1;
};

const getOverviewOperatorCategory = (ticket) => {
  if (ticket.feeCategory === 'mooring') return 'kapal';
  if (ticket.feeCategory === 'sport_fishing') return 'dive_center';
  if (ticket.operatorType === 'qris') return 'homestay';
  if (ticket.operatorType === 'doku') return 'resort';
  if (ticket.operatorType === 'loket') return 'mandiri';
  if (ticket.operatorType === 'transfer') return 'lainnya';
  return 'lainnya';
};

const buildWaffleCells = (counts) => {
  const total = counts.group + counts.individual;
  if (!total) {
    return Array.from({ length: OVERVIEW_WAFFLE_TOTAL_CELLS }, (_, index) => ({
      id: `empty-${index}`,
      type: 'empty',
    }));
  }
  const groupCells = Math.round((counts.group / total) * OVERVIEW_WAFFLE_TOTAL_CELLS);
  const clampedGroupCells = Math.max(0, Math.min(OVERVIEW_WAFFLE_TOTAL_CELLS, groupCells));
  return Array.from({ length: OVERVIEW_WAFFLE_TOTAL_CELLS }, (_, index) => ({
    id: `cell-${index}`,
    type: index < clampedGroupCells ? 'group' : 'individual',
  }));
};

export const getOverviewDashboardData = ({
  trendFilter = 'range',
  trendDateFrom = OVERVIEW_DEFAULT_TREND_DATE_FROM,
  trendDateTo = OVERVIEW_DEFAULT_TREND_DATE_TO,
  bookingYear = OVERVIEW_DEFAULT_BOOKING_YEAR,
} = {}) => {
  const kpis = {
    pendingApproval: dummyTickets.filter((t) => t.approvalStatus === 'menunggu').length,
    approvalApproved: dummyTickets.filter((t) => t.approvalStatus === 'disetujui').length,
    unpaid: dummyTickets.filter((t) => t.paymentStatus === 'belum_bayar').length,
    paid: dummyTickets.filter((t) => t.paymentStatus === 'sudah_bayar').length,
    paymentFailed: dummyTickets.filter((t) => t.paymentStatus === 'gagal').length,
    totalTickets: dummyTickets.length,
    gateMasuk: dummyTickets.filter((t) => t.gateStatus === 'masuk').length,
    gateKeluar: dummyTickets.filter((t) => t.gateStatus === 'keluar').length,
    revenueUnrealized: financeReportSummary.totalUnrealized,
    revenueRealized: financeReportSummary.totalRealized,
    refundRequested: dummyRefunds.filter((r) => r.status === 'requested').length,
    refundCompleted: dummyRefunds.filter((r) => r.status === 'completed').length,
  };

  const recentTickets = [...dummyTickets]
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
    .slice(0, 5);

  const pendingApprovalTickets = dummyTickets.filter(
    (ticket) => ticket.approvalStatus === 'menunggu',
  );

  const baseTrendData = financeReportSummary.dailyTrend.map((item) => ({
    date: toDate(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    dateRaw: toDate(item.date),
    total: item.total / 1000000,
    realized: item.realized / 1000000,
  }));

  const maxTrendDate = baseTrendData.length
    ? new Date(Math.max(...baseTrendData.map((item) => item.dateRaw.getTime())))
    : new Date();

  const fallbackTrendStart = new Date(maxTrendDate);
  fallbackTrendStart.setDate(fallbackTrendStart.getDate() - 29);
  fallbackTrendStart.setHours(0, 0, 0, 0);

  const fallbackTrendEnd = new Date(maxTrendDate);
  fallbackTrendEnd.setHours(23, 59, 59, 999);

  const parsedTrendStart = trendDateFrom
    ? new Date(`${trendDateFrom}T00:00:00`)
    : fallbackTrendStart;
  const parsedTrendEnd = trendDateTo
    ? new Date(`${trendDateTo}T23:59:59`)
    : fallbackTrendEnd;

  const trendStart = Number.isNaN(parsedTrendStart.getTime())
    ? fallbackTrendStart
    : parsedTrendStart;
  const trendEnd = Number.isNaN(parsedTrendEnd.getTime())
    ? fallbackTrendEnd
    : parsedTrendEnd;

  if (trendEnd < trendStart) {
    trendEnd.setTime(trendStart.getTime());
    trendEnd.setHours(23, 59, 59, 999);
  }

  const formatTrendRangeLabel = (date) =>
    date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const activeTrendFilter = {
    value: trendFilter || 'range',
    label: `${formatTrendRangeLabel(trendStart)} - ${formatTrendRangeLabel(trendEnd)}`,
  };

  const previousTrendStart = new Date(trendStart);
  previousTrendStart.setFullYear(previousTrendStart.getFullYear() - 1);
  const previousTrendEnd = new Date(trendEnd);
  previousTrendEnd.setFullYear(previousTrendEnd.getFullYear() - 1);

  const ticketsInActivePeriod = dummyTickets.filter((ticket) =>
    isBetweenDate(toDate(ticket.createdAt), trendStart, trendEnd),
  );
  const ticketsInPreviousPeriod = dummyTickets.filter((ticket) =>
    isBetweenDate(toDate(ticket.createdAt), previousTrendStart, previousTrendEnd),
  );
  const hasActivePeriodTickets = ticketsInActivePeriod.length > 0;
  const comparisonCurrentTickets = hasActivePeriodTickets ? ticketsInActivePeriod : dummyTickets;
  const comparisonPreviousTickets = ticketsInPreviousPeriod;

  const trendData = baseTrendData
    .filter((item) => item.dateRaw >= trendStart && item.dateRaw <= trendEnd)
    .reduce(
      (acc, item) => {
        const lastYearPoint = Number((item.total * 0.85).toFixed(2));
        acc.currentCumulative += item.total;
        acc.lastYearCumulative += lastYearPoint;
        acc.rows.push({
          ...item,
          totalCumulative: Number(acc.currentCumulative.toFixed(2)),
          lastYearCumulative: Number(acc.lastYearCumulative.toFixed(2)),
        });
        return acc;
      },
      { currentCumulative: 0, lastYearCumulative: 0, rows: [] },
    ).rows;

  const trendMaxValue = trendData.reduce(
    (max, item) => Math.max(max, item.totalCumulative || 0, item.lastYearCumulative || 0),
    0,
  );
  const trendYAxisMax = Math.max(1, Math.ceil((trendMaxValue * 1.15) / 2) * 2);

  const countryCounts = comparisonCurrentTickets.reduce((acc, ticket) => {
    const key = ticket.countryOCR || 'Tidak diketahui';
    if (key === 'Tidak diketahui') return acc;
    const normalizedName = OVERVIEW_COUNTRY_NAME_ALIASES[key] || key;
    acc[normalizedName] = (acc[normalizedName] || 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const topCountryCounts = topCountries.map((item) => item.count);
  const minTopCountryCount = topCountryCounts.length ? Math.min(...topCountryCounts) : 0;
  const maxTopCountryCount = topCountryCounts.length ? Math.max(...topCountryCounts) : 0;
  const getTopCountryColor = (count) => {
    if (!count) return 'hsl(210 20% 92%)';
    if (maxTopCountryCount === minTopCountryCount) return 'hsl(213 72% 48%)';
    const ratio = (count - minTopCountryCount) / (maxTopCountryCount - minTopCountryCount);
    const lightness = 78 - ratio * 38;
    return `hsl(213 72% ${lightness}%)`;
  };
  const topCountrySeriesData = topCountries.map((item) => ({
    name: item.name,
    value: item.count,
    itemStyle: { areaColor: getTopCountryColor(item.count) },
  }));

  const toGenderCounts = (tickets) =>
    tickets.reduce(
      (acc, ticket) => {
        if (ticket.genderOCR !== 'L' && ticket.genderOCR !== 'P') return acc;
        acc[ticket.genderOCR] = (acc[ticket.genderOCR] || 0) + 1;
        return acc;
      },
      { L: 0, P: 0 },
    );
  const genderCurrentCounts = toGenderCounts(comparisonCurrentTickets);
  const genderPreviousRawCounts = toGenderCounts(comparisonPreviousTickets);
  const hasPreviousGenderData =
    (genderPreviousRawCounts.L || 0) > 0 || (genderPreviousRawCounts.P || 0) > 0;
  const genderPreviousCounts = hasPreviousGenderData
    ? genderPreviousRawCounts
    : {
        L: Math.max(0, Math.round((genderCurrentCounts.L || 0) * 0.85)),
        P: Math.max(0, Math.round((genderCurrentCounts.P || 0) * 0.85)),
      };
  const currentYearLabel = String(trendEnd.getFullYear());
  const previousYearLabel = String(trendEnd.getFullYear() - 1);
  const genderStackedData = [
    { year: previousYearLabel, L: genderPreviousCounts.L || 0, P: genderPreviousCounts.P || 0 },
    { year: currentYearLabel, L: genderCurrentCounts.L || 0, P: genderCurrentCounts.P || 0 },
  ];

  const aggregateOperatorCounts = (tickets) =>
    tickets.reduce((acc, ticket) => {
      const category = getOverviewOperatorCategory(ticket);
      const visitors = getTicketVisitorCount(ticket);
      acc[category] = (acc[category] || 0) + visitors;
      return acc;
    }, {});
  const operatorCurrentCounts = aggregateOperatorCounts(comparisonCurrentTickets);
  const operatorPreviousRawCounts = aggregateOperatorCounts(comparisonPreviousTickets);
  const hasPreviousOperatorData = Object.values(operatorPreviousRawCounts).some((value) => value > 0);
  const operatorPreviousCounts = hasPreviousOperatorData
    ? operatorPreviousRawCounts
    : OVERVIEW_OPERATOR_CATEGORY_ORDER.reduce((acc, key) => {
        acc[key] = Math.max(0, Math.round((operatorCurrentCounts[key] || 0) * 0.8));
        return acc;
      }, {});
  const operatorTrendData = OVERVIEW_OPERATOR_CATEGORY_ORDER.map((key) => ({
    name: OVERVIEW_OPERATOR_CATEGORY_LABELS[key],
    current: operatorCurrentCounts[key] || 0,
    lastYear: operatorPreviousCounts[key] || 0,
  }));

  const aggregateBookingPeople = (tickets) =>
    tickets.reduce(
      (acc, ticket) => {
        const peopleCount = getTicketVisitorCount(ticket);
        if (ticket.bookingType === 'group') {
          acc.group += peopleCount;
        } else {
          acc.individual += peopleCount;
        }
        return acc;
      },
      { group: 0, individual: 0 },
    );
  const selectedBookingYear = Number.parseInt(bookingYear, 10) || trendEnd.getFullYear();
  const bookingPeriodStart = new Date(trendStart);
  bookingPeriodStart.setFullYear(selectedBookingYear);
  const bookingPeriodEnd = new Date(trendEnd);
  bookingPeriodEnd.setFullYear(selectedBookingYear);
  const ticketsInBookingPeriod = dummyTickets.filter((ticket) =>
    isBetweenDate(toDate(ticket.createdAt), bookingPeriodStart, bookingPeriodEnd),
  );
  const bookingPeopleFromPeriod = aggregateBookingPeople(ticketsInBookingPeriod);
  const hasBookingPeople =
    bookingPeopleFromPeriod.group + bookingPeopleFromPeriod.individual > 0;
  const fallbackBookingPeople =
    OVERVIEW_BOOKING_DUMMY_COUNTS_BY_YEAR[String(selectedBookingYear)] ||
    OVERVIEW_BOOKING_DUMMY_COUNTS_BY_YEAR[OVERVIEW_DEFAULT_BOOKING_YEAR] ||
    { group: 30, individual: 70 };
  const bookingPeople = hasBookingPeople ? bookingPeopleFromPeriod : fallbackBookingPeople;
  const bookingWaffleData = {
    year: String(selectedBookingYear),
    counts: bookingPeople,
    cells: buildWaffleCells(bookingPeople),
  };
  const bookingTotalPeople = bookingWaffleData.counts.group + bookingWaffleData.counts.individual;
  const bookingGroupPct = bookingTotalPeople
    ? Math.round((bookingWaffleData.counts.group / bookingTotalPeople) * 100)
    : 0;
  const bookingIndividualPct = bookingTotalPeople ? 100 - bookingGroupPct : 0;

  const categoryData = financeReportSummary.breakdown.byCategory.map((item) => ({
    name: OVERVIEW_DISTRIBUTION_CATEGORY_LABELS[item.category] || item.category,
    value: item.amount,
  }));

  return {
    kpis,
    recentTickets,
    pendingApprovalTickets,
    activeTrendFilter,
    trendData,
    trendYAxisMax,
    topCountries,
    topCountrySeriesData,
    getTopCountryColor,
    genderStackedData,
    operatorTrendData,
    bookingWaffleData,
    bookingTotalPeople,
    bookingGroupPct,
    bookingIndividualPct,
    categoryData,
  };
};

// Helper function to format currency
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNominal = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

// Helper function to format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatShortId = (id) => {
  if (!id) return id;
  const parts = id.split('-');
  if (parts.length < 2) return id;
  const prefix = parts[0];
  const suffix = parts[parts.length - 1];
  if (!suffix) return id;
  const shortSuffix = suffix.length > 3 ? suffix.slice(-3) : suffix.padStart(3, '0');
  return `${prefix}-${shortSuffix}`;
};

const TICKET_OVERRIDE_KEY = 'ticket_overrides_v1';
const ONSITE_TICKETS_KEY = 'onsite_tickets_v1';
const ONSITE_INVOICE_LINES_KEY = 'onsite_invoice_lines_v1';
const INVOICE_OVERRIDE_KEY = 'invoice_overrides_v1';

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const loadJsonStorage = (key, fallbackValue, contextLabel) => {
  if (!canUseStorage()) return fallbackValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch (error) {
    console.warn(`Gagal membaca ${contextLabel}:`, error);
    return fallbackValue;
  }
};

const saveJsonStorage = (key, value, contextLabel) => {
  if (!canUseStorage()) return value;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Gagal menyimpan ${contextLabel}:`, error);
  }
  return value;
};

const loadTicketOverrides = () =>
  loadJsonStorage(TICKET_OVERRIDE_KEY, {}, 'override tiket');

const saveTicketOverrides = (overrides) =>
  saveJsonStorage(TICKET_OVERRIDE_KEY, overrides, 'override tiket');

const loadOnsiteTickets = () =>
  loadJsonStorage(ONSITE_TICKETS_KEY, [], 'tiket onsite');

const saveOnsiteTickets = (tickets) =>
  saveJsonStorage(ONSITE_TICKETS_KEY, tickets, 'tiket onsite');

const loadOnsiteInvoiceLines = () =>
  loadJsonStorage(ONSITE_INVOICE_LINES_KEY, [], 'invoice onsite');

const saveOnsiteInvoiceLines = (lines) =>
  saveJsonStorage(ONSITE_INVOICE_LINES_KEY, lines, 'invoice onsite');

const loadInvoiceOverrides = () =>
  loadJsonStorage(INVOICE_OVERRIDE_KEY, {}, 'override invoice');

const saveInvoiceOverrides = (overrides) =>
  saveJsonStorage(INVOICE_OVERRIDE_KEY, overrides, 'override invoice');

const getInvoiceLineKey = (invoiceId, ticketId) => `${invoiceId}::${ticketId}`;

const uniqueBy = (items, getKey) => {
  const map = new Map();
  for (const item of items) {
    map.set(getKey(item), item);
  }
  return Array.from(map.values());
};

export const getTicketOverride = (ticketId) => {
  const overrides = loadTicketOverrides();
  return overrides[ticketId] || null;
};

export const saveTicketOverride = (ticketId, patch) => {
  const overrides = loadTicketOverrides();
  overrides[ticketId] = { ...(overrides[ticketId] || {}), ...patch };
  saveTicketOverrides(overrides);
  return overrides[ticketId];
};

export const applyTicketOverride = (ticket) => {
  if (!ticket) return ticket;
  const override = getTicketOverride(ticket.id);
  if (!override) return ticket;
  return { ...ticket, ...override };
};

export const addOnsiteTicket = (ticket) => {
  const current = loadOnsiteTickets();
  const next = uniqueBy([...current, ticket], (item) => item.id);
  saveOnsiteTickets(next);
  return ticket;
};

export const getOnsiteTickets = () => loadOnsiteTickets();

export const getAllTickets = () => {
  const mergedTickets = uniqueBy([...dummyTickets, ...loadOnsiteTickets()], (ticket) => ticket.id);
  return mergedTickets.map((ticket) => applyTicketOverride(ticket));
};

export const getTicketById = (ticketId) => {
  const ticket = getAllTickets().find((item) => item.id === ticketId);
  return ticket || null;
};

export const getInvoiceLineOverride = (invoiceId, ticketId) => {
  const overrides = loadInvoiceOverrides();
  return overrides[getInvoiceLineKey(invoiceId, ticketId)] || null;
};

export const saveInvoiceLineOverride = (invoiceId, ticketId, patch) => {
  const overrides = loadInvoiceOverrides();
  const key = getInvoiceLineKey(invoiceId, ticketId);
  overrides[key] = { ...(overrides[key] || {}), ...patch };
  saveInvoiceOverrides(overrides);
  return overrides[key];
};

export const addOnsiteInvoiceLine = (line) => {
  const current = loadOnsiteInvoiceLines();
  const next = uniqueBy(
    [...current, line],
    (item) => getInvoiceLineKey(item.id, item.ticketId),
  );
  saveOnsiteInvoiceLines(next);
  return line;
};

export const getOnsiteInvoiceLines = () => loadOnsiteInvoiceLines();

export const getAllInvoiceLines = () => {
  const mergedLines = uniqueBy(
    [...dummyInvoices, ...loadOnsiteInvoiceLines()],
    (line) => getInvoiceLineKey(line.id, line.ticketId),
  );
  return mergedLines
    .filter((line) => !isChildVisitorTicket(getTicketById(line.ticketId)))
    .map((line) => {
      const override = getInvoiceLineOverride(line.id, line.ticketId);
      return override ? { ...line, ...override } : line;
    });
};
