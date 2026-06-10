<template>
  <div class="register-container">
    <div class="register-box">
      <h1>注册</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <User class="input-icon" :size="20" />
          <input 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名" 
            required 
          />
        </div>
        <div class="form-group">
          <Lock class="input-icon" :size="20" />
          <input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码" 
            required 
          />
          <button type="button" class="toggle-btn" @click="togglePassword">
            <Eye v-if="showPassword" :size="18" />
            <EyeOff v-else :size="18" />
          </button>
        </div>
        <div class="form-group">
          <Lock class="input-icon" :size="20" />
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="请再次输入密码" 
            required 
          />
          <button type="button" class="toggle-btn" @click="toggleConfirmPassword">
            <Eye v-if="showConfirmPassword" :size="18" />
            <EyeOff v-else :size="18" />
          </button>
        </div>
        <button type="submit" class="register-btn" :disabled="loading">
          <Loader2 v-if="loading" :size="18" class="spin" />
          <span>{{ loading ? '注册中...' : '注册' }}</span>
        </button>
      </form>
      <div class="login-link">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </div>

    <div v-if="showModal" class="modal" @click.self="showModal = false">
      <div class="modal-content">
        <div :class="['modal-icon', modalType]">
          <CheckCircle v-if="modalType === 'success'" :size="40" />
          <XCircle v-else :size="40" />
        </div>
        <p>{{ modalMessage }}</p>
        <button class="modal-btn" @click="showModal = false">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-vue-next'
import { register } from '../utils/api'
import { setLoginStatus, setUsername } from '../utils/storage'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const showModal = ref(false)
const modalMessage = ref('')
const modalType = ref('success')

function togglePassword() {
  showPassword.value = !showPassword.value
}

function toggleConfirmPassword() {
  showConfirmPassword.value = !showConfirmPassword.value
}

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    showModalMessage('两次输入的密码不一致', 'error')
    return
  }

  loading.value = true
  
  try {
    const result = await register(username.value, password.value)
    
    if (result.success) {
      setLoginStatus(true)
      setUsername(username.value)
      showModalMessage('注册成功', 'success')
      setTimeout(() => {
        window.location.href = '/index'
      }, 1000)
    } else {
      showModalMessage(result.message || '注册失败', 'error')
    }
  } catch (error) {
    showModalMessage('服务器连接失败', 'error')
  } finally {
    loading.value = false
  }
}

function showModalMessage(message, type) {
  modalMessage.value = message
  modalType.value = type
  showModal.value = true
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #00a8ff, #0066cc);
  padding: 20px;
}

.register-box {
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.register-box h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.form-group input {
  width: 100%;
  padding: 14px 15px 14px 45px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #00a8ff;
}

.toggle-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
}

.register-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00a8ff, #0066cc);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s;
}

.register-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #00a8ff;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
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
  padding: 30px;
  text-align: center;
  min-width: 280px;
}

.modal-icon {
  margin-bottom: 15px;
}

.modal-icon.success {
  color: #52c41a;
}

.modal-icon.error {
  color: #ff4d4f;
}

.modal-content p {
  color: #333;
  margin-bottom: 20px;
}

.modal-btn {
  padding: 10px 30px;
  background: #00a8ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.modal-btn:hover {
  background: #0088dd;
}
</style>
