/**
 * Partnership (Mitra) data for Kemitraan & Kolaborasi page.
 * Each mitra has a front-face display + back-face gallery.
 */

export const mitraCategories = [
    { key: 'all', label: { ID: 'Semua', EN: 'All' } },
    { key: 'homestay', label: { ID: 'Homestay', EN: 'Homestay' } },
    { key: 'resort', label: { ID: 'Resor', EN: 'Resort' } },
    { key: 'liveaboard', label: { ID: 'Liveaboard', EN: 'Liveaboard' } },
    { key: 'masyarakat', label: { ID: 'Kelompok Masyarakat', EN: 'Community Group' } },
];

export const mitraList = [
    {
        id: 1,
        name: 'Yenmankankan Homestay',
        category: 'homestay',
        location: { ID: 'Kepulauan Fam - Piaynemo', EN: 'Pam (Fam) Islands - Piaynemo' },
        rating: 4.5,
        reviews: 4,
        description: {
            ID: 'Tiga bungalow private di lokasi Piaynemo yang indah, strategis dekat atraksi Kepulauan Fam. Snorkeling dan manta di sekitar.',
            EN: 'Three private bungalows in an idyllic Piaynemo location, central to the attractions of the Pam Islands. Great snorkelling, and mantas nearby.',
        },
        image: '/images/Kepulauan Fam.webp',
        gallery: [
            '/images/Kepulauan Fam.webp',
            '/images/Foto 1-1 oleh Nikka Gunadharma.webp',
            '/images/Foto 1-2 oleh Nikka Gunadharma.webp',
        ],
    },
    {
        id: 2,
        name: 'Rissen Homestay',
        category: 'homestay',
        location: { ID: 'Batanta - Batanta', EN: 'Batanta - Batanta' },
        rating: 5,
        reviews: 23,
        description: {
            ID: 'Hutan dalam. Air terjun. Kasuari. Bungalow pantai. Terumbu karang vibran. Kehidupan yang menghilang di desa tradisional terpencil.',
            EN: 'Deep forest. Waterfalls. Cassowaries. Beach bungalow. Vibrant house reef. A vanishing way of life in a remote and completely traditionally built village.',
        },
        image: '/images/Foto 03 oleh Nikka Gunadharma.webp',
        gallery: [
            '/images/Foto 03 oleh Nikka Gunadharma.webp',
            '/images/Foto 2-1 oleh Nikka Gunadharma.webp',
            '/images/Foto 2-2 oleh Nikka Gunadharma.webp',
        ],
    },
    {
        id: 3,
        name: 'Mioskon Homestay',
        category: 'homestay',
        location: { ID: 'Selat Dampier - Mioskon', EN: 'Dampier Strait - Mioskon' },
        rating: 4,
        reviews: 12,
        description: {
            ID: 'Terletak di pulau kecil dekat Selat Dampier, menawarkan pengalaman snorkeling dan diving langsung dari dermaga.',
            EN: 'Located on a small island near Dampier Strait, offering snorkeling and diving experiences right from the jetty.',
        },
        image: '/images/Area III Selat Dampier.webp',
        gallery: [
            '/images/Area III Selat Dampier.webp',
            '/images/Foto 3-1.webp',
            '/images/Foto 3-2 oleh Nikka Gunadharma.webp',
        ],
    },
    {
        id: 4,
        name: 'Misool Eco Resort',
        category: 'resort',
        location: { ID: 'Kepulauan Misool - Misool Selatan', EN: 'Misool Islands - South Misool' },
        rating: 5,
        reviews: 45,
        description: {
            ID: 'Resor ramah lingkungan di jantung Misool, dikelilingi taman laut yang dilindungi dan laguna tersembunyi.',
            EN: 'An eco-friendly resort at the heart of Misool, surrounded by protected marine gardens and hidden lagoons.',
        },
        image: '/images/Area IV Kepulauan Misool.webp',
        gallery: [
            '/images/Area IV Kepulauan Misool.webp',
            '/images/Foto 4-1 oleh Nikka Gunadharma.webp',
            '/images/Foto 4-3 oleh Nikka Gunadharma.webp',
        ],
    },
    {
        id: 5,
        name: 'Raja Ampat Explorer',
        category: 'liveaboard',
        location: { ID: 'Raja Ampat - Seluruh Kawasan', EN: 'Raja Ampat - All Areas' },
        rating: 4.5,
        reviews: 31,
        description: {
            ID: 'Kapal liveaboard premium yang menjelajahi seluruh kawasan Raja Ampat, dari Misool hingga Wayag.',
            EN: 'Premium liveaboard vessel exploring the entire Raja Ampat region, from Misool to Wayag.',
        },
        image: '/images/Foto 5-1 oleh Nikka Gunadharma.webp',
        gallery: [
            '/images/Foto 5-1 oleh Nikka Gunadharma.webp',
            '/images/Foto 5-1 oleh Rens Lewerissa.webp',
            '/images/Foto 07 oleh Allan Ramandey.webp',
        ],
    },
    {
        id: 6,
        name: 'Kofiau Dive Liveaboard',
        category: 'liveaboard',
        location: { ID: 'Kepulauan Kofiau-Boo', EN: 'Kofiau-Boo Islands' },
        rating: 4,
        reviews: 8,
        description: {
            ID: 'Liveaboard khusus untuk menyelami perairan Kofiau dan Boo yang masih sangat alami.',
            EN: 'A liveaboard dedicated to diving the pristine waters of Kofiau and Boo.',
        },
        image: '/images/Area V Kepulauan Kofiau-Boo.webp',
        gallery: [
            '/images/Area V Kepulauan Kofiau-Boo.webp',
            '/images/Cagar Alam Laut Pulau Kofiau.webp',
            '/images/Foto 6-1 oleh Rens Lewerissa.webp',
        ],
    },
    {
        id: 7,
        name: 'Mayalibit Homestay',
        category: 'homestay',
        location: { ID: 'Teluk Mayalibit - Waigeo', EN: 'Mayalibit Bay - Waigeo' },
        rating: 4,
        reviews: 6,
        description: {
            ID: 'Homestay di tepi Teluk Mayalibit, menawarkan ketenangan dan pengalaman budaya masyarakat setempat.',
            EN: 'A homestay on the shores of Mayalibit Bay, offering tranquility and local cultural experiences.',
        },
        image: '/images/Area II Teluk Mayalibit.webp',
        gallery: [
            '/images/Area II Teluk Mayalibit.webp',
            '/images/Foto 6-3 oleh Rens Lewerissa.webp',
            '/images/Foto 7-2 oleh Nikka Gunadharma.webp',
        ],
    },
    {
        id: 8,
        name: 'Kelompok Kader Manta',
        category: 'masyarakat',
        location: { ID: 'Raja Ampat', EN: 'Raja Ampat' },
        rating: 5,
        reviews: 15,
        description: {
            ID: 'Kelompok perempuan lokal yang aktif menjaga kelestarian manta dan melakukan edukasi konservasi laut.',
            EN: 'A local women\'s group actively protecting manta rays and conducting marine conservation education.',
        },
        image: '/images/Foto 8-1 oleh Abdi Hasan.webp',
        gallery: [
            '/images/Foto 8-1 oleh Abdi Hasan.webp',
            '/images/Foto 8-4 oleh Abdi Hasan.webp',
            '/images/Foto 0-1.webp',
        ],
    },
    {
        id: 9,
        name: 'Waigeo Barat Homestay',
        category: 'homestay',
        location: { ID: 'Waigeo Sebelah Barat', EN: 'West Waigeo' },
        rating: 4.5,
        reviews: 9,
        description: {
            ID: 'Homestay dengan pemandangan laut terbuka di sisi barat Pulau Waigeo.',
            EN: 'A homestay with open sea views on the western side of Waigeo Island.',
        },
        image: '/images/Kepulauan Waigeo Sebelah Barat.webp',
        gallery: [
            '/images/Kepulauan Waigeo Sebelah Barat.webp',
            '/images/Foto 2-4 oleh Yakonias Thonak.webp',
            '/images/Foto 1-4 oleh Nikka Gunadharma.webp',
        ],
    },
    {
        id: 10,
        name: 'Misool Utara Dive Resort',
        category: 'resort',
        location: { ID: 'Misool Utara', EN: 'North Misool' },
        rating: 4.5,
        reviews: 18,
        description: {
            ID: 'Resor selam di Misool Utara dengan akses langsung ke situs penyelaman kelas dunia.',
            EN: 'A dive resort in North Misool with direct access to world-class dive sites.',
        },
        image: '/images/Area VII Misool Utara.webp',
        gallery: [
            '/images/Area VII Misool Utara.webp',
            '/images/Foto 03 oleh Frivon Rumbewas.webp',
            '/images/Foto 2-1 oleh Nikka Gunadharma.webp',
        ],
    },
];
