import { reactive } from 'vue'

const resumeData = reactive({
  basicInfo: {
    name: '',
    position: '',
    phone: '',
    email: '',
    location: '',
    summary: ''
  },
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
      summary: ''
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
    resumeData,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    addProject,
    removeProject,
    clearAll
  }
}