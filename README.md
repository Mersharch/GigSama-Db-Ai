# Project Title

## Overview

This project is a web application designed to aid users in generating Entity relationship diagrams. The application leverages modern web technologies to provide a responsive and user-friendly experience.

## Live Project

You can view the live project at [Live Project Link](https://gig-sama-db-ai.vercel.app/).

## Technology Choices

### Frontend

- **React**: The application is built using React, a popular JavaScript library for building user interfaces. React's component-based architecture allows for reusable UI components, making the codebase more maintainable.
- **Vite**: Vite is used as the build tool and development server. It provides fast hot module replacement (HMR) and a streamlined development experience.

- **Tailwind CSS**: For styling, Tailwind CSS is utilized. This utility-first CSS framework allows for rapid UI development with a focus on responsiveness and customization.

- **Axios**: Axios is used for making HTTP requests to the backend API. It simplifies the process of handling requests and responses, including error handling.

### State Management

- **Context API**: The React Context API is used for state management across the application. This allows for a centralized way to manage user authentication state and project data without prop drilling.

### Backend

- **Node.js / Express**: The backend is built using Node.js and Express, providing a RESTful API for user authentication and project management.

- **Database**: PostgreSQL, which stores user data and project information.

## Design Decisions

- **Component Structure**: The application is structured into reusable components, such as `Header`, `ChatContent`, and `ChatInput`, to promote modularity and separation of concerns.

- **Responsive Design**: The UI is designed to be responsive, ensuring a seamless experience across various devices and screen sizes. Tailwind CSS is used to achieve this responsiveness efficiently.

- **Error Handling**: Comprehensive error handling is implemented throughout the application, particularly in API calls, to provide users with meaningful feedback.

- **User Experience**: The application focuses on providing a smooth user experience with features like loading indicators, form validations, and clear navigation.

## Setup Instructions

To set up and run the project locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Mersharch/GigSama-Db-Ai.git
   cd GigSama-Db-Ai
   ```

2. **Install Dependencies**:
   Make sure you have Node.js installed. Then run:

   ```bash
   cd client
   npm install
   ```

   and for the server navigate to the server directory and run:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the client directory and add the following variables:

   ```plaintext
   VITE_API_URL=http://localhost:50001/api/v1
   ```

4. **Run the Development Server**:
   Start the development server by going into each directory i.e client and sever and running:

   ```bash
   npm run dev
   ```

5. **Open the Application**:
   Open your browser and navigate to `http://localhost:5173` (or the port specified in the terminal).

## Reasons for SQL over NoSQL for the ERD schema

- **Data Integrity & Accuracy** – Relational databases enforce rules (like unique values or required fields) to keep data clean and consistent.
- **Better Query Performance** – SQL queries run faster on structured data because of indexing and relationships.
- **Easier Data Relationships** – It’s simpler to link related data (e.g., customers and orders) using foreign keys instead of searching inside JSON blobs.
- **Scalability & Maintenance** – Structured tables are easier to scale, update, and optimize compared to large, unstructured JSON fields.
- **Flexibility in Queries** – SQL makes it easy to filter, join, and aggregate data, whereas JSON queries are more complex and slower.
- **Less Data Duplication** – With relational design, you store data efficiently by avoiding repeated values inside JSON fields.
