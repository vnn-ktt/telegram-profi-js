// scripts/test-atlas-connection.ts
import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { Question } from '../models/Question.model';

async function testAtlasConnection() {
    try {
        console.log('Testing MongoDB Atlas connection...');

        await connectToDatabase();

        // Проверим, что можем делать запросы
        const count = await Question.countDocuments();
        console.log(`📊 Total questions in database: ${count}`);

        // Попробуем создать тестовый документ
        const testQuestion = new Question({
            id: 999,
            text: "Test question from Atlas",
            type: "CLICK",
            hasOptions: true,
            grade: "junior",
            options: [
                { id: 1, text: "Test option", isCorrect: true }
            ]
        });

        await testQuestion.save();
        console.log('✅ Test document created successfully');

        // Удалим тестовый документ
        await Question.deleteOne({ id: 999 });
        console.log('✅ Test document cleaned up');

        await disconnectFromDatabase();
        console.log('✅ All tests passed! Atlas connection is working correctly');

    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

testAtlasConnection();