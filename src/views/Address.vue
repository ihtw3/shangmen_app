<template>
  <div class="page-container">
    <header class="header">
      <button class="back-btn" @click="goBack">
        <ArrowLeft :size="20" />
      </button>
      <h1 class="header-title">地址管理</h1>
      <button class="add-btn" @click="showAddModal = true">
        <Plus :size="20" />
      </button>
    </header>

    <main class="content">
      <div v-if="loading" class="loading">
        <Loader2 :size="32" class="spin" />
      </div>

      <div v-else-if="addresses.length === 0" class="empty-state">
        <MapPin :size="60" />
        <p>暂无收货地址</p>
        <button class="add-btn-large" @click="showAddModal = true">
          <Plus :size="20" /> 添加地址
        </button>
      </div>

      <div v-else class="address-list">
        <div v-for="addr in addresses" :key="addr.id" class="address-item">
          <div class="address-header">
            <span class="name">{{ addr.name }}</span>
            <span class="phone">{{ addr.phone }}</span>
            <span v-if="addr.is_default" class="default-tag">默认</span>
          </div>
          <p class="address-text">{{ addr.address }}</p>
          <div class="address-actions">
            <button class="action-btn edit" @click="editAddress(addr)">
              <Edit :size="16" /> 编辑
            </button>
            <button class="action-btn delete" @click="deleteAddress(addr.id)">
              <Trash2 :size="16" /> 删除
            </button>
            <button v-if="!addr.is_default" class="action-btn default" @click="setDefault(addr.id)">
              <Star :size="16" /> 设为默认
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showAddModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingAddress ? '编辑地址' : '添加地址' }}</h3>
          <button class="close-btn" @click="closeModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>姓名</label>
            <input v-model="form.name" type="text" placeholder="请输入姓名" />
          </div>
          <div class="form-group">
            <label>电话</label>
            <input v-model="form.phone" type="tel" placeholder="请输入电话" />
          </div>
          <div class="form-group">
            <label>地址</label>
            <textarea v-model="form.address" placeholder="请输入详细地址"></textarea>
          </div>
          <div class="form-group checkbox-group">
            <input v-model="form.is_default" type="checkbox" id="is_default" />
            <label for="is_default">设为默认地址</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">取消</button>
          <button class="btn-confirm" @click="saveAddress">确认</button>
        </div>
      </div>
    </div>

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
import { ref, onMounted, reactive } from 'vue'
import { 
  ArrowLeft, Plus, MapPin, Loader2, Edit, Trash2, Star, X, Home, FileText, UserCircle 
} from 'lucide-vue-next'
import { getAddresses, addAddress, updateAddress, deleteAddress as deleteAddr } from '../utils/api'
import { getUsername } from '../utils/storage'

const loading = ref(true)
const addresses = ref([])
const showAddModal = ref(false)
const editingAddress = ref(null)

const form = reactive({
  name: '',
  phone: '',
  address: '',
  is_default: false
})

async function loadAddresses() {
  loading.value = true
  try {
    const username = getUsername()
    const result = await getAddresses(username)
    if (result.success) {
      addresses.value = result.data || []
    }
  } catch (error) {
    console.error('加载地址失败:', error)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  editingAddress.value = null
  resetForm()
  showAddModal.value = true
}

function editAddress(addr) {
  editingAddress.value = addr
  form.name = addr.name
  form.phone = addr.phone
  form.address = addr.address
  form.is_default = addr.is_default === '1' || addr.is_default === true
  showAddModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingAddress.value = null
  resetForm()
}

function resetForm() {
  form.name = ''
  form.phone = ''
  form.address = ''
  form.is_default = false
}

async function saveAddress() {
  if (!form.name || !form.phone || !form.address) {
    alert('请填写完整信息')
    return
  }

  try {
    const data = {
      ...form,
      username: getUsername(),
      is_default: form.is_default ? '1' : '0'
    }

    if (editingAddress.value) {
      await updateAddress(editingAddress.value.id, data)
    } else {
      await addAddress(data)
    }

    closeModal()
    await loadAddresses()
    alert(editingAddress.value ? '修改成功' : '添加成功')
  } catch (error) {
    alert('操作失败')
    console.error('保存地址失败:', error)
  }
}

async function deleteAddress(id) {
  if (!confirm('确定要删除这个地址吗？')) return

  try {
    await deleteAddr(id)
    await loadAddresses()
    alert('删除成功')
  } catch (error) {
    alert('删除失败')
    console.error('删除地址失败:', error)
  }
}

async function setDefault(id) {
  try {
    const addr = addresses.value.find(a => a.id === id)
    if (addr) {
      await updateAddress(id, {
        ...addr,
        is_default: '1',
        username: getUsername()
      })
      await loadAddresses()
      alert('设置成功')
    }
  } catch (error) {
    alert('设置失败')
    console.error('设置默认地址失败:', error)
  }
}

function goBack() {
  window.history.back()
}

function goToIndex() {
  window.location.href = '/index'
}

function goToOrders() {
  window.location.href = '/orders'
}

onMounted(() => {
  loadAddresses()
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

.back-btn, .add-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.content {
  padding-top: 70px;
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.add-btn-large {
  margin-top: 20px;
  padding: 12px 30px;
  background: #00a8ff;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-list {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-item {
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.name {
  font-weight: 600;
  font-size: 15px;
}

.phone {
  font-size: 14px;
  color: #666;
}

.default-tag {
  background: #00a8ff;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: auto;
}

.address-text {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 15px;
}

.address-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.action-btn.edit {
  background: #f5f5f5;
  color: #333;
}

.action-btn.delete {
  background: #fff2f0;
  color: #ff6b6b;
}

.action-btn.default {
  background: #fff7e6;
  color: #fa8c16;
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
  max-height: 80vh;
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
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.form-group input, .form-group textarea {
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

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-group input {
  width: auto;
}

.modal-footer {
  display: flex;
  gap: 15px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background: #00a8ff;
  color: white;
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
