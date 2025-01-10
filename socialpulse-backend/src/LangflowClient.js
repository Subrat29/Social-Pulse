const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const EventSource = require('eventsource');

class LangflowClient {
    constructor(baseURL, applicationToken, options = {}) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
        this.timeout = options.timeout || 120000; // 2 minutes default timeout
        this.retries = options.retries || 3; // Number of retries
        this.retryDelay = options.retryDelay || 1000; // Delay between retries in ms
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        const url = `${this.baseURL}${endpoint}`;
        console.log('Making Request:', url);
        
        let lastError;
        for (let attempt = 1; attempt <= this.retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(body),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                const responseMessage = await response.json();
                if (!response.ok) {
                    throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
                }
                return responseMessage;
            } catch (error) {
                lastError = error;
                console.error(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.retries) {
                    const delay = this.retryDelay * attempt;
                    console.log(`Retrying in ${delay}ms...`);
                    await this.sleep(delay);
                }
            }
        }
        
        throw new Error(`Failed after ${this.retries} attempts. Last error: ${lastError.message}`);
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        const body = {
            input_value: inputValue,
            input_type: inputType,
            output_type: outputType,
            tweaks: tweaks
        };
        console.log('Initiating session with body:', JSON.stringify(body, null, 2));
        return this.post(endpoint, body);
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        console.log('Setting up stream connection to:', streamUrl);
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            try {
                const data = JSON.parse(event.data);
                console.log('Stream data received:', data);
                onUpdate(data);
            } catch (error) {
                console.error('Error parsing stream data:', error);
                onError(error);
            }
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            console.log('Stream closed normally');
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        console.log('Running flow with input:', inputValue);
        try {
            const response = await this.initiateSession(
                flowId,
                langflowId,
                inputValue,
                inputType,
                outputType,
                stream,
                tweaks
            );

            if (stream && response?.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url) {
                const streamUrl = response.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                return this.handleStream(
                    streamUrl,
                    onUpdate || (data => console.log('Stream update:', data)),
                    onClose || (() => console.log('Stream closed')),
                    onError || (error => console.error('Stream error:', error))
                );
            }

            if (!response || !response.outputs) {
                throw new Error('Invalid API Response: Missing outputs');
            }

            return response;
        } catch (error) {
            console.error('Error running flow:', error);
            throw error;
        }
    }
}

module.exports = LangflowClient;