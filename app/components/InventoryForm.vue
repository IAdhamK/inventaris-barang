<template>
  <div v-if="store.isFormOpen" class="modal-overlay" @click.self="closeForm">
    <div class="modal animate-fade-in">
      <div class="modal-header">
        <h3 class="modal-title">
          <Icon :name="isEditing ? 'heroicons:pencil-square' : 'heroicons:plus-circle'" />
          {{ isEditing ? 'Edit Barang' : 'Tambah Barang Baru' }}
        </h3>
        <button class="btn btn-icon btn-secondary" @click="closeForm">
          <Icon name="heroicons:x-mark" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Nama Barang *</label>
            <input
              v-model="form.namaBarang"
              type="text"
              class="form-input"
              placeholder="Masukkan nama barang"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Kategori *</label>
              <select v-model="form.kategori" class="form-select" required>
                <option value="" disabled>Pilih kategori</option>
                <option v-for="kat in kategoriOptions" :key="kat" :value="kat">
                  {{ kat }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Kondisi *</label>
              <select v-model="form.kondisi" class="form-select" required>
                <option value="" disabled>Pilih kondisi</option>
                <option v-for="kon in kondisiOptions" :key="kon" :value="kon">
                  {{ kon }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Jumlah *</label>
              <input
                v-model.number="form.jumlah"
                type="number"
                class="form-input"
                placeholder="0"
                min="1"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Tanggal Inventaris *</label>
              <input
                v-model="form.tanggalInventaris"
                type="date"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi *</label>
            <input
              v-model="form.lokasi"
              type="text"
              class="form-input"
              placeholder="Contoh: Ruang Arsip Lantai 2"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Keterangan</label>
            <textarea
              v-model="form.keterangan"
              class="form-textarea"
              placeholder="Masukkan keterangan tambahan (opsional)"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeForm">
            Batal
          </button>
          <button type="submit" class="btn btn-primary">
            <Icon :name="isEditing ? 'heroicons:check' : 'heroicons:plus'" />
            {{ isEditing ? 'Simpan Perubahan' : 'Tambah Barang' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useInventoryStore } from '~/stores/inventory'
import type { Kategori, Kondisi } from '~/types/inventory'

const store = useInventoryStore()

const kategoriOptions: Kategori[] = ['Elektronik', 'Furniture', 'ATK', 'Perlengkapan Kantor', 'Lainnya']
const kondisiOptions: Kondisi[] = ['Baik', 'Rusak Ringan', 'Rusak Berat']

const defaultForm = () => ({
  namaBarang: '',
  kategori: '' as Kategori | '',
  jumlah: 1,
  kondisi: '' as Kondisi | '',
  lokasi: '',
  tanggalInventaris: new Date().toISOString().split('T')[0],
  keterangan: ''
})

const form = ref(defaultForm())

const isEditing = computed(() => !!store.editingItem)

watch(
  () => store.editingItem,
  (item) => {
    if (item) {
      form.value = {
        namaBarang: item.namaBarang,
        kategori: item.kategori,
        jumlah: item.jumlah,
        kondisi: item.kondisi,
        lokasi: item.lokasi,
        tanggalInventaris: item.tanggalInventaris,
        keterangan: item.keterangan
      }
    } else {
      form.value = defaultForm()
    }
  },
  { immediate: true }
)

watch(
  () => store.isFormOpen,
  (isOpen) => {
    if (!isOpen) {
      form.value = defaultForm()
    }
  }
)

const closeForm = () => {
  store.closeForm()
}

const handleSubmit = () => {
  if (!form.value.kategori || !form.value.kondisi) return

  if (isEditing.value && store.editingItem) {
    store.updateItem(store.editingItem.id, {
      namaBarang: form.value.namaBarang,
      kategori: form.value.kategori as Kategori,
      jumlah: form.value.jumlah,
      kondisi: form.value.kondisi as Kondisi,
      lokasi: form.value.lokasi,
      tanggalInventaris: form.value.tanggalInventaris,
      keterangan: form.value.keterangan
    })
  } else {
    store.addItem({
      namaBarang: form.value.namaBarang,
      kategori: form.value.kategori as Kategori,
      jumlah: form.value.jumlah,
      kondisi: form.value.kondisi as Kondisi,
      lokasi: form.value.lokasi,
      tanggalInventaris: form.value.tanggalInventaris,
      keterangan: form.value.keterangan
    })
  }

  closeForm()
}
</script>
