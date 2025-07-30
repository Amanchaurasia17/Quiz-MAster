const openTriviaService = require('./services/openTriviaService');

async function testOpenTriviaService() {
  try {
    console.log('🧪 Testing Open Trivia DB Service...\n');
    
    // Test 1: Fetch 5 general knowledge questions
    console.log('📡 Test 1: Fetching 5 general knowledge questions...');
    const questions = await openTriviaService.fetchQuestions({
      amount: 5,
      category: 'general',
      difficulty: 'medium'
    });
    
    console.log(`✅ Success! Fetched ${questions.length} questions`);
    console.log('📋 Sample question:');
    console.log(`   Question: ${questions[0].question}`);
    console.log(`   Options: ${questions[0].options.map(o => o.text).join(', ')}`);
    console.log(`   Correct: ${questions[0].options.find(o => o.isCorrect).text}`);
    console.log(`   Difficulty: ${questions[0].difficulty}\n`);
    
    // Test 2: Fetch categories
    console.log('📂 Test 2: Fetching available categories...');
    const categories = await openTriviaService.getCategories();
    console.log(`✅ Success! Found ${categories.length} categories`);
    console.log('📋 Sample categories:', categories.slice(0, 3).map(c => c.name).join(', '));
    
    console.log('\n🎉 All tests passed! Open Trivia DB integration is working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOpenTriviaService();
