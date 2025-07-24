import { handler } from './index.mjs';

const testEvent = {
    body: JSON.stringify({
        files: [{
            key: "test-documents/sample.pdf",
            fileName: "sample.pdf", 
            contentType: "application/pdf",
            size: 1024
        }],
        business_name: "Test Business LLC",
        address: "123 Main Street, Test City, NY 12345"
    })
};

async function runTest() {
    try {
        console.log('Testing Lambda function locally...');
        const result = await handler(testEvent);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
}

runTest();