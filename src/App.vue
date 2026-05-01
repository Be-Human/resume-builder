<template>
  <div class="app-container" v-if="resumeData">
    <header class="app-header">
      <h1>简历生成器</h1>
      <div class="header-actions">
        <div class="resume-tabs">
          <div
            v-for="resume in state.resumeList"
            :key="resume.id"
            class="resume-tab"
            :class="{ active: state.currentResumeId === resume.id }"
            @click="handleSwitchResume(resume.id)"
          >
            <span
              v-if="editingResumeId !== resume.id"
              class="resume-name"
              @dblclick="startRename(resume.id, resume.name)"
            >{{ resume.name }}</span>
            <input
              v-else
              v-model="editingName"
              class="rename-input"
              @blur="finishRename"
              @keyup.enter="finishRename"
              @keyup.escape="cancelRename"
              ref="renameInput"
            />
            <button
              v-if="state.resumeList.length > 1"
              class="delete-resume-btn"
              @click.stop="handleDeleteResume(resume.id)"
            >×</button>
          </div>
          <button class="add-resume-btn" @click="handleCreateResume">+ 新建</button>
        </div>
        <div class="theme-picker">
          <span class="theme-label">主题色：</span>
          <div class="color-options">
            <button
              v-for="color in THEME_COLORS"
              :key="color"
              class="color-btn"
              :class="{ active: resumeData.themeColor === color }"
              :style="{ backgroundColor: color }"
              @click="resumeData.themeColor = color"
            ></button>
          </div>
        </div>
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
        <ProjectForm
          v-model="resumeData.project"
          @add="addProject"
          @remove="removeProject"
        />
        <SkillsForm v-model="resumeData.skills" />
        <div class="form-actions">
          <button class="clear-btn" @click="confirmClear">一键清空</button>
        </div>
      </div>

      <div class="preview-section">
        <div class="preview-header">
          <h2>简历预览</h2>
          <div class="template-switch">
            <button
              :class="['template-btn', { active: currentTemplate === 'classic' }]"
              @click="currentTemplate = 'classic'"
            >
              经典款
            </button>
            <button
              :class="['template-btn', { active: currentTemplate === 'modern' }]"
              @click="currentTemplate = 'modern'"
            >
              现代款
            </button>
          </div>
        </div>
        <div class="preview-container">
          <ResumePreview v-if="currentTemplate === 'classic'" :resumeData="resumeData" :themeColor="resumeData.themeColor" />
          <ResumePreviewModern v-else :resumeData="resumeData" :themeColor="resumeData.themeColor" />
        </div>
      </div>
    </main>

    <div class="confirm-dialog" v-if="showConfirmDialog">
      <div class="dialog-overlay" @click="showConfirmDialog = false"></div>
      <div class="dialog-content">
        <h3>确认清空</h3>
        <p>确定要清空所有填写内容吗？此操作不可恢复。</p>
        <div class="dialog-actions">
          <button class="dialog-btn cancel" @click="showConfirmDialog = false">取消</button>
          <button class="dialog-btn confirm" @click="handleClearAll">确认清空</button>
        </div>
      </div>
    </div>

    <div class="confirm-dialog" v-if="showDeleteDialog">
      <div class="dialog-overlay" @click="showDeleteDialog = false"></div>
      <div class="dialog-content">
        <h3>确认删除</h3>
        <p>确定要删除「{{ deleteTargetName }}」吗？此操作不可恢复。</p>
        <div class="dialog-actions">
          <button class="dialog-btn cancel" @click="showDeleteDialog = false">取消</button>
          <button class="dialog-btn confirm" @click="handleConfirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useResumeStore } from './store/resumeStore'
import BasicInfoForm from './components/BasicInfoForm.vue'
import EducationForm from './components/EducationForm.vue'
import ExperienceForm from './components/ExperienceForm.vue'
import ProjectForm from './components/ProjectForm.vue'
import SkillsForm from './components/SkillsForm.vue'
import ResumePreview from './components/ResumePreview.vue'
import ResumePreviewModern from './components/ResumePreviewModern.vue'

