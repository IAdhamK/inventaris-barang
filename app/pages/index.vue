<template>
  <div class="page-wrapper">
    <div class="container">
      <!-- Header -->
      <header class="page-header">
        <div class="page-header-content">
          <div class="page-header-icon">
            <Icon name="heroicons:archive-box" />
          </div>
          <div>
            <h1>Inventaris Barang</h1>
            <p class="page-header-subtitle">Bagian Rumah Tangga dan Perlengkapan</p>
          </div>
        </div>
        <button class="btn btn-primary btn-lg" @click="store.openForm()">
          <Icon name="heroicons:plus" />
          Tambah Barang
        </button>
      </header>

      <!-- Stats Cards -->
      <div class="section">
        <div class="grid grid-cols-4">
          <div class="stat-card animate-fade-in">
            <div class="stat-card-icon primary">
              <Icon name="heroicons:cube" />
            </div>
            <div class="stat-card-value">{{ stats.totalJumlah }}</div>
            <div class="stat-card-label">Total Barang</div>
          </div>

          <div class="stat-card animate-fade-in" style="animation-delay: 0.1s;">
            <div class="stat-card-icon success">
              <Icon name="heroicons:check-circle" />
            </div>
            <div class="stat-card-value">{{ stats.baik }}</div>
            <div class="stat-card-label">Kondisi Baik</div>
          </div>

          <div class="stat-card animate-fade-in" style="animation-delay: 0.2s;">
            <div class="stat-card-icon warning">
              <Icon name="heroicons:exclamation-triangle" />
            </div>
            <div class="stat-card-value">{{ stats.rusakRingan }}</div>
            <div class="stat-card-label">Rusak Ringan</div>
          </div>

          <div class="stat-card animate-fade-in" style="animation-delay: 0.3s;">
            <div class="stat-card-icon danger">
              <Icon name="heroicons:x-circle" />
            </div>
            <div class="stat-card-value">{{ stats.rusakBerat }}</div>
            <div class="stat-card-label">Rusak Berat</div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <InventoryChart />

      <!-- Table -->
      <div class="section">
        <InventoryTable />
      </div>

      <!-- Form Modal -->
      <InventoryForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useInventoryStore } from '~/stores/inventory'

const store = useInventoryStore()

const stats = computed(() => store.totalStats)

onMounted(() => {
  store.loadFromStorage()
})
</script>
