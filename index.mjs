const { checkDocument } = require('./utils/checkDocument.js');
const { downloadFileFromS3 } = require('./utils/s3Utils.js');

const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    try {
        let body;
        if (event.body) {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } else {
            throw new Error('No body found in event');
        }

        const { files, business_name, address } = body;

        // Debug logging
        console.log('Received files:', files);
        console.log('Files type:', typeof files);
        console.log('Files is array:', Array.isArray(files));

        if (!files || !Array.isArray(files) || files.length === 0) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error: 'Files array is required and must not be empty'
                })
            };
        }

        if (!business_name || !address) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error: 'business_name and address are required'
                })
            };
        }
                
        const filesArray = Array.isArray(files) ? files : [files];
        
        const fileProcessingPromises = filesArray.map(async (file) => {
            try {
                if (!file.key || !file.fileName) {
                    console.error('Invalid file structure:', file);
                    return {
                        fileName: file.fileName || 'unknown',
                        does_business_name_match: null,
                        does_address_match: null,
                        error: 'Invalid file structure - missing key or fileName'
                    };
                }

                console.log(`Downloading file from S3: ${file.key}, fileName: ${file.fileName}, contentType: ${file.contentType}`);
                
                const fileContent = await downloadFileFromS3(file.key);
                
                const documentFile = {
                    content: fileContent,
                    contentType: file.contentType || 'application/octet-stream'
                };

                console.log(`Processing file: ${file.fileName}, type: ${documentFile.contentType}, size: ${file.size || fileContent.length}`);
                
                const result = await checkDocument(documentFile, business_name, address);
                
                return {
                    fileName: file.fileName,
                    s3Key: file.key,
                    does_business_name_match: result.does_business_name_match,
                    does_address_match: result.does_address_match
                };
                
            } catch (fileError) {
                console.error(`Error processing file ${file.fileName || 'unknown'}:`, fileError);
                return {
                    fileName: file.fileName || 'unknown',
                    s3Key: file.key,
                    does_business_name_match: null,
                    does_address_match: null,
                    error: fileError.message
                };
            }
        });

        const fileResults = await Promise.all(fileProcessingPromises);

        const overallBusinessMatch = fileResults.some(r => r.does_business_name_match === true);
        const overallAddressMatch = fileResults.some(r => r.does_address_match === true);

        const response = {
            does_business_name_match: overallBusinessMatch,
            does_address_match: overallAddressMatch,
            file_results: fileResults,
            processed_files_count: filesArray.length
        };

        console.log('Response:', JSON.stringify(response, null, 2));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Lambda handler error:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
                does_business_name_match: null,
                does_address_match: null
            })
        };
    }
};

module.exports = {
    handler
};
