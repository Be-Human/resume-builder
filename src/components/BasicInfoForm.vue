<template>
  <div class="basic-info-form">
    <h3>基本信息</h3>
    <div class="avatar-upload">
      <div class="avatar-preview" v-if="localData.avatar">
        <img :src="localData.avatar" alt="头像预览" />
        <button class="avatar-remove" @click="removeAvatar">×</button>
      </div>
      <div class="avatar-placeholder" v-else @click="triggerUpload">
        <span class="avatar-icon">+</span>
        <span class="avatar-text">上传头像</span>
      </div>
      <input
        type="file"
        ref="avatarInput"
        accept="image/*"
        @change="handleAvatarUpload"
        style="display: none"
      />
    </div>
    <div class="form-group">
      <label>姓名</label>
      <input 
        type="text" 
        v-model="localData.name" 
        placeholder="请输入姓名"
      />
    </div>
    <div class="form-group">
      <label>职位</label>
      <input 
        type="text" 
        v-model="localData.position" 
        placeholder="请输入期望职位"
      />
    </div>
    <div class="form-group">
      <label>电话</label>
      <input 
        type="tel" 
        v-model="localData.phone" 
        placeholder="请输入联系电话"
        :class="{ 'input-error': phoneError }"
        @blur="validatePhone"
      />
      <div v-if="phoneError" class="error-message">{{ phoneError }}</div>
    </div>
    <div class="form-group">
      <label>邮箱</label>
      <input 
        type="email" 
        v-model="localData.email" 
        placeholder="请输入邮箱地址"
        :class="{ 'input-error': emailError }"
        @blur="validateEmail"
      />
      <div v-if="emailError" class="error-message">{{ emailError }}</div>
    </div>
    <div class="form-group">
      <label>所在地</label>
      <input 
        type="text" 
        v-model="localData.location" 
        placeholder="请输入所在城市"
      />
    </div>
    <div class="form-group">
      <label>个人简介</label>
      <textarea 
        v-model="localData.summary" 
        placeholder="请输入个人简介"
        rows="4"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { watch, reactive, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const localData = reactive({ ...props.modelValue })
const phoneError = ref('')
const emailError = ref('')
const avatarInput = ref(null)

const phoneRegex = /^1[3-9]\d{9}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validatePhone = () => {
  if (!localData.phone) {
    phoneError.value = ''
    return true
  }
  if (!phoneRegex.test(localData.phone)) {
    phoneError.value = '请输入正确的手机号格式（如：13800138000）'
    return false
  }
  phoneError.value = ''
  return true
}

const validateEmail = () => {
  if (!localData.email) {
    emailError.value = ''
    return true
  }
  if (!emailRegex.test(localData.email)) {
    emailError.value = '请输入正确的邮箱格式（如：example@email.com）'
    return false
  }
  emailError.value = ''
  return true
}

watch(localData, (newValue) => {
  emit('update:modelValue', { ...newValue })
  if (phoneError.value) validatePhone()
  if (emailError.value) validateEmail()
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  Object.assign(localData, newValue)
}, { deep: true })

const triggerUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    localData.avatar = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeAvatar = () => {
  localData.avatar = ''
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}
</script>

<style scoped>
.avatar-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-remove {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff4d4f;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-preview:hover .avatar-remove {
  opacity: 1;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.avatar-placeholder:hover {
  border-color: #4a90e2;
}

.avatar-icon {
  font-size: 32px;
  color: #999;
  line-height: 1;
}

.avatar-text {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.basic-info-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.input-error {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

textarea {
  resize: vertical;
  font-family: inherit;
}
</style>
