interface Resume {
  _id: string
  student: {
    _id: string
    name: string
  }
  resumeMeta: {
    fileName?: string
    originalName?: string
    uploadedAt?: Date
  }
  resumeExtract: {
    skills: string[]
    projects: any[]
    tools: string[]
    experience: any[]
    education: any[]
    summary: string
  }
  parsedAt: Date
  createdAt: Date
  updatedAt: Date
  parserInfo?: {
    engine?: string
    version?: string
  }
}
