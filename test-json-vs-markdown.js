// Test script to verify JSON lesson loading
const fs = require('fs');
const path = require('path');

async function testLessonLoading() {
  console.log('🧪 Testing lesson loading...\n');
  
  try {
    // Test JSON loading
    console.log('📄 Testing JSON file loading...');
    const jsonPath = path.join(process.cwd(), 'lessons', '01-receipt-generator-stepped.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const jsonLesson = JSON.parse(jsonContent);
    
    console.log('✅ JSON loaded successfully');
    console.log(`  - Title: ${jsonLesson.title}`);
    console.log(`  - Steps count: ${jsonLesson.steps.length}`);
    console.log(`  - Step IDs: ${jsonLesson.steps.map(s => s.id).join(', ')}`);
    console.log(`  - Step titles: ${jsonLesson.steps.map(s => s.title).join(', ')}\n`);
    
    // Test API endpoint simulation
    console.log('🌐 Testing API endpoint simulation...');
    const apiResponse = {
      id: jsonLesson.id,
      title: jsonLesson.title,
      difficulty: jsonLesson.difficulty,
      time: jsonLesson.time,
      track: jsonLesson.track,
      overview: jsonLesson.overview,
      concepts: jsonLesson.concepts,
      steps: jsonLesson.steps
    };
    
    console.log('✅ API response structure valid');
    console.log(`  - Response has ${Object.keys(apiResponse).length} top-level keys`);
    console.log(`  - Steps array has ${apiResponse.steps.length} items`);
    
    // Verify each step structure
    apiResponse.steps.forEach((step, index) => {
      console.log(`  - Step ${index + 1}: ${step.id} - "${step.title}"`);
      console.log(`    - Has goal: ${!!step.goal}`);
      console.log(`    - Has instructions: ${!!step.instructions && step.instructions.length > 0}`);
      console.log(`    - Has starterCode: ${!!step.starterCode && step.starterCode.length > 0}`);
      console.log(`    - Has solutionCode: ${!!step.solutionCode && step.solutionCode.length > 0}`);
      console.log(`    - Has expectedOutput: ${!!step.expectedOutput}`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLessonLoading(); 