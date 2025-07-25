const { localHandler } = require('./local-handler.js');

// Quick image test
async function quickImageTest() {
    const testEvent = {
        body: JSON.stringify({
            files: [{
                filePath: "./test-files/sample-document.png", // Make sure this file exists
                fileName: "sample-document.png", 
                contentType: "image/png"
            }],
            business_name: "Test Business LLC",
            address: "123 Main Street, Test City, NY 12345"
        })
    };
    
    console.log('Testing image file processing...');
    try {
        const result = await localHandler(testEvent);
        console.log('Image test successful!');
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Image test failed:', error.message);
        console.log('\nTo fix this:');
        console.log('1. Create an image file at: ./test-files/sample-document.jpg');
        console.log('2. Or open test-files/create-test-image.html in browser and screenshot it');
        console.log('3. Make sure the image contains business name and address text');
    }
}

quickImageTest();
