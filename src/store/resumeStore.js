import { reactive } from 'vue'

const THEME_COLORS = [
  '#3498db',
  '#667eea',
  '#e74c3c',
  '#2ecc71',
  '#f39c12',
  '#9b59b6'
]

const createEmptyResume = (name) => ({
  id: Date.now(),
  name: name,
  basicInfo: {
    name: '',
    position: '',
    phone: '',
    email: '',
    location: '',
    summary: '',
    avatar: ''
  },
  themeColor: '#3498db',
  education: [
    {
      id: Date.now(),
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ],
  experience: [
    {
      id: Date.now() + 1,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ],
  project: [
    {
      id: Date.now() + 2,
      name: '',
      techStack: '',
      description: ''
    }
  ],
  skills: []
})

const RESUME_LIST_KEY = 'resume-builder-resume-list'
const RESUME_DATA_PREFIX = 'resume-builder-resume-data-'

const loadResumeList = () => {
  try {
    const saved = localStorage.getItem(RESUME_LIST_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveResumeList = (list) => {
  localStorage.setItem(RESUME_LIST_KEY, JSON.stringify(list))
}

const loadResume = (id) => {
  try {
    const saved = localStorage.getItem(RESUME_DATA_PREFIX + id)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const saveResume = (resume) => {
  localStorage.setItem(RESUME_DATA_PREFIX + resume.id, JSON.stringify(resume))
}

const state = reactive({
  resumeList: loadResumeList(),
  currentResumeId: null
})

let resumeData = null

const getResumeData = () => {
  if (!state.currentResumeId) return null
  return loadResume(state.currentResumeId)
}

const initResumeData = () => {
  if (state.resumeList.length === 0) {
    const newResume = createEmptyResume('简历 1')
    state.resumeList.push({ id: newResume.id, name: newResume.name })
    saveResumeList(state.resumeList)
    saveResume(newResume)
  }
  state.currentResumeId = state.resumeList[0].id
  resumeData = reactive(getResumeData() || createEmptyResume('简历 1'))
  if (!getResumeData()) {
    saveResume(resumeData)
  }
}

const getNextResumeName = () => {
  let num = 1
  const existing = state.resumeList.map(r => r.name)
  while (existing.includes('新简历' + num)) {
    num++
  }
  return '新简历' + num
}

const createResume = () => {
  const name = getNextResumeName()
  const newResume = createEmptyResume(name)
  state.resumeList.push({ id: newResume.id, name: newResume.name })
  saveResumeList(state.resumeList)
  saveResume(newResume)
  switchResume(newResume.id)
  return newResume
}

const switchResume = (id) => {
  if (state.currentResumeId === id) return

  saveCurrentResume()

  state.currentResumeId = id
  const targetResume = loadResume(id)
  if (targetResume) {
    resumeData.id = targetResume.id
    resumeData.name = targetResume.name
    Object.assign(resumeData.basicInfo, targetResume.basicInfo)
    resumeData.education.splice(0, resumeData.education.length, ...targetResume.education)
    resumeData.experience.splice(0, resumeData.experience.length, ...targetResume.experience)
    resumeData.project.splice(0, resumeData.project.length, ...targetResume.project)
    resumeData.skills.splice(0, resumeData.skills.length, ...targetResume.skills)
    resumeData.themeColor = targetResume.themeColor
  }
}

const renameResume = (id, newName) => {
  const resume = state.resumeList.find(r => r.id === id)
  if (resume) {
    resume.name = newName
    saveResumeList(state.resumeList)
    if (resumeData && resumeData.id === id) {
      resumeData.name = newName
      saveCurrentResume()
    }
  }
}

const deleteResume = (id) => {
  if (state.resumeList.length <= 1) {
    alert('至少需要保留一份简历')
    return false
  }

  const index = state.resumeList.findIndex(r => r.id === id)
  if (index === -1) return false

  localStorage.removeItem(RESUME_DATA_PREFIX + id)
  state.resumeList.splice(index, 1)
  saveResumeList(state.resumeList)

  if (state.currentResumeId === id) {
    const nextResume = state.resumeList[Math.min(index, state.resumeList.length - 1)]
    switchResume(nextResume.id)
  }

  return true
}

const saveCurrentResume = () => {
  if (state.currentResumeId && resumeData) {
    saveResume(JSON.parse(JSON.stringify(resumeData)))
  }
}

export function useResumeStore() {
  const addEducation = () => {
    resumeData.education.push({
      id: Date.now(),
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  const removeEducation = (id) => {
    const index = resumeData.education.findIndex(e => e.id === id)
    if (index > -1) {
      resumeData.education.splice(index, 1)
    }
  }

  const addExperience = () => {
    resumeData.experience.push({
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    })
  }

  const removeExperience = (id) => {
    const index = resumeData.experience.findIndex(e => e.id === id)
    if (index > -1) {
      resumeData.experience.splice(index, 1)
    }
  }

  const addProject = () => {
    resumeData.project.push({
      id: Date.now(),
      name: '',
      techStack: '',
      description: ''
    })
  }

  const removeProject = (id) => {
    const index = resumeData.project.findIndex(p => p.id === id)
    if (index > -1) {
      resumeData.project.splice(index, 1)
    }
  }

  const clearAll = () => {
    resumeData.basicInfo = {
      name: '',
      position: '',
      phone: '',
      email: '',
      location: '',
      summary: '',
      avatar: ''
    }
    resumeData.education = [{
      id: Date.now(),
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    }]
    resumeData.experience = [{
      id: Date.now() + 1,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }]
    resumeData.project = [{
      id: Date.now() + 2,
      name: '',
      techStack: '',
      description: ''
    }]
    resumeData.skills = []
  }

  return {
    state,
    resumeData,
    THEME_COLORS,
    initResumeData,
    createResume,
    switchResume,
    renameResume,
    deleteResume,
    saveCurrentResume,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    addProject,
    removeProject,
    clearAll
  }
}