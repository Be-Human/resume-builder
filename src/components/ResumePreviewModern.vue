<template>
  <div class="resume-preview-modern">
    <aside class="sidebar">
      <div class="avatar-container" v-if="resumeData.basicInfo.avatar">
        <img :src="resumeData.basicInfo.avatar" alt="头像" class="avatar" />
      </div>
      <div class="sidebar-header">
        <h1 class="name">{{ resumeData.basicInfo.name || '您的姓名' }}</h1>
        <div class="position">{{ resumeData.basicInfo.position || '期望职位' }}</div>
      </div>

      <div class="sidebar-section" v-if="resumeData.basicInfo.phone || resumeData.basicInfo.email || resumeData.basicInfo.location">
        <h3 class="sidebar-title">联系方式</h3>
        <div class="contact-list">
          <div class="contact-item" v-if="resumeData.basicInfo.phone">
            <span class="contact-icon">📱</span>
            <span>{{ resumeData.basicInfo.phone }}</span>
          </div>
          <div class="contact-item" v-if="resumeData.basicInfo.email">
            <span class="contact-icon">📧</span>
            <span>{{ resumeData.basicInfo.email }}</span>
          </div>
          <div class="contact-item" v-if="resumeData.basicInfo.location">
            <span class="contact-icon">📍</span>
            <span>{{ resumeData.basicInfo.location }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-section" v-if="hasSkills">
        <h3 class="sidebar-title">技能证书</h3>
        <div class="skills-list">
          <span
            v-for="skill in resumeData.skills"
            :key="skill.id"
            class="skill-tag"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>

      <div class="sidebar-section" v-if="resumeData.basicInfo.summary">
        <h3 class="sidebar-title">个人简介</h3>
        <p class="summary">{{ resumeData.basicInfo.summary }}</p>
      </div>
    </aside>

    <main class="main-content">
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
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  themeColor: {
    type: String,
    default: '#3498db'
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
.resume-preview-modern {
  display: flex;
  background: white;
  min-height: 100%;
  font-size: 14px;
  line-height: 1.6;
}

.sidebar {
  width: 280px;
  background: #2c3e50;
  color: white;
  padding: 30px 20px;
  flex-shrink: 0;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid v-bind(themeColor);
}

.sidebar .name {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.sidebar .position {
  font-size: 14px;
  color: #ecf0f1;
  font-weight: 500;
}

.sidebar-section {
  margin-bottom: 25px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 700;
  color: v-bind(themeColor);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid v-bind(themeColor);
  padding-bottom: 6px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #ecf0f1;
}

.contact-icon {
  font-size: 14px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-block;
  padding: 4px 10px;
  background: v-bind('themeColor + "4D"');
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.summary {
  color: #bdc3c7;
  font-size: 12px;
  line-height: 1.7;
}

.main-content {
  flex: 1;
  padding: 30px 35px;
  overflow-y: auto;
}

.section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: v-bind(themeColor);
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid v-bind(themeColor);
}

.experience-item {
  margin-bottom: 18px;
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
  color: v-bind(themeColor);
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

@media print {
  .resume-preview-modern {
    display: flex;
  }

  .sidebar {
    width: 250px;
    background: #2c3e50 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .main-content {
    padding: 20px;
  }
}
</style>