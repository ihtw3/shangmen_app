<template>
  <div class="page-container">
    <header class="header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="header-title">个人中心</h1>
      <div class="placeholder"></div>
    </header>

    <main class="content">
      <div class="user-card">
        <div class="avatar">
          <UserCircle :size="60" />
        </div>
        <div class="user-info">
          <h2>{{ username }}</h2>
          <p>欢迎来到上门服务</p>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goToOrders">
          <div class="menu-icon order">
            <FileText :size="20" />
          </div>
          <span>我的订单</span>
          <ChevronRight :size="18" />
        </div>
        <div class="menu-item" @click="goToAddress">
          <div class="menu-icon address">
            <MapPin :size="20" />
          </div>
          <span>地址管理</span>
          <ChevronRight :size="18" />
        </div>
        <div class="menu-item">
          <div class="menu-icon setting">
            <Settings :size="20" />
          </div>
          <span>设置</span>
          <ChevronRight :size="18" />
        </div>
        <div class="menu-item">
          <div class="menu-icon help">
            <HelpCircle :size="20" />
          </div>
          <span>帮助中心</span>
          <ChevronRight :size="18" />
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item logout" @click="handleLogout">
          <div class="menu-icon exit">
            <LogOut :size="20" />
          </div>
          <span>退出登录</span>
        </div>
      </div>
    </main>

    <nav class="tab-bar">
      <button class="tab-item" @click="goToIndex">
        <Home :size="22" />
        <span>首页</span>
      </button>
      <button class="tab-item" @click="goToOrders">
        <FileText :size="22" />
        <span>订单</span>
      </button>
      <button class="tab-item active">
        <UserCircle :size="22" />
        <span>我的</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ArrowLeft, UserCircle, FileText, MapPin, Settings, HelpCircle, LogOut,
  ChevronRight, Home
} from 'lucide-vue-next'
import { getUsername, clearLoginInfo } from '../utils/storage'

const username = ref('')

onMounted(() => {
  username.value = getUsername() || '用户'
})

function goBack() {
  window.history.back()
}

function goToOrders() {
  window.location.href = '/orders'
}

function goToAddress() {
  window.location.href = '/address'
}

function goToIndex() {
  window.location.href = '/index'
}

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    clearLoginInfo()
    window.location.href = '/login'
  }
}
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

.user-card {
  background: linear-gradient(135deg, #00a8ff, #0066cc);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.user-info {
  color: white;
}

.user-info h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.user-info p {
  font-size: 14px;
  opacity: 0.8;
}

.menu-section {
  margin: 15px;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  color: #333;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #fafafa;
}

.menu-item.logout {
  color: #ff6b6b;
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  color: white;
}

.menu-icon.order {
  background: #ff6b6b;
}

.menu-icon.address {
  background: #52c41a;
}

.menu-icon.setting {
  background: #1890ff;
}

.menu-icon.help {
  background: #722ed1;
}

.menu-icon.exit {
  background: #ff6b6b;
}

.menu-item span {
  flex: 1;
  font-size: 15px;
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