const { state, resumeData, THEME_COLORS, initResumeData, createResume, switchResume, renameResume, deleteResume, saveCurrentResume, addEducation, removeEducation, addExperience, removeExperience, addProject, removeProject, clearAll } = useResumeStore()

const STORAGE_KEY = 'resume-builder-data'
const currentTemplate = ref('classic')
const showConfirmDialog = ref(false)
const showDeleteDialog = ref(false)
const deleteTargetId = ref(null)
const deleteTargetName = ref('')
const editingResumeId = ref(null)
const editingName = ref('')
const renameInput = ref(null)

const handleCreateResume = () => {
  createResume()
}

const handleSwitchResume = (id) => {
  if (editingResumeId.value) return
  switchResume(id)
}

const startRename = (id, name) => {
  editingResumeId.value = id
  editingName.value = name
  nextTick(() => {
    if (renameInput.value) {
      const input = Array.isArray(renameInput.value) ? renameInput.value[0] : renameInput.value
      input && input.focus()
    }
  })
}

const finishRename = () => {
  if (editingResumeId.value && editingName.value.trim()) {
    renameResume(editingResumeId.value, editingName.value.trim())
  }
  editingResumeId.value = null
  editingName.value = ''
}

const cancelRename = () => {
  editingResumeId.value = null
  editingName.value = ''
}

const handleDeleteResume = (id) => {
  const resume = state.resumeList.find(r => r.id === id)
  if (resume) {
    deleteTargetId.value = id
    deleteTargetName.value = resume.name
    showDeleteDialog.value = true
  }
}

const handleConfirmDelete = () => {
  if (deleteTargetId.value) {
    deleteResume(deleteTargetId.value)
  }
  showDeleteDialog.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

const handlePrint = () => {
  window.print()
}

const confirmClear = () => {
  showConfirmDialog.value = true
}

const handleClearAll = () => {
  clearAll()
  saveCurrentResume()
  showConfirmDialog.value = false
}

watch(() => resumeData, () => {
  if (resumeData && resumeData.id) {
    saveCurrentResume()
  }
}, { deep: true })

watch(() => resumeData?.themeColor, (newColor) => {
  if (newColor) {
    localStorage.setItem('resume-theme-color', newColor)
  }
})

onMounted(() => {
  initResumeData()
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

.resume-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 16px;
}

.resume-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.resume-tab:hover {
  background: rgba(255, 255, 255, 0.3);
}

.resume-tab.active {
  background: white;
  color: #667eea;
}

.resume-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rename-input {
  width: 100px;
  padding: 2px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.delete-resume-btn {
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  color: inherit;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-resume-btn:hover {
  background: #ff4d4f;
  color: white;
}

.add-resume-btn {
  padding: 8px 16px;
  background: transparent;
  border: 2px dashed rgba(255, 255, 255, 0.5);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.add-resume-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h2 {
  font-size: 16px;
  color: #495057;
  font-weight: 600;
}

.template-switch {
  display: flex;
  gap: 8px;
}

.template-btn {
  padding: 6px 16px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 16px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.template-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.template-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
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

.form-actions {
  margin-top: 20px;
}

.clear-btn {
  width: 100%;
  padding: 12px;
  background: #fff;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #ff4d4f;
  color: white;
}

.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: relative;
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.dialog-content h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}

.dialog-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.dialog-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.dialog-btn.cancel {
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
}

.dialog-btn.cancel:hover {
  background: #e9ecef;
}

.dialog-btn.confirm {
  background: #ff4d4f;
  border: none;
  color: white;
}

.dialog-btn.confirm:hover {
  background: #ff7875;
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

.theme-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.theme-label {
  font-size: 14px;
  color: white;
}

.color-options {
  display: flex;
  gap: 8px;
}

.color-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-btn:hover {
  transform: scale(1.15);
}

.color-btn.active {
  border-color: white;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
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
  .preview-header,
  .confirm-dialog {
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