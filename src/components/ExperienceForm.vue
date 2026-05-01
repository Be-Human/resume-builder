<template>
  <div class="experience-form">
    <h3>工作经验</h3>
    <div 
      v-for="(exp, index) in localData" 
      :key="exp.id" 
      class="experience-item"
    >
      <div class="item-header">
        <span class="item-number">{{ index + 1 }}</span>
        <button 
          v-if="localData.length > 1"
          class="remove-btn"
          @click="confirmRemove(exp.id)"
        >
          删除
        </button>
      </div>
      <div class="form-group">
        <label>公司名称</label>
        <input 
          type="text" 
          v-model="exp.company" 
          placeholder="请输入公司名称"
        />
      </div>
      <div class="form-group">
        <label>职位</label>
        <input 
          type="text" 
          v-model="exp.position" 
          placeholder="请输入职位名称"
        />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>开始时间</label>
          <input 
            type="month" 
            v-model="exp.startDate"
          />
        </div>
        <div class="form-group">
          <label>结束时间</label>
          <input 
            type="month" 
            v-model="exp.endDate"
          />
        </div>
      </div>
      <div class="form-group">
        <label>工作描述</label>
        <textarea 
          v-model="exp.description" 
          placeholder="请输入工作内容和成就"
          rows="4"
        ></textarea>
      </div>
    </div>
    <button class="add-btn" @click="addExperience">
      + 添加工作经验
    </button>
  </div>
</template>

<script setup>
import { watch, reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'add', 'remove'])

const localData = reactive([...props.modelValue])

watch(localData, (newValue) => {
  emit('update:modelValue', [...newValue])
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  localData.splice(0, localData.length, ...newValue)
}, { deep: true })

const addExperience = () => {
  emit('add')
}

const confirmRemove = (id) => {
  if (confirm('确定要删除这条工作经验吗？此操作不可恢复。')) {
    emit('remove', id)
  }
}
</script>

<style scoped>
.experience-form {
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

.experience-item {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #eee;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-number {
  font-weight: 600;
  color: #4a90e2;
}

.remove-btn {
  padding: 4px 12px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.3s;
}

.remove-btn:hover {
  background: #ff7875;
}

.form-group {
  margin-bottom: 12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

.add-btn {
  width: 100%;
  padding: 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #357abd;
}
</style>
