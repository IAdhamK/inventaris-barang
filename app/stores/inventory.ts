import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { InventoryItem, Kategori, Kondisi, InventoryStats, CategoryStats, ConditionStats } from '~/types/inventory'

const STORAGE_KEY = 'inventory-items'

interface InventoryState {
    items: InventoryItem[]
    searchQuery: string
    filterKategori: Kategori | ''
    filterKondisi: Kondisi | ''
    editingItem: InventoryItem | null
    isFormOpen: boolean
}

export const useInventoryStore = defineStore('inventory', {
    state: (): InventoryState => ({
        items: [],
        searchQuery: '',
        filterKategori: '',
        filterKondisi: '',
        editingItem: null,
        isFormOpen: false
    }),

    getters: {
        filteredItems: (state): InventoryItem[] => {
            let result = [...state.items]

            // Search filter
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase()
                result = result.filter(item =>
                    item.namaBarang.toLowerCase().includes(query) ||
                    item.lokasi.toLowerCase().includes(query) ||
                    item.keterangan.toLowerCase().includes(query)
                )
            }

            // Category filter
            if (state.filterKategori) {
                result = result.filter(item => item.kategori === state.filterKategori)
            }

            // Condition filter
            if (state.filterKondisi) {
                result = result.filter(item => item.kondisi === state.filterKondisi)
            }

            // Sort by date (newest first)
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            return result
        },

        totalStats: (state): InventoryStats => {
            const items = state.items
            return {
                total: items.length,
                totalJumlah: items.reduce((sum, item) => sum + item.jumlah, 0),
                baik: items.filter(i => i.kondisi === 'Baik').reduce((sum, item) => sum + item.jumlah, 0),
                rusakRingan: items.filter(i => i.kondisi === 'Rusak Ringan').reduce((sum, item) => sum + item.jumlah, 0),
                rusakBerat: items.filter(i => i.kondisi === 'Rusak Berat').reduce((sum, item) => sum + item.jumlah, 0)
            }
        },

        statsByCategory: (state): CategoryStats[] => {
            const categories: Kategori[] = ['Elektronik', 'Furniture', 'ATK', 'Perlengkapan Kantor', 'Lainnya']
            return categories.map(kategori => ({
                kategori,
                count: state.items.filter(i => i.kategori === kategori).length,
                jumlah: state.items.filter(i => i.kategori === kategori).reduce((sum, item) => sum + item.jumlah, 0)
            }))
        },

        statsByCondition: (state): ConditionStats[] => {
            const conditions: Kondisi[] = ['Baik', 'Rusak Ringan', 'Rusak Berat']
            return conditions.map(kondisi => ({
                kondisi,
                count: state.items.filter(i => i.kondisi === kondisi).length,
                jumlah: state.items.filter(i => i.kondisi === kondisi).reduce((sum, item) => sum + item.jumlah, 0)
            }))
        }
    },

    actions: {
        loadFromStorage() {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY)
                if (stored) {
                    try {
                        this.items = JSON.parse(stored)
                    } catch (e) {
                        console.error('Failed to parse stored items:', e)
                        this.items = []
                    }
                }
            }
        },

        saveToStorage() {
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
            }
        },

        addItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) {
            const now = new Date().toISOString()
            const newItem: InventoryItem = {
                ...item,
                id: uuidv4(),
                createdAt: now,
                updatedAt: now
            }
            this.items.push(newItem)
            this.saveToStorage()
        },

        updateItem(id: string, updates: Partial<Omit<InventoryItem, 'id' | 'createdAt'>>) {
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) {
                this.items[index] = {
                    ...this.items[index],
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
                this.saveToStorage()
            }
        },

        deleteItem(id: string) {
            const index = this.items.findIndex(item => item.id === id)
            if (index !== -1) {
                this.items.splice(index, 1)
                this.saveToStorage()
            }
        },

        setSearchQuery(query: string) {
            this.searchQuery = query
        },

        setFilterKategori(kategori: Kategori | '') {
            this.filterKategori = kategori
        },

        setFilterKondisi(kondisi: Kondisi | '') {
            this.filterKondisi = kondisi
        },

        openForm(item?: InventoryItem) {
            this.editingItem = item || null
            this.isFormOpen = true
        },

        closeForm() {
            this.editingItem = null
            this.isFormOpen = false
        },

        clearFilters() {
            this.searchQuery = ''
            this.filterKategori = ''
            this.filterKondisi = ''
        }
    }
})
