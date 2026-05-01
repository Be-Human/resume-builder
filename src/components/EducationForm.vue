<template>
  <div class="education-form">
    <h3>教育经历</h3>
    <div 
      v-for="(edu, index) in localData" 
      :key="edu.id" 
      class="education-item"
      :class="{ 'dragging': draggedIndex === index, 'drag-over': dragOverIndex === index }"
    >
      <div class="drag-handle" draggable="true" @dragstart="onDragStart(index, $event)" @dragend="onDragEnd">
        <svg class="drag-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="9" cy="18" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="18" r="1.5" fill="currentColor"/>
        </svg>
      </div>
      <div class="item-content" @dragover.prevent="onDragOver(index)" @drop="onDrop(index)">
        <div class="item-header">
          <span class="item-number">{{ index + 1 }}</span>
          <button 
            v-if="localData.length > 1"
            class="remove-btn"
            @click="confirmRemove(edu.id)"
          >
            删除
          </button>
        </div>
        <div class="form-group">
          <label>学校名称</label>
          <input 
            type="text" 
            v-model="edu.school" 
            placeholder="请输入学校名称"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>学历</label>
            <input 
              type="text" 
              v-model="edu.degree" 
              placeholder="如：本科"
            />
          </div>
          <div class="form-group">
            <label>专业</label>
            <input 
              type="text" 
              v-model="edu.major" 
              placeholder="请输入专业"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>开始时间</label>
            <input 
              type="month" 
              v-model="edu.startDate"
            />
          </div>
          <div class="form-group">
            <label>结束时间</label>
            <input 
              type="month" 
              v-model="edu.endDate"
            />
          </div>
        </div>
        <div class="form-group">
          <label>描述</label>
          <textarea 
            v-model="edu.description" 
            placeholder="请输入教育经历描述（可选）"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
    <button class="add-btn" @click="addEducation">
      + 添加教育经历
    </button>
  </div>
</template>

<script setup>
import { watch, reactive, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'add', 'remove'])

const localData = reactive([...props.modelValue])
const draggedIndex = ref(null)
const dragOverIndex = ref(null)

watch(localData, (newValue) => {
  emit('update:modelValue', [...newValue])
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  localData.splice(0, localData.length, ...newValue)
}, { deep: true })

const addEducation = () => {
  emit('add')
}

const confirmRemove = (id) => {
  if (confirm('确定要删除这条教育经历吗？此操作不可恢复。')) {
    emit('remove', id)
  }
}

const onDragStart = (index, event) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  document.body.style.cursor = 'grabbing'
}

const onDragOver = (index) => {
  dragOverIndex.value = index
}

const onDrop = (dropIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return
  
  const draggedItem = localData.splice(draggedIndex.value, 1)[0]
  localData.splice(dropIndex, 0, draggedItem)
  draggedIndex.value = null
  dragOverIndex.value = null
  document.body.style.cursor = ''
}

const onDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
  document.body.style.cursor = ''
}
</script>

<style scoped>
.education-form {
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

.education-item {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 2px solid transparent;
  display: flex;
  gap: 12px;
  transition: opacity 0.2s, border-color 0.2s;
  position: relative;
}

.education-item.dragging {
  opacity: 0.5;
  border-color: #4a90e2;
}

.education-item.drag-over::before {
  content: '';
  position: absolute;
  left: -2px;
  right: -2px;
  top: -8px;
  height: 4px;
  background: linear-gradient(90deg, #4a90e2, #667eea);
  border-radius: 2px;
  animation: pulse 1s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  cursor: grab;
  color: #999;
  user-select: none;
  background: #eee;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.drag-handle:hover {
  background: #ddd;
  color: #666;
}

.drag-handle:active {
  cursor: grabbing;
  background: #ccc;
  color: #4a90e2;
}

.drag-icon {
  width: 20px;
  height: 24px;
}

.item-content {
  flex: 1;
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
