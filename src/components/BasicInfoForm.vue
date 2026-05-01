<template>
  <div class="basic-info-form">
    <h3>基本信息</h3>
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
      />
    </div>
    <div class="form-group">
      <label>邮箱</label>
      <input 
        type="email" 
        v-model="localData.email" 
        placeholder="请输入邮箱地址"
      />
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
import { watch, reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const localData = reactive({ ...props.modelValue })

watch(localData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  Object.assign(localData, newValue)
}, { deep: true })
</script>

<style scoped>
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

textarea {
  resize: vertical;
  font-family: inherit;
}
</style>
