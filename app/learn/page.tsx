'use client'

import GamefiedPythonIDE from '../components/GamefiedPythonIDE'
import LayoutWrapper from '../components/layout/LayoutWrapper'

export default function BuildPythonPage() {
  return (
    <LayoutWrapper 
      currentPage="learn" 
      fullHeight={true}
      showHeader={false}
      showFooter={false}
    >
      <GamefiedPythonIDE />
    </LayoutWrapper>
  )
} 