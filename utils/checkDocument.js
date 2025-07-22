import pdf from "pdf-parse";
import mammoth from "mammoth";
import { generateResponse, generateResponseVision } from "./utils.js";

export async function checkDocument(documentFile, businessName, address) {
    const basePrompt = `
    Business name to verify: ${businessName}
    Address to verify: ${address}

    Please analyze the document carefully and determine:
    1. Does the business name in the document match the provided business name? (Consider variations, abbreviations, and slight differences as matches)
    2. Does the address in the document match the provided address? (Consider formatting differences, abbreviations like "St" vs "Street", and partial matches)

    Respond ONLY with a valid JSON object in this exact format:
    {
    "does_business_name_match": true or false,
    "does_address_match": true or false
    }

    Do not include any additional text or explanation, only the JSON response.`;

    try {
        let documentText;
        let aiResponse;

        if (!documentFile || !documentFile.content || !documentFile.contentType) {
            throw new Error("Invalid document file provided");
        }

        const contentType = documentFile.contentType.toLowerCase();

        if (contentType.includes("text/plain") || contentType.includes("text/")) {
            documentText = documentFile.content.toString("utf-8");
            const prompt = `
            You are a document verification assistant. 
            Your task is to analyze a document and determine if the provided business name and address match what's written in the document.

            Document content: ${documentText}
            `.trim() + `\n\n${basePrompt}`;

            aiResponse = await generateResponse(prompt);

        } else if (contentType.includes("image/")) {
            const base64Image = documentFile.content.toString("base64");
            const imageUrl = `data:${documentFile.contentType};base64,${base64Image}`;

            const prompt = `
            Analyze this document image and extract all text content from it.
            Then determine if the provided business name and address match what's written in the document.
            `.trim() + `\n\n${basePrompt}`;

            aiResponse = await generateResponseVision(prompt, imageUrl);

        } else if (contentType.includes("application/pdf") || contentType.includes("pdf")) {
            try {
                const pdfData = await pdf(documentFile.content);
                documentText = pdfData.text;
                
                if (!documentText || documentText.trim().length === 0) {
                    throw new Error("No text content found in PDF document");
                }
                
                const prompt = `
                You are a document verification assistant. 
                Your task is to analyze a PDF document and determine if the provided business name and address match what's written in the document.

                Document content: ${documentText}
                `.trim() + `\n\n${basePrompt}`;

                aiResponse = await generateResponse(prompt);
                
            } catch (pdfError) {
                throw new Error(`Failed to parse PDF document: ${pdfError.message}`);
            }

        } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || 
                    contentType.includes('docx') || 
                    contentType.includes('application/msword')) {
            try {
                const docxResult = await mammoth.extractRawText({ buffer: documentFile.content });
                documentText = docxResult.value;
                
                if (!documentText || documentText.trim().length === 0) {
                    throw new Error("No text content found in DOCX document");
                }
                
                const prompt = `
                You are a document verification assistant. 
                Your task is to analyze a DOCX document and determine if the provided business name and address match what's written in the document.

                Document content: ${documentText}
                `.trim() + `\n\n${basePrompt}`;

                aiResponse = await generateResponse(prompt);
                
            } catch (docxError) {
                console.error("Error parsing DOCX:", docxError);
                throw new Error(`Failed to parse DOCX document: ${docxError.message}`);
            }

        } else {
            throw new Error(`Unsupported file type: ${contentType}. Currently supported: text files, images, PDF files, and DOCX files.`);
        }

        const responseContent = aiResponse.choices[0]?.message?.content;

        if (!responseContent) {
            throw new Error("No response content from AI service");
        }

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseContent.trim());
        } catch (parseError) {
            console.log("Failed to parse AI response as JSON:", responseContent);
            throw new Error("Invalid JSON response from AI service");
        }

        if (
            typeof parsedResponse.does_business_name_match !== "boolean" ||
            typeof parsedResponse.does_address_match !== "boolean"
        ) {
            throw new Error("Invalid response structure from AI service");
        }

        return parsedResponse;
    } catch (error) {
        console.error("Error in checkDocument:", error);

        return {
            does_business_name_match: null,
            does_address_match: null
        };
    }
};
