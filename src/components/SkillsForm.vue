<template>
  <div class="skills-form">
    <h3>技能标签</h3>
    <div class="input-wrapper">
      <input
        type="text"
        v-model="skillInput"
        @keyup.enter="addSkill"
        placeholder="输入技能名称后按回车添加"
      />
      <p class="error-hint" v-if="showError">{{ errorMessage }}</p>
    </div>
    <div class="tags-container">
      <span
        v-for="skill in localData"
        :key="skill.id"
        class="tag"
      >
        {{ skill.name }}
        <button class="tag-remove" @click="removeSkill(skill.id)">×</button>
      </span>
      <span class="hint" v-if="localData.length === 0">暂无技能标签，请在上方输入框添加</span>
    </div>
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

const emit = defineEmits(['update:modelValue'])

const skillInput = ref('')
const showError = ref(false)
const errorMessage = ref('')

const localData = reactive([...props.modelValue])

watch(localData, (newValue) => {
  emit('update:modelValue', [...newValue])
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  localData.splice(0, localData.length, ...newValue)
}, { deep: true })

const addSkill = () => {
  const name = skillInput.value.trim()
  if (!name) return
  
  const isDuplicate = localData.some(
    skill => skill.name.toLowerCase() === name.toLowerCase()
  )
  
  if (isDuplicate) {
    errorMessage.value = '该技能标签已存在'
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 2000)
    return
  }
  
  showError.value = false
  localData.push({
    id: Date.now(),
    name: name
  })
  skillInput.value = ''
}

const removeSkill = (id) => {
  const index = localData.findIndex(s => s.id === id)
  if (index > -1) {
    localData.splice(index, 1)
  }
}
</script>

<style scoped>
.skills-form {
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

.input-wrapper {
  margin-bottom: 16px;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #4a90e2;
}

.error-hint {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 6px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 40px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.tag-remove:hover {
  opacity: 1;
}

.hint {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 10px 0;
  width: 100%;
}
</style>