<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">
        <Icon name="heroicons:table-cells" />
        Daftar Inventaris Barang
      </h3>
      <span class="badge badge-primary">{{ store.filteredItems.length }} item</span>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <div class="search-wrapper" style="flex: 1; min-width: 200px;">
        <Icon name="heroicons:magnifying-glass" class="search-icon" />
        <input
          :value="store.searchQuery"
          @input="store.setSearchQuery(($event.target as HTMLInputElement).value)"
          type="text"
          class="form-input"
          placeholder="Cari nama barang, lokasi..."
        />
      </div>

      <select
        :value="store.filterKategori"
        @change="store.setFilterKategori(($event.target as HTMLSelectElement).value as any)"
        class="form-select"
        style="width: auto; min-width: 160px;"
      >
        <option value="">Semua Kategori</option>
        <option v-for="kat in kategoriOptions" :key="kat" :value="kat">
          {{ kat }}
        </option>
      </select>

      <select
        :value="store.filterKondisi"
        @change="store.setFilterKondisi(($event.target as HTMLSelectElement).value as any)"
        class="form-select"
        style="width: auto; min-width: 140px;"
      >
        <option value="">Semua Kondisi</option>
        <option v-for="kon in kondisiOptions" :key="kon" :value="kon">
          {{ kon }}
        </option>
      </select>

      <button
        v-if="hasFilters"
        class="btn btn-secondary btn-sm"
        @click="store.clearFilters()"
      >
        <Icon name="heroicons:x-mark" />
        Reset
      </button>
    </div>

    <!-- Table -->
    <div class="table-wrapper" v-if="store.filteredItems.length > 0">
      <table class="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Jumlah</th>
            <th>Kondisi</th>
            <th>Lokasi</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in store.filteredItems"
            :key="item.id"
            class="animate-fade-in"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <strong>{{ item.namaBarang }}</strong>
              <div v-if="item.keterangan" class="text-muted" style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 2px;">
                {{ item.keterangan.substring(0, 50) }}{{ item.keterangan.length > 50 ? '...' : '' }}
              </div>
            </td>
            <td>
              <span class="badge badge-primary">{{ item.kategori }}</span>
            </td>
            <td>
              <strong>{{ item.jumlah }}</strong>
            </td>
            <td>
              <span :class="getConditionBadgeClass(item.kondisi)">
                {{ item.kondisi }}
              </span>
            </td>
            <td>{{ item.lokasi }}</td>
            <td>{{ formatDate(item.tanggalInventaris) }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-icon btn-secondary" @click="editItem(item)" title="Edit">
                  <Icon name="heroicons:pencil" />
                </button>
                <button class="btn btn-icon btn-danger" @click="confirmDelete(item)" title="Hapus">
                  <Icon name="heroicons:trash" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-state-icon">
        <Icon name="heroicons:archive-box-x-mark" />
      </div>
      <h4 class="empty-state-title">
        {{ store.items.length === 0 ? 'Belum Ada Data Inventaris' : 'Tidak Ada Hasil' }}
      </h4>
      <p class="empty-state-text">
        {{ store.items.length === 0
          ? 'Klik tombol "Tambah Barang" untuk menambahkan data inventaris baru.'
          : 'Tidak ada barang yang cocok dengan filter pencarian Anda.'
        }}
      </p>
      <button v-if="store.items.length === 0" class="btn btn-primary" style="margin-top: 1rem;" @click="store.openForm()">
        <Icon name="heroicons:plus" />
        Tambah Barang Pertama
      </button>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="deleteConfirm" class="modal-overlay" @click.self="deleteConfirm = null">
    <div class="modal animate-fade-in" style="max-width: 400px;">
      <div class="modal-header">
        <h3 class="modal-title" style="color: var(--color-danger);">
          <Icon name="heroicons:exclamation-triangle" />
          Konfirmasi Hapus
        </h3>
      </div>
      <div class="modal-body">
        <p>Apakah Anda yakin ingin menghapus barang <strong>{{ deleteConfirm.namaBarang }}</strong>?</p>
        <p style="color: var(--color-text-muted); font-size: 0.875rem; margin-top: 0.5rem;">Tindakan ini tidak dapat dibatalkan.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="deleteConfirm = null">
          Batal
        </button>
        <button class="btn btn-danger" @click="deleteItem">
          <Icon name="heroicons:trash" />
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '~/stores/inventory'
import type { InventoryItem, Kategori, Kondisi } from '~/types/inventory'

const store = useInventoryStore()

const kategoriOptions: Kategori[] = ['Elektronik', 'Furniture', 'ATK', 'Perlengkapan Kantor', 'Lainnya']
const kondisiOptions: Kondisi[] = ['Baik', 'Rusak Ringan', 'Rusak Berat']

const deleteConfirm = ref<InventoryItem | null>(null)

const hasFilters = computed(() => {
  return store.searchQuery || store.filterKategori || store.filterKondisi
})

const getConditionBadgeClass = (kondisi: Kondisi): string => {
  const classes: Record<Kondisi, string> = {
    'Baik': 'badge badge-success',
    'Rusak Ringan': 'badge badge-warning',
    'Rusak Berat': 'badge badge-danger'
  }
  return classes[kondisi]
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const editItem = (item: InventoryItem) => {
  store.openForm(item)
}

const confirmDelete = (item: InventoryItem) => {
  deleteConfirm.value = item
}

const deleteItem = () => {
  if (deleteConfirm.value) {
    store.deleteItem(deleteConfirm.value.id)
    deleteConfirm.value = null
  }
}
</script>
