<template>
  <div class="resume-preview">
    <div class="preview-header">
      <h1 class="name">{{ resumeData.basicInfo.name || '您的姓名' }}</h1>
      <div class="position">{{ resumeData.basicInfo.position || '期望职位' }}</div>
    </div>
    
    <div class="contact-info">
      <div class="contact-item" v-if="resumeData.basicInfo.phone">
        <span class="icon">📱</span>
        <span>{{ resumeData.basicInfo.phone }}</span>
      </div>
      <div class="contact-item" v-if="resumeData.basicInfo.email">
        <span class="icon">📧</span>
        <span>{{ resumeData.basicInfo.email }}</span>
      </div>
      <div class="contact-item" v-if="resumeData.basicInfo.location">
        <span class="icon">📍</span>
        <span>{{ resumeData.basicInfo.location }}</span>
      </div>
    </div>

    <div class="section" v-if="resumeData.basicInfo.summary">
      <h2 class="section-title">个人简介</h2>
      <div class="section-content">
        <p class="summary">{{ resumeData.basicInfo.summary }}</p>
      </div>
    </div>

    <div class="section" v-if="hasEducation">
      <h2 class="section-title">教育经历</h2>
      <div class="section-content">
        <div 
          v-for="edu in resumeData.education" 
          :key="edu.id" 
          class="experience-item"
        >
          <div class="item-header">
            <div class="item-title">
              <strong>{{ edu.school || '学校名称' }}</strong>
              <span class="item-subtitle" v-if="edu.major">{{ edu.major }}</span>
            </div>
            <div class="item-date" v-if="edu.startDate || edu.endDate">
              {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
            </div>
          </div>
          <div class="item-details" v-if="edu.degree">
            <span class="degree">{{ edu.degree }}</span>
          </div>
          <p class="item-description" v-if="edu.description">{{ edu.description }}</p>
        </div>
      </div>
    </div>

    <div class="section" v-if="hasExperience">
      <h2 class="section-title">工作经验</h2>
      <div class="section-content">
        <div 
          v-for="exp in resumeData.experience" 
          :key="exp.id" 
          class="experience-item"
        >
          <div class="item-header">
            <div class="item-title">
              <strong>{{ exp.company || '公司名称' }}</strong>
              <span class="item-subtitle" v-if="exp.position">{{ exp.position }}</span>
            </div>
            <div class="item-date" v-if="exp.startDate || exp.endDate">
              {{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}
            </div>
          </div>
          <p class="item-description" v-if="exp.description">{{ exp.description }}</p>
        </div>
      </div>
    </div>

    <div class="section" v-if="hasProject">
      <h2 class="section-title">项目经历</h2>
      <div class="section-content">
        <div
          v-for="proj in resumeData.project"
          :key="proj.id"
          class="experience-item"
        >
          <div class="item-header">
            <div class="item-title">
              <strong>{{ proj.name || '项目名称' }}</strong>
              <span class="item-subtitle tech-stack" v-if="proj.techStack">{{ proj.techStack }}</span>
            </div>
          </div>
          <p class="item-description" v-if="proj.description">{{ proj.description }}</p>
        </div>
      </div>
    </div>

    <div class="section" v-if="hasSkills">
      <h2 class="section-title">技能证书</h2>
      <div class="section-content">
        <div class="skills-tags">
          <span
            v-for="skill in resumeData.skills"
            :key="skill.id"
            class="skill-tag"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  }
})

const hasEducation = computed(() => {
  return props.resumeData.education.some(edu => 
    edu.school || edu.degree || edu.major
  )
})

const hasExperience = computed(() => {
  return props.resumeData.experience.some(exp =>
    exp.company || exp.position
  )
})

const hasProject = computed(() => {
  return props.resumeData.project.some(proj =>
    proj.name || proj.techStack || proj.description
  )
})

const hasSkills = computed(() => {
  return props.resumeData.skills && props.resumeData.skills.length > 0
})

const formatDate = (date) => {
  if (!date) return ''
  const [year, month] = date.split('-')
  return `${year}.${month}`
}
</script>

<style scoped>
.resume-preview {
  background: white;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 100%;
  font-size: 14px;
  line-height: 1.6;
}

.preview-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #2c3e50;
}

.name {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.position {
  font-size: 16px;
  color: #7f8c8d;
  font-weight: 500;
}

.contact-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ecf0f1;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
}

.icon {
  font-size: 14px;
}

.section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 2px solid #3498db;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-content {
  padding-left: 0;
}

.experience-item {
  margin-bottom: 20px;
}

.experience-item:last-child {
  margin-bottom: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.item-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title strong {
  font-size: 15px;
  color: #2c3e50;
  font-weight: 600;
}

.item-subtitle {
  font-size: 13px;
  color: #7f8c8d;
  font-style: italic;
}

.tech-stack {
  font-style: normal;
  color: #3498db;
  font-weight: 500;
}

.item-date {
  font-size: 12px;
  color: #95a5a6;
  white-space: nowrap;
}

.item-details {
  margin-bottom: 6px;
}

.degree {
  display: inline-block;
  padding: 2px 8px;
  background: #ecf0f1;
  border-radius: 3px;
  font-size: 12px;
  color: #555;
}

.item-description {
  color: #555;
  font-size: 13px;
  line-height: 1.7;
  margin-top: 8px;
  white-space: pre-wrap;
}

.summary {
  color: #555;
  font-size: 13px;
  line-height: 1.7;
  text-align: justify;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  display: inline-block;
  padding: 6px 14px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

@media print {
  .resume-preview {
    box-shadow: none;
    padding: 0;
  }
}
</style>
