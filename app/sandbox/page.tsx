'use client'

import GamefiedPythonIDE from '../components/GamefiedPythonIDE'
import LayoutWrapper from '../components/layout/LayoutWrapper'

export default function SandboxPage() {
  return (
    <LayoutWrapper 
      currentPage="sandbox" 
      fullHeight={true}
      showHeader={false}
      showFooter={false}
    >
      <GamefiedPythonIDE />
    </LayoutWrapper>
  )
} 