require('dotenv').config();
const LangflowClient = require('../LangflowClient');
const util = require('util');

const flowIdOrName = '64432a17-62c7-4c33-8c40-9bfdaccb26d5';
const langflowId = '7670fdd8-a178-4a64-b2a4-6e61e489b07a';
const applicationToken = process.env.APPLICATION_TOKEN;

// Ensure the application token is present
if (!applicationToken) {
    console.error("Error: Application token is missing. Please set it in your .env file.");
    process.exit(1);
}

// Initialize Langflow Client
const langflowClient = new LangflowClient(
    'https://api.langflow.astra.datastax.com',
    applicationToken,
    {
        timeout: 120000,
        retries: 3,
        retryDelay: 1000
    }
);

// Helper function to extract output from Langflow response
const extractOutput = (response) => {
    // Deep log the full response structure
    console.log('Full Response Structure:', util.inspect(response, {depth: null, colors: true}));
    
    if (!response?.outputs?.[0]?.outputs) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response structure: missing outputs');
    }

    const firstOutput = response.outputs[0];
    console.log('First output object:', util.inspect(firstOutput, {depth: null, colors: true}));

    // Check if outputs is available and handle possible array structure
    const outputs = Array.isArray(firstOutput.outputs) ? firstOutput.outputs : [firstOutput.outputs];
    console.log('Outputs array:', util.inspect(outputs, {depth: null, colors: true}));

    // Try to find valid output in the array
    for (const output of outputs) {
        console.log('Processing output:', util.inspect(output, {depth: null, colors: true}));
        
        if (output?.response) return output.response;
        if (output?.result) return output.result;
        if (output?.text) return output.text;
        if (output?.message) return output.message;
        if (output?.output) return output.output;
        if (output?.data) return output.data;
    }

    // If we can't find a specific format, return the full outputs array stringified
    console.log('No standard output format found, returning full outputs array');
    return JSON.stringify(outputs);
};

// Controller to handle running a flow
exports.runFlow = async (req, res) => {
    const { inputValue, inputType = 'chat', outputType = 'chat', stream = false } = req.body;

    if (!inputValue) {
        return res.status(400).json({ success: false, error: 'Input value is required' });
    }

    console.log('Request received:', {
        inputValue,
        inputType,
        outputType,
        stream
    });

    const tweaks = {
        "ParseData-WRYuB": {},
        "Prompt-R6nZp": {},
        "OpenAIModel-QnZH3": {},
        "ChatOutput-g328R": {},
        "AstraDB-8DZnm": {},
        "CustomComponent-shd7O": {},
        "CombineText-2et2F": {},
        "Prompt-t5kP1": {},
        "ChatOutput-f8eIP": {},
        "SplitText-vFUSw": {},
        "AstraDB-6ZUKm": {},
        "File-RbRjr": {}
    };

    try {
        if (stream) {
            // Handle streaming response
            const eventSource = await langflowClient.runFlow(
                flowIdOrName,
                langflowId,
                inputValue,
                inputType,
                outputType,
                tweaks,
                true,
                (data) => {
                    if (res.writableEnded) return;
                    console.log('Stream data received:', data);
                    res.write(`data: ${JSON.stringify(data)}\n\n`);
                },
                () => {
                    if (!res.writableEnded) {
                        console.log('Stream closed');
                        res.end();
                    }
                },
                (error) => {
                    console.error("Stream Error:", error);
                    if (!res.writableEnded) {
                        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                        res.end();
                    }
                }
            );

            // Set up SSE headers
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });
        } else {
            // Handle non-streaming response
            console.log('Making non-streaming request to Langflow...');
            const response = await langflowClient.runFlow(
                flowIdOrName,
                langflowId,
                inputValue,
                inputType,
                outputType,
                tweaks,
                false
            );

            console.log('Raw Langflow Response:', util.inspect(response, {depth: null, colors: true}));

            try {
                const output = extractOutput(response);
                console.log('Extracted output:', output);

                res.json({ 
                    success: true, 
                    output,
                    session_id: response.session_id,
                    raw_response: response // Including raw response for debugging
                });
            } catch (error) {
                console.error('Error extracting output:', error);
                res.status(500).json({ 
                    success: false, 
                    error: 'Failed to extract output from response',
                    details: error.message,
                    raw_response: response
                });
            }
        }
    } catch (error) {
        console.error("Run Flow Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        });
    }
};