const { localHandler } = require('./local-handler.js');

// Test with different file types
const testEvents = [
    {
        name: "Text File Test",
        event: {
            body: JSON.stringify({
                files: [{
                    filePath: "./test-files/sample.txt",
                    fileName: "sample.txt", 
                    contentType: "text/plain"
                }],
                business_name: "Test Business LLC",
                address: "123 Main Street, Test City, NY 12345"
            })
        }
    },
    {
        name: "PDF File Test (PDF temporarily disabled)",
        event: {
            body: JSON.stringify({
                files: [{
                    filePath: "./test-files/Test Business LLC.pdf",
                    fileName: "Test Business LLC.pdf",
                    contentType: "application/pdf"
                }],
                business_name: "Test Business LLC", 
                address: "123 Main Street, Test City, NY 12345"
            })
        }
    },
    {
        name: "Word Files Test",
        event: {
            body: JSON.stringify({
                files: [
                    {
                        filePath: "./test-files/sample.docx",
                        fileName: "sample.docx", 
                        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    }
                ],
                business_name: "Test Business LLC",
                address: "123 Main Street, Test City, NY 12345"
            })
        }
    },
    {
        name: "Image File Test",
        event: {
            body: JSON.stringify({
                files: [{
                    filePath: "./test-files/sample.jpg",
                    fileName: "sample.jpg", 
                    contentType: "image/jpeg"
                }],
                business_name: "Test Business LLC",
                address: "123 Main Street, Test City, NY 12345"
            })
        }
    },
    {
        name: "PNG Image Test",
        event: {
            body: JSON.stringify({
                files: [{
                    filePath: "./test-files/sample-f-t.png",
                    fileName: "sample-f-t.png", 
                    contentType: "image/png"
                }],
                business_name: "Test Business LLC",
                address: "123 Main Street, Test City, NY 12345"
            })
        }
    }
];

async function runAllTests() {
    for (const test of testEvents) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Running: ${test.name}`);
        console.log(`${'='.repeat(50)}`);
        
        try {
            const result = await localHandler(test.event);
            console.log('Result:', JSON.stringify(result, null, 2));
        } catch (error) {
            console.error(`${test.name} failed:`, error.message);
        }
    }
}

// Run a single test or all tests
async function runSingleTest() {
    // Test different file types - change the index to test different scenarios:
    // 0 = Text File Test
    // 1 = PDF File Test (PDF temporarily disabled) 
    // 2 = Word Files Test
    // 3 = Image File Test (requires sample-document.jpg)
    // 4 = PNG Image Test (requires sample-document.png)

    const testEvent = testEvents[4];
    console.log(`Running: ${testEvent.name}`);
    
    try {
        const result = await localHandler(testEvent.event);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test failed:', error);
    }
}


// Choose which test to run
runSingleTest();
// testImageFile(); // Uncomment to test image processing
// runAllTests();
