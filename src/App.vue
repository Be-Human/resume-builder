<template>
  <div class="app-container">
    <header class="app-header">
      <h1>简历生成器</h1>
      <div class="header-actions">
        <button class="print-btn" @click="handlePrint">导出打印</button>
        <p>填写左侧表单，右侧实时预览简历效果</p>
      </div>
    </header>
    
    <main class="main-content">
      <div class="form-section">
        <BasicInfoForm v-model="resumeData.basicInfo" />
        <EducationForm 
          v-model="resumeData.education"
          @add="addEducation"
          @remove="removeEducation"
        />
        <ExperienceForm 
          v-model="resumeData.experience"
          @add="addExperience"
          @remove="removeExperience"
        />
        <SkillsForm v-model="resumeData.skills" />
      </div>
      
      <div class="preview-section">
        <div class="preview-header">
          <h2>简历预览</h2>
        </div>
        <div class="preview-container">
          <ResumePreview :resumeData="resumeData" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useResumeStore } from './store/resumeStore'
import BasicInfoForm from './components/BasicInfoForm.vue'
import EducationForm from './components/EducationForm.vue'
import ExperienceForm from './components/ExperienceForm.vue'
import SkillsForm from './components/SkillsForm.vue'
import ResumePreview from './components/ResumePreview.vue'

const { resumeData, addEducation, removeEducation, addExperience, removeExperience } = useResumeStore()

const STORAGE_KEY = 'resume-builder-data'

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
}

const loadFromStorage = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      Object.assign(resumeData.basicInfo, data.basicInfo || {})
      resumeData.education.splice(0, resumeData.education.length, ...(data.education || []))
      resumeData.experience.splice(0, resumeData.experience.length, ...(data.experience || []))
      resumeData.skills.splice(0, resumeData.skills.length, ...(data.skills || []))
    } catch (e) {
      console.warn('Failed to load saved data:', e)
    }
  }
}

const handlePrint = () => {
  window.print()
}

watch(resumeData, saveToStorage, { deep: true })

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 40px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.app-header p {
  font-size: 14px;
  opacity: 0.9;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px 40px;
  min-height: calc(100vh - 120px);
}

.form-section {
  overflow-y: auto;
  max-height: calc(100vh - 180px);
  padding-right: 10px;
}

.form-section::-webkit-scrollbar {
  width: 6px;
}

.form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.form-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.form-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.preview-section {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-header {
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.preview-header h2 {
  font-size: 16px;
  color: #495057;
  font-weight: 600;
}

.preview-container {
  flex: 1;
  overflow-y: auto;
  background: #e9ecef;
  padding: 20px;
}

.preview-container::-webkit-scrollbar {
  width: 8px;
}

.preview-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.preview-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.preview-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  
  .preview-section {
    min-height: 600px;
  }
}

.header-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.print-btn {
  padding: 10px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.print-btn:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

@media print {
  .app-header,
  .form-section,
  .preview-header {
    display: none !important;
  }
  
  .app-container {
    background: white;
  }
  
  .main-content {
    display: block;
    padding: 0;
    max-width: 100%;
  }
  
  .preview-section {
    box-shadow: none;
    border-radius: 0;
  }
  
  .preview-container {
    background: white;
    padding: 0;
  }
}
</style>
