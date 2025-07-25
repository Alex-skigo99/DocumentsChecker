const { handler } = require('./index.js');

// Example test event that matches the new format with S3 keys
const testEvent = {
    routeKey: "POST /documentsCheck",
    body: JSON.stringify({
        files: [
            {
                key: "documents/business-document-123.pdf",
                fileName: "business-document.pdf",
                contentType: "application/pdf",
                size: 1024
            },
            {
                key: "documents/address-proof-456.txt",
                fileName: "address-proof.txt", 
                contentType: "text/plain",
                size: 512
            }
        ],
        business_name: "ABC Corporation",
        address: "123 Main St, San Francisco, CA"
    }),
    headers: {
        "Content-Type": "application/json"
    },
    isBase64Encoded: false
};

// Test the handler locally
async function testHandler() {
    try {
        console.log('Testing Lambda handler...');
        const result = await handler(testEvent);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Uncomment the line below to run the test
// testHandler();
