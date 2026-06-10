<template>
  <div class="page-container">
    <header class="header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="header-title">我的订单</h1>
      <div class="placeholder"></div>
    </header>

    <main class="content">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.value" :class="['tab-item', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="loading" class="loading">
        <Loader2 :size="32" class="spin" />
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <Package :size="60" />
        <p>暂无订单</p>
      </div>

      <div v-else class="order-list">
        <div v-for="order in orders" :key="order.order_id" class="order-item">
          <div class="order-header">
            <span class="order-id">订单号：{{ order.order_id }}</span>
            <span :class="['status', order.status]">{{ getStatusText(order.status) }}</span>
          </div>
          <div class="order-content">
            <div class="service-info">
              <div class="service-icon">
                <component :is="getServiceIcon(order.service_type)" :size="24" />
              </div>
              <div>
                <h3>{{ getServiceName(order.service_type) }}</h3>
                <p>{{ formatDate(order.created_at) }}</p>
              </div>
            </div>
            <div class="price">¥{{ order.price }}</div>
          </div>
          <div class="order-footer">
            <span>{{ order.address }}</span>
            <button class="action-btn" @click="handleOrderAction(order)">
              {{ getActionText(order.status) }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <nav class="tab-bar">
      <button class="tab-item" @click="goToIndex">
        <Home :size="22" />
        <span>首页</span>
      </button>
      <button class="tab-item active">
        <FileText :size="22" />
        <span>订单</span>
      </button>
      <button class="tab-item" @click="goToProfile">
        <UserCircle :size="22" />
        <span>我的</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  ArrowLeft, Loader2, Package, Home, FileText, UserCircle,
  ChefHat, Cat, Flower2, Sparkles, Wrench, Wifi, Palette, Car, Sofa
} from 'lucide-vue-next'
import { getOrders } from '../utils/api'
import { getUsername } from '../utils/storage'

const activeTab = ref('all')
const loading = ref(true)
const orders = ref([])

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '进行中', value: 'processing' },
  { label: '已完成', value: 'completed' }
]

const serviceIcons = {
  cooking: ChefHat,
  pet: Cat,
  flower: Flower2,
  cleaning: Sparkles,
  repair: Wrench,
  network: Wifi,
  decoration: Palette,
  carwash: Car,
  furniture: Sofa
}

const serviceNames = {
  cooking: '上门做饭',
  pet: '上门喂宠',
  flower: '上门浇花',
  cleaning: '上门保洁',
  repair: '上门维修',
  network: '网络安装',
  decoration: '上门装修',
  carwash: '上门洗车',
  furniture: '家具组装'
}

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(order => order.status === activeTab.value)
})

function getServiceIcon(type) {
  return serviceIcons[type] || ChefHat
}

function getServiceName(type) {
  return serviceNames[type] || '未知服务'
}

function getStatusText(status) {
  const statusMap = {
    pending: '待支付',
    processing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

function getActionText(status) {
  const actionMap = {
    pending: '去支付',
    processing: '联系服务',
    completed: '评价',
    cancelled: '重新下单'
  }
  return actionMap[status] || '查看'
}

function formatDate(dateStr) {
  return dateStr || '未知时间'
}

async function loadOrders() {
  loading.value = true
  try {
    const username = getUsername()
    const result = await getOrders(username)
    if (result.success) {
      orders.value = result.data || []
    }
  } catch (error) {
    console.error('加载订单失败:', error)
  } finally {
    loading.value = false
  }
}

function handleOrderAction(order) {
  alert(`订单 ${order.order_id}：${getActionText(order.status)}`)
}

function goBack() {
  window.history.back()
}

function goToIndex() {
  window.location.href = '/index'
}

function goToProfile() {
  window.location.href = '/profile'
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 70px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #00a8ff, #0066cc);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.back-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.placeholder {
  width: 30px;
}

.content {
  padding-top: 70px;
}

.tabs {
  display: flex;
  background: white;
  padding: 10px;
  gap: 10px;
}

.tab-item {
  flex: 1;
  padding: 10px;
  border: none;
  background: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  background: #00a8ff;
  color: white;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin-top: 15px;
  font-size: 14px;
}

.order-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  font-size: 12px;
  color: #999;
}

.status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
}

.status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.status.processing {
  background: #e6f7ff;
  color: #1890ff;
}

.status.completed {
  background: #f6ffed;
  color: #52c41a;
}

.status.cancelled {
  background: #f5f5f5;
  color: #999;
}

.order-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.service-info {
  display: flex;
  gap: 12px;
}

.service-icon {
  width: 40px;
  height: 40px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00a8ff;
}

.service-info h3 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.service-info p {
  font-size: 12px;
  color: #999;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b6b;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #fafafa;
  font-size: 12px;
  color: #666;
}

.action-btn {
  padding: 6px 15px;
  background: #00a8ff;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: #999;
  font-size: 12px;
}

.tab-item.active {
  color: #00a8ff;
}
</style>
