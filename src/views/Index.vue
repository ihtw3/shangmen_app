<template>
  <div class="page-container">
    <header class="header">
      <div class="header-content">
        <h1 class="header-title">上门服务</h1>
        <div class="header-actions">
          <button class="action-btn" @click="showServiceModal = true">
            <Headphones :size="20" />
          </button>
          <button class="action-btn">
            <Bell :size="20" />
          </button>
          <button class="action-btn">
            <MapPin :size="20" />
          </button>
          <div class="user-menu">
            <button class="action-btn" @click="toggleUserMenu">
              <User :size="20" />
            </button>
            <div v-if="showUserMenu" class="dropdown-menu">
              <button class="dropdown-item" @click="goToProfile">
                <UserCircle :size="16" /> 个人中心
              </button>
              <button class="dropdown-item logout" @click="handleLogout">
                <LogOut :size="16" /> 退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="content">
      <div class="search-bar">
        <Search :size="18" class="search-icon" />
        <input type="text" placeholder="搜索服务..." class="search-input" />
      </div>

      <div class="banner">
        <img v-for="(img, index) in banners" :key="index" :src="img" alt="" />
      </div>

      <div class="services-section">
        <h2 class="section-title">服务分类</h2>
        <div class="services-grid">
          <button 
            v-for="service in services" 
            :key="service.type" 
            class="service-item"
            @click="goToService(service.type)"
          >
            <component :is="service.icon" :size="32" />
            <span>{{ service.name }}</span>
          </button>
        </div>
      </div>

      <div class="recommend-section">
        <h2 class="section-title">推荐服务</h2>
        <div class="recommend-list">
          <div v-for="item in recommendList" :key="item.id" class="recommend-item">
            <div class="recommend-image"></div>
            <div class="recommend-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <span class="price">{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <nav class="tab-bar">
      <button class="tab-item active">
        <Home :size="22" />
        <span>首页</span>
      </button>
      <button class="tab-item" @click="goToOrders">
        <FileText :size="22" />
        <span>订单</span>
      </button>
      <button class="tab-item" @click="goToProfile">
        <UserCircle :size="22" />
        <span>我的</span>
      </button>
    </nav>

    <div v-if="showServiceModal" class="modal" @click.self="showServiceModal = false">
      <div class="modal-content service-modal">
        <div class="modal-header">
          <h3>客服中心</h3>
          <button class="close-btn" @click="showServiceModal = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="service-info">
            <Phone :size="20" />
            <div>
              <span class="label">客服电话</span>
              <span class="value">400-123-4567</span>
            </div>
          </div>
          <div class="service-info">
            <MessageCircle :size="20" />
            <div>
              <span class="label">微信客服</span>
              <span class="value">shangmen_service</span>
            </div>
          </div>
          <div class="service-info">
            <Mail :size="20" />
            <div>
              <span class="label">邮箱</span>
              <span class="value">service@shangmen.com</span>
            </div>
          </div>
          <div class="service-info">
            <Clock :size="20" />
            <div>
              <span class="label">服务时间</span>
              <span class="value">9:00-18:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Headphones, Bell, MapPin, User, UserCircle, LogOut, Search, Home, FileText, X,
  Phone, MessageCircle, Mail, Clock, ChefHat, Cat, Flower2, Sparkles, Wrench, 
  Wifi, Palette, Car, Sofa
} from 'lucide-vue-next'
import { clearLoginInfo, getUsername } from '../utils/storage'

const showUserMenu = ref(false)
const showServiceModal = ref(false)

const banners = [
  'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Modern%20home%20service%20banner%20with%20clean%20design%20and%20professional%20look&image_size=landscape_16_9',
  'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Housekeeping%20service%20promotional%20banner%20clean%20modern%20style&image_size=landscape_16_9'
]

const services = [
  { type: 'cooking', name: '上门做饭', icon: ChefHat },
  { type: 'pet', name: '上门喂宠', icon: Cat },
  { type: 'flower', name: '上门浇花', icon: Flower2 },
  { type: 'cleaning', name: '上门保洁', icon: Sparkles },
  { type: 'repair', name: '上门维修', icon: Wrench },
  { type: 'network', name: '网络安装', icon: Wifi },
  { type: 'decoration', name: '上门装修', icon: Palette },
  { type: 'carwash', name: '上门洗车', icon: Car },
  { type: 'furniture', name: '家具组装', icon: Sofa }
]

const recommendList = [
  { id: 1, title: '家庭保洁套餐', desc: '全屋深度清洁，让家焕然一新', price: '¥99起' },
  { id: 2, title: '专业维修服务', desc: '家电维修，快速响应', price: '¥50起' },
  { id: 3, title: '精品家政服务', desc: '专业团队，品质保证', price: '¥129起' }
]

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function goToService(type) {
  window.location.href = `/service/${type}`
}

function goToOrders() {
  window.location.href = '/orders'
}

function goToProfile() {
  window.location.href = '/profile'
}

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    clearLoginInfo()
    window.location.href = '/login'
  }
}

console.log('当前用户:', getUsername())
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
}

.user-menu {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.dropdown-item {
  width: 100%;
  padding: 10px 15px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.logout {
  color: #ff6b6b;
  border-top: 1px solid #f0f0f0;
}

.content {
  padding-top: 70px;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  gap: 10px;
}

.search-icon {
  color: #999;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
}

.banner {
  padding: 15px;
}

.banner img {
  width: 100%;
  border-radius: 10px;
  height: 180px;
  object-fit: cover;
}

.services-section {
  background: white;
  margin: 10px;
  border-radius: 10px;
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
}

.service-item span {
  font-size: 12px;
}

.recommend-section {
  background: white;
  margin: 10px;
  border-radius: 10px;
  padding: 20px;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommend-item {
  display: flex;
  gap: 12px;
}

.recommend-image {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 8px;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recommend-info h3 {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.recommend-info p {
  font-size: 12px;
  color: #999;
}

.price {
  font-size: 16px;
  font-weight: 600;
  color: #ff6b6b;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  width: 90%;
  max-width: 320px;
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
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #00a8ff;
}

.service-info:last-child {
  border-bottom: none;
}

.service-info div {
  flex: 1;
}

.service-info .label {
  display: block;
  font-size: 12px;
  color: #999;
}

.service-info .value {
  display: block;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}
</style>
