<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">
        <Icon name="heroicons:chart-bar" />
        Grafik Progres Inventaris
      </h2>
    </div>

    <div class="charts-grid">
      <!-- Pie Chart - Category Distribution -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">
            <Icon name="heroicons:chart-pie" />
            Distribusi per Kategori
          </h4>
        </div>
        <div class="chart-container">
          <Pie v-if="hasCategoryData" :data="categoryChartData" :options="pieOptions" />
          <div v-else class="empty-state" style="padding: 2rem;">
            <Icon name="heroicons:chart-pie" style="font-size: 48px; color: var(--color-text-muted);" />
            <p style="margin-top: 1rem; color: var(--color-text-muted);">Belum ada data</p>
          </div>
        </div>
      </div>

      <!-- Bar Chart - Condition Distribution -->
      <div class="card">
        <div class="card-header">
          <h4 class="card-title">
            <Icon name="heroicons:chart-bar-square" />
            Distribusi per Kondisi
          </h4>
        </div>
        <div class="chart-container">
          <Bar v-if="hasConditionData" :data="conditionChartData" :options="barOptions" />
          <div v-else class="empty-state" style="padding: 2rem;">
            <Icon name="heroicons:chart-bar-square" style="font-size: 48px; color: var(--color-text-muted);" />
            <p style="margin-top: 1rem; color: var(--color-text-muted);">Belum ada data</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { useInventoryStore } from '~/stores/inventory'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useInventoryStore()

const categoryColors = {
  'Elektronik': '#6366f1',
  'Furniture': '#8b5cf6',
  'ATK': '#06b6d4',
  'Perlengkapan Kantor': '#f472b6',
  'Lainnya': '#fbbf24'
}

const conditionColors = {
  'Baik': '#10b981',
  'Rusak Ringan': '#f59e0b',
  'Rusak Berat': '#ef4444'
}

const hasCategoryData = computed(() => {
  return store.statsByCategory.some(s => s.jumlah > 0)
})

const hasConditionData = computed(() => {
  return store.statsByCondition.some(s => s.jumlah > 0)
})

const categoryChartData = computed(() => ({
  labels: store.statsByCategory.map(s => s.kategori),
  datasets: [{
    data: store.statsByCategory.map(s => s.jumlah),
    backgroundColor: store.statsByCategory.map(s => categoryColors[s.kategori]),
    borderColor: 'transparent',
    borderWidth: 0,
    hoverOffset: 10
  }]
}))

const conditionChartData = computed(() => ({
  labels: store.statsByCondition.map(s => s.kondisi),
  datasets: [{
    label: 'Jumlah Barang',
    data: store.statsByCondition.map(s => s.jumlah),
    backgroundColor: store.statsByCondition.map(s => conditionColors[s.kondisi]),
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0
  }]
}))

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#9ca3af',
        font: {
          family: 'Inter',
          size: 12
        },
        padding: 15,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#f9fafb',
      bodyColor: '#9ca3af',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        family: 'Inter',
        size: 13,
        weight: 600
      },
      bodyFont: {
        family: 'Inter',
        size: 12
      }
    }
  }
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#f9fafb',
      bodyColor: '#9ca3af',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        family: 'Inter',
        size: 13,
        weight: 600
      },
      bodyFont: {
        family: 'Inter',
        size: 12
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#9ca3af',
        font: {
          family: 'Inter',
          size: 12
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#9ca3af',
        font: {
          family: 'Inter',
          size: 12
        },
        stepSize: 1
      }
    }
  }
}
</script>
