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

let resumeData = reactive(createEmptyResume('简历 1'))

const getCurrentResume = () => resumeData

const getResumeData = () => {
  if (!state.currentResumeId) return resumeData
  const saved = loadResume(state.currentResumeId)
  return saved || resumeData
}

const initResumeData = () => {
  if (state.resumeList.length === 0) {
    const newResume = createEmptyResume('简历 1')
    state.resumeList.push({ id: newResume.id, name: newResume.name })
    saveResumeList(state.resumeList)
    saveResume(newResume)
    state.currentResumeId = newResume.id
    Object.assign(resumeData, newResume)
  } else {
    state.currentResumeId = state.resumeList[0].id
    const loaded = loadResume(state.currentResumeId)
    if (loaded) {
      Object.assign(resumeData, loaded)
    }
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

  const calculateCompletion = () => {
    const totalItems = 6
    let completed = 0

    if (resumeData.basicInfo.name && resumeData.basicInfo.name.trim()) {
      completed++
    }

    if (resumeData.basicInfo.position && resumeData.basicInfo.position.trim()) {
      completed++
    }

    const hasContact = (resumeData.basicInfo.phone && resumeData.basicInfo.phone.trim()) || 
                      (resumeData.basicInfo.email && resumeData.basicInfo.email.trim())
    if (hasContact) {
      completed++
    }

    if (resumeData.basicInfo.summary && resumeData.basicInfo.summary.trim()) {
      completed++
    }

    const hasEducation = resumeData.education.some(edu => 
      edu.school && edu.school.trim()
    )
    if (hasEducation) {
      completed++
    }

    const hasExperience = resumeData.experience.some(exp => 
      exp.company && exp.company.trim()
    )
    if (hasExperience) {
      completed++
    }

    return Math.round((completed / totalItems) * 100)
  }

  const exportResume = () => {
    return JSON.parse(JSON.stringify(resumeData))
  }

  const importResume = (data) => {
    if (data) {
      const currentId = resumeData.id
      resumeData.name = data.name || '导入的简历'
      resumeData.themeColor = data.themeColor || '#3498db'
      
      resumeData.basicInfo = {
        name: '',
        position: '',
        phone: '',
        email: '',
        location: '',
        summary: '',
        avatar: ''
      }
      if (data.basicInfo) {
        Object.assign(resumeData.basicInfo, data.basicInfo)
      }
      
      if (data.education && Array.isArray(data.education)) {
        resumeData.education.splice(0, resumeData.education.length, ...data.education)
      } else {
        resumeData.education = []
      }
      
      if (data.experience && Array.isArray(data.experience)) {
        resumeData.experience.splice(0, resumeData.experience.length, ...data.experience)
      } else {
        resumeData.experience = []
      }
      
      if (data.project && Array.isArray(data.project)) {
        resumeData.project.splice(0, resumeData.project.length, ...data.project)
      } else {
        resumeData.project = []
      }
      
      if (data.skills && Array.isArray(data.skills)) {
        resumeData.skills.splice(0, resumeData.skills.length, ...data.skills)
      } else {
        resumeData.skills = []
      }

      resumeData.id = currentId

      const resumeInList = state.resumeList.find(r => r.id === currentId)
      if (resumeInList) {
        resumeInList.name = resumeData.name
        saveResumeList(state.resumeList)
      }

      return true
    }
    return false
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
    clearAll,
    calculateCompletion,
    exportResume,
    importResume
  }
}