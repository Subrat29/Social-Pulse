<div align="center">

# 🌟 Social Pulse - A Data Analytics Tool


![Version](https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000)
![AI & ML](https://img.shields.io/badge/AI-ML-brightgreen.svg)
![React](https://img.shields.io/badge/React-red.svg)
![Langflow](https://img.shields.io/badge/Langflow-grey.svg)
![AstraDB](https://img.shields.io/badge/AstraDB-blue.svg)

### 🔗 [Live Demo](https://socialpulse-seven.vercel.app/) | 🎥 [Demo Video](https://www.youtube.com/watch?v=-NDzl1Y_dc4)

</div>

## 🚀 About

**Social Pulse** is an advanced data analytics tool that empowers users to analyze social media engagement data and generate actionable insights. By integrating Langflow, OpenAI, and Astra DB, Social Pulse simplifies data-driven decision-making for marketers, influencers, and businesses. 

## 🎯 Features

### **Key Capabilities**
- **Data Ingestion**  
  Simulate or upload datasets representing social media engagements (likes, shares, comments, etc.).  

- **Data Analysis**  
  Utilize Langflow workflows to compute average engagement metrics by content type (e.g., reels, carousels, static images).  

- **Insight Generation**  
  Leverage OpenAI GPT models to deliver actionable insights and recommendations in human-readable formats.

---

## 📊 Example Analytics

### Average Engagement Metrics
| Content Type  | Likes | Comments | Shares | Total Engagement |
|:-------------|:-----:|:--------:|:------:|:----------------:|
| Carousel     | 147   | 18       | 25     | 190             |
| Reel         | 357   | 45       | 83     | 485             |
| Static Image | 83    | 8        | 9      | 100             |

### Insights:
- *"Reels posts have 357% higher engagement than static posts."*  
- *"Reels drive 2x more comments compared to other formats."*  

### Recommended Actions:
- *"Create visually dynamic reels with storytelling elements and trending audio to enhance engagement."*  
- *"Experiment with different reel formats and lengths to maximize reach and retention."*

---

## 🛠️ Tools & Technologies

- **DataStax Astra DB**: Secure, scalable data storage and querying.  
- **Langflow**: Workflow automation for integrating OpenAI GPT models.  
- **OpenAI GPT Models**: AI-powered insights and recommendations.  
- **React**: Interactive, user-friendly frontend.  
- **Node.js**: Backend for API development and data handling.

---

## 💻 Installation

### Prerequisites:
- Node.js and npm installed on your system.

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/Subrat29/Social-Pulse.git
   cd Social-Pulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔧 Usage

### Workflow:
1. **Data Ingestion**  
   Upload your social media engagement dataset via the app interface.  

2. **Run Analysis**  
   Use the analysis tools to calculate engagement metrics and trends.  

3. **View Insights**  
   Access AI-generated insights and recommendations to guide strategy.

---

## 🌟 Future Enhancements

- Real-time integration with live social media data streams.  
- Advanced analytics like sentiment analysis and trend prediction.  
- Improved scalability for handling larger datasets.  
- Machine learning models for predictive insights.  

---

## 🌐 Langflow Integration API

The **Langflow Integration API** enables seamless execution of workflows for analyzing social media engagement metrics.

### Overview:
This Node.js API service processes Langflow workflows and handles both streaming and non-streaming responses with retry mechanisms for reliability.

---

### **API Setup**

1. Clone the repository and navigate to the project directory.  
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (based on `.env.sample`) with the following variables:
   ```
   APPLICATION_TOKEN=your_application_token
   PORT=3000
   CORS_ORIGIN=*
   ```

4. Start the server:
   ```bash
   npm start
   ```

The API will be accessible at `http://localhost:3000`.

---

### **Endpoints**

#### POST `/api/run-flow`
Executes a Langflow workflow with the provided input.

- **Request Body:**
  ```json
  {
    "inputValue": "Post type (e.g., 'Reel', 'Carousel')",
    "inputType": "chat",
    "outputType": "chat",
    "stream": false
  }
  ```

- **Response:**  
  **Success (200):**
  ```json
  {
    "success": true,
    "output": "Workflow output",
    "session_id": "unique_session_id"
  }
  ```
  **Error (500):**
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```

### **Error Handling**
- Maximum retries: 3 attempts  
- Retry delay: 1000ms (with exponential backoff)  
- Request timeout: 120 seconds  

---

## 👥 Contributors

- **Subrat**: [GitHub](https://github.com/Subrat29)  
- **Gavnish**: [GitHub](https://github.com/Gavnishkumar)  
- **Abhishek**: [GitHub](https://github.com/Abhi-gits)  

---

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:  
1. Fork the repository.  
2. Create a feature branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a Pull Request.  

---

## ⭐ Show Your Support

Give a ⭐️ if you found this project helpful and inspiring!  

<div align="center">

---

_Developed with ❤️ by Team Endgame_

</div>
