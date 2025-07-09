'use client'

import PythonIDE from '../components/PythonIDE'
import { courses } from '../data/lessons'

export default function BuildPythonPage() {
  return <PythonIDE courses={courses} />
} 