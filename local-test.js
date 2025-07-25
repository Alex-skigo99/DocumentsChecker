const { localHandler } = require('./local-handler.js');

// Test with local files - put your test files in a 'test-files' directory
const testEvent = {
    body: JSON.stringify({
        files: [{
            filePath: "./test-files/sample.pdf",  // Put your test PDF here
            fileName: "sample.pdf", 
            contentType: "application/pdf"
        }],
        business_name: "Test Business LLC",
        address: "123 Main Street, Test City, NY 12345"
    })
};

async function runTest() {
    try {
        console.log('Testing Lambda function locally with local files...');
        const result = await localHandler(testEvent);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
}

runTest();