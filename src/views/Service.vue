<template>
  <div class="page-container">
    <header class="header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="header-title">{{ serviceInfo.name }}</h1>
      <div class="placeholder"></div>
    </header>

    <main class="content">
      <div class="service-banner">
        <component :is="serviceInfo.icon" :size="60" />
        <h2>{{ serviceInfo.name }}</h2>
        <p>{{ serviceInfo.description }}</p>
      </div>

      <div class="form-section">
        <h3>服务信息</h3>
        
        <div class="form-group">
          <label>选择地址</label>
          <div class="address-select">
            <div v-if="selectedAddress" class="selected-address">
              {{ selectedAddress.name }} {{ selectedAddress.phone }}
              <p>{{ selectedAddress.address }}</p>
            </div>
            <button v-else class="add-address-btn" @click="goToAddress">
              <MapPin :size="18" /> 添加地址
            </button>
            <button v-if="addresses.length > 0" class="change-address-btn" @click="showAddressModal = true">
              <ChevronDown :size="18" />
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>联系电话</label>
          <input v-model="form.phone" type="tel" placeholder="请输入联系电话" />
        </div>

        <div class="form-group">
          <label>服务时间</label>
          <select v-model="form.time">
            <option value="">请选择服务时间</option>
            <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>服务时长</label>
          <div class="duration-options">
            <button 
              v-for="opt in durationOptions" 
              :key="opt.value"
              :class="['duration-btn', { active: form.duration === opt.value }]"
              @click="form.duration = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>备注</label>
          <textarea v-model="form.remark" placeholder="请输入备注信息"></textarea>
        </div>
      </div>

      <div class="price-section">
        <div class="price-item">
          <span>服务费用</span>
          <span class="price">¥{{ currentPrice }}</span>
        </div>
        <div class="price-item">
          <span>预计时长</span>
          <span>{{ form.duration || '--' }}</span>
        </div>
      </div>
    </main>

    <div class="bottom-bar">
      <div class="total-price">
        <span>合计：</span>
        <span class="amount">¥{{ currentPrice }}</span>
      </div>
      <button class="submit-btn" @click="submitOrder">提交订单</button>
    </div>

    <div v-if="showAddressModal" class="modal" @click.self="showAddressModal = false">
      <div class="modal-content address-modal">
        <div class="modal-header">
          <h3>选择地址</h3>
          <button class="close-btn" @click="showAddressModal = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div 
            v-for="addr in addresses" 
            :key="addr.id"
            :class="['address-option', { selected: selectedAddress?.id === addr.id }]"
            @click="selectAddress(addr)"
          >
            <div class="address-radio">
              <Check v-if="selectedAddress?.id === addr.id" :size="16" />
            </div>
            <div class="address-info">
              <div class="address-header">
                <span>{{ addr.name }} {{ addr.phone }}</span>
                <span v-if="addr.is_default" class="default-tag">默认</span>
              </div>
              <p>{{ addr.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { 
  ArrowLeft, MapPin, ChevronDown, X, Check,
  ChefHat, Cat, Flower2, Sparkles, Wrench, Wifi, Palette, Car, Sofa
} from 'lucide-vue-next'
import { createOrder, getAddresses } from '../utils/api'
import { getUsername } from '../utils/storage'

const route = {
  params: {
    type: window.location.pathname.split('/').pop() || 'cooking'
  }
}

const serviceInfo = computed(() => {
  const services = {
    cooking: { name: '上门做饭', description: '专业厨师上门服务，为您烹制美味佳肴', icon: ChefHat, basePrice: 99 },
    pet: { name: '上门喂宠', description: '专业宠物护理，让您的宠物得到悉心照料', icon: Cat, basePrice: 50 },
    flower: { name: '上门浇花', description: '专业园艺师上门，呵护您的花草植物', icon: Flower2, basePrice: 30 },
    cleaning: { name: '上门保洁', description: '专业保洁团队，让您的家焕然一新', icon: Sparkles, basePrice: 120 },
    repair: { name: '上门维修', description: '专业维修技师，快速解决家电故障', icon: Wrench, basePrice: 80 },
    network: { name: '网络安装', description: '专业网络工程师，为您搭建高速网络', icon: Wifi, basePrice: 100 },
    decoration: { name: '上门装修', description: '专业装修团队，打造理想家居空间', icon: Palette, basePrice: 500 },
    carwash: { name: '上门洗车', description: '专业洗车服务，让您的爱车焕然一新', icon: Car, basePrice: 60 },
    furniture: { name: '家具组装', description: '专业组装团队，轻松组装各类家具', icon: Sofa, basePrice: 150 }
  }
  return services[route.params.type] || services.cooking
})

const timeOptions = [
  '今天 上午 9:00-12:00',
  '今天 下午 14:00-18:00',
  '明天 上午 9:00-12:00',
  '明天 下午 14:00-18:00',
  '周末 上午 9:00-12:00',
  '周末 下午 14:00-18:00'
]

const durationOptions = [
  { label: '1小时', value: '1小时', price: 0 },
  { label: '2小时', value: '2小时', price: 50 },
  { label: '3小时', value: '3小时', price: 100 },
  { label: '全天', value: '全天', price: 200 }
]

const addresses = ref([])
const selectedAddress = ref(null)
const showAddressModal = ref(false)

const form = reactive({
  phone: '',
  time: '',
  duration: '2小时',
  remark: ''
})

const currentPrice = computed(() => {
  const base = serviceInfo.value.basePrice
  const durationOpt = durationOptions.find(d => d.value === form.duration)
  return base + (durationOpt?.price || 0)
})

async function loadAddresses() {
  try {
    const username = getUsername()
    const result = await getAddresses(username)
    if (result.success && result.data) {
      addresses.value = result.data
      const defaultAddr = result.data.find(a => a.is_default === '1' || a.is_default === true)
      if (defaultAddr) {
        selectedAddress.value = defaultAddr
        form.phone = defaultAddr.phone
      }
    }
  } catch (error) {
    console.error('加载地址失败:', error)
  }
}

function selectAddress(addr) {
  selectedAddress.value = addr
  form.phone = addr.phone
  showAddressModal.value = false
}

function goToAddress() {
  window.location.href = `/address?back=/service/${route.params.type}`
}

async function submitOrder() {
  if (!selectedAddress.value) {
    alert('请选择服务地址')
    return
  }
  if (!form.phone) {
    alert('请填写联系电话')
    return
  }
  if (!form.time) {
    alert('请选择服务时间')
    return
  }

  try {
    const orderData = {
      serviceType: route.params.type,
      price: currentPrice.value,
      address: selectedAddress.value.address,
      phone: form.phone,
      username: getUsername(),
      details: JSON.stringify({
        time: form.time,
        duration: form.duration,
        remark: form.remark,
        contactName: selectedAddress.value.name
      })
    }

    const result = await createOrder(orderData)
    if (result.success) {
      alert('订单提交成功')
      window.location.href = '/orders'
    } else {
      alert(result.message || '提交失败')
    }
  } catch (error) {
    alert('提交失败，请检查网络连接')
    console.error('提交订单失败:', error)
  }
}

function goBack() {
  window.history.back()
}

onMounted(() => {
  loadAddresses()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
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

.service-banner {
  background: linear-gradient(135deg, #00a8ff, #0066cc);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.service-banner h2 {
  margin-top: 15px;
  font-size: 24px;
  margin-bottom: 10px;
}

.service-banner p {
  opacity: 0.9;
  font-size: 14px;
}

.form-section {
  margin: 15px;
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.form-group textarea {
  height: 80px;
  resize: none;
}

.address-select {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-address {
  flex: 1;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 13px;
}

.selected-address p {
  margin-top: 5px;
  color: #666;
}

.add-address-btn, .change-address-btn {
  padding: 12px;
  background: #00a8ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.change-address-btn {
  background: #f5f5f5;
  color: #666;
}

.duration-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.duration-btn {
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.duration-btn.active {
  background: #00a8ff;
  color: white;
  border-color: #00a8ff;
}

.price-section {
  margin: 15px;
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.price-item:last-child {
  border-bottom: none;
}

.price-item .price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.total-price {
  font-size: 16px;
}

.total-price .amount {
  font-size: 24px;
  font-weight: 600;
  color: #ff6b6b;
}

.submit-btn {
  padding: 14px 30px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 100%;
  border-radius: 20px 20px 0 0;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 15px 20px 20px;
}

.address-option {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
}

.address-option:hover {
  background: #fafafa;
}

.address-option.selected {
  background: #e6f7ff;
}

.address-radio {
  width: 24px;
  height: 24px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00a8ff;
}

.address-option.selected .address-radio {
  background: #00a8ff;
  border-color: #00a8ff;
  color: white;
}

.address-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.default-tag {
  font-size: 12px;
  color: #00a8ff;
}

.address-info p {
  font-size: 13px;
  color: #666;
}
</style>
