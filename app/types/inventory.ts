export type Kategori = 'Elektronik' | 'Furniture' | 'ATK' | 'Perlengkapan Kantor' | 'Lainnya'
export type Kondisi = 'Baik' | 'Rusak Ringan' | 'Rusak Berat'

export interface InventoryItem {
    id: string
    namaBarang: string
    kategori: Kategori
    jumlah: number
    kondisi: Kondisi
    lokasi: string
    tanggalInventaris: string
    keterangan: string
    createdAt: string
    updatedAt: string
}

export interface InventoryStats {
    total: number
    totalJumlah: number
    baik: number
    rusakRingan: number
    rusakBerat: number
}

export interface CategoryStats {
    kategori: Kategori
    count: number
    jumlah: number
}

export interface ConditionStats {
    kondisi: Kondisi
    count: number
    jumlah: number
}
