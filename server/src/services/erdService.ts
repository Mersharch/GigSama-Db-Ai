import { ChatOpenAI } from "@langchain/openai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { v4 } from "uuid";
import { projectService } from "./projectService";

export interface ERDResponse {
  userInput?: string;
  schemaCode: string | null;
  aiResponse: string;
}

const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
});

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

let config;

// const ERD_SYSTEM_PROMPT = `
// You are a database design expert. Your task is to generate Entity Relationship Diagrams (ERDs) in XML format based on user requirements.

// When the user describes a system or application, you should:
// 1. Identify all entities
// 2. Define attributes for each entity including data types
// 3. Establish relationships between entities with proper cardinality
// 4. If applicable, generate a complete XML diagram using this sample format(<ERD>
//   <tables>
//     <table name="Event">
//       <column name="EventID" type="integer" PK="true"/>
//       <column name="Name" type="string"/>
//       <column name="Date" type="date"/>
//       <column name="Time" type="time"/>
//       <column name="VenueID" type="integer" FK="true"/>
//     </table>

//     <table name="Customer">
//       <column name="CustomerID" type="integer" PK="true"/>
//       <column name="Name" type="string"/>
//       <column name="ContactInfo" type="string"/>
//       <column name="PaymentDetails" type="string"/>
//     </table>

//     <table name="Venue">
//       <column name="VenueID" type="integer" PK="true"/>
//       <column name="Name" type="string"/>
//       <column name="Location" type="string"/>
//       <column name="Capacity" type="integer"/>
//     </table>

//     <table name="Staff">
//       <column name="StaffID" type="integer" PK="true"/>
//       <column name="Name" type="string"/>
//       <column name="Role" type="string"/>
//       <column name="ContactInfo" type="string"/>
//     </table>

//     <table name="Booking">
//       <column name="BookingID" type="integer" PK="true"/>
//       <column name="EventID" type="integer" FK="true"/>
//       <column name="CustomerID" type="integer" FK="true"/>
//       <column name="VenueID" type="integer" FK="true"/>
//       <column name="StaffID" type="integer" FK="true"/>
//     </table>
//   </tables>
// </ERD>) showing:
//    - Entities
//    - Attributes
//    - Primary keys
//    - Foreign keys

// Always respond with:
// 1. A title for the ERD in the format TITLESTART ... TITLEEND and make sure the title is not more than 4 words (derived from user requirements, if applicable)
// 2. An optional XML code block containing the complete ERD diagram in the format XMLSTART ...xmlcontent XMLEND  (if applicable, otherwise null)
// 3. a follow up question relevant to the databse topic or asking for feedback from the user. make sure this is not more than 2 sentences

// Keep your XML simple and clean and ensure the diagram is readable.

// use this precise response structure
// `;

const ERD_SYSTEM_PROMPT = `
You are a database design expert. Your task is to generate and modify Entity Relationship Diagrams (ERDs) in XML format based on user requirements.

### When a user describes a system:
1. Identify all entities.
2. Define attributes for each entity including data types.
3. Establish relationships between entities with proper cardinality.
4. If this is the **first request**, generate a new XML ERD in this format:
   <ERD>
      <tables>...</tables>
   </ERD>

### When the user requests **modifications (e.g., adding an entity, attribute, or relationship)**:
1. **Retrieve the last generated ERD.**
2. **Modify the XML** by adding the new entity, attributes, or relationships.
3. **Preserve existing entities and relationships** while ensuring consistency.
4. **Return the updated ERD** in this format:
   - TITLESTART ... TITLEEND
   - XMLSTART ... updated XML ... XMLEND
   - A brief follow up question relevant to the databse topic or asking for feedback from the user. make sure this is not more than 2 sentences

### Example of an ERD Update:
**User:** "Add grades"
**Response:**
TITLESTART School ERD TITLEEND
XMLSTART 
<ERD>
  <tables>
    <table name="Student">...</table>
    <table name="Grades">
      <column name="GradeID" type="integer" PK="true"/>
      <column name="StudentID" type="integer" FK="true"/>
      <column name="Subject" type="string"/>
      <column name="Score" type="integer"/>
    </table>
  </tables>
</ERD>
XMLEND
Would you like to define grading scales or letter grades?
`;

export const generateERD = async (
  userMessage: string
): Promise<{ title: string; erdResponse: ERDResponse; thread_id: string }> => {
  try {
    const messages = [
      new SystemMessage(ERD_SYSTEM_PROMPT),
      new HumanMessage(userMessage),
    ];

    let thread_id = v4();
    config = { configurable: { thread_id } };

    const response = await app.invoke({ messages }, config);

    if (!(response?.messages?.at(-1) instanceof AIMessage)) {
      throw new Error("Unexpected response type from LLM");
    }

    const assistantMessage =
      typeof response?.messages?.at(-1)?.content === "string"
        ? response?.messages?.at(-1)?.content
        : "";

    const schemaMatch = assistantMessage
      ?.toString()
      .match(/XMLSTART\s*([\s\S]*?)\s*XMLEND/i);
    const schemaCode = schemaMatch ? schemaMatch[1].trim() : null; // Extracts only the XML content

    const titleMatch = assistantMessage
      ?.toString()
      .match(/TITLESTART\s*(.*?)\s*TITLEEND/i);

    const title = titleMatch ? titleMatch[1].trim() : "Database Response";

    // Extracts the follow-up question (last two sentences after XML)
    let aiResponse =
      assistantMessage
        ?.toString()
        .replace(schemaMatch?.[0] || "", "") // Remove XML section
        .replace(titleMatch?.[0] || "", "") // Remove title section
        .trim()
        .split(/[.!?]\s+/) // Split into sentences
        .slice(-2) // Get the last two sentences
        .join(". ") + "."; // Reconstruct with punctuation

    if (!aiResponse) {
      aiResponse = "Database response generated based on user query.";
    }

    return {
      thread_id,
      title,
      erdResponse: {
        userInput: userMessage,
        schemaCode,
        aiResponse,
      },
    };
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

export const updateERD = async (
  userMessage: string,
  thread_id: string
): Promise<{ erdResponse: ERDResponse }> => {
  try {
    const messages = [new HumanMessage(userMessage)];
    config = { configurable: { thread_id } };

    const response = await app.invoke({ messages }, config);

    if (!(response?.messages?.at(-1) instanceof AIMessage)) {
      throw new Error("Unexpected response type from LLM");
    }

    const assistantMessage =
      typeof response?.messages?.at(-1)?.content === "string"
        ? response?.messages?.at(-1)?.content
        : "";

    const schemaMatch = assistantMessage
      ?.toString()
      .match(/XMLSTART\s*([\s\S]*?)\s*XMLEND/i);
    const schemaCode = schemaMatch ? schemaMatch[1].trim() : null; // Extracts only the XML content

    const titleMatch = assistantMessage
      ?.toString()
      .match(/TITLESTART\s*(.*?)\s*TITLEEND/i);

    const title = titleMatch ? titleMatch[1].trim() : "Database Response";

    // Extracts the follow-up question (last two sentences after XML)
    let aiResponse =
      assistantMessage
        ?.toString()
        .replace(schemaMatch?.[0] || "", "") // Remove XML section
        .replace(titleMatch?.[0] || "", "") // Remove title section
        .trim()
        .split(/[.!?]\s+/) // Split into sentences
        .slice(-2) // Get the last two sentences
        .join(". ") + "."; // Reconstruct with punctuation

    if (!aiResponse) {
      aiResponse = "Database response generated based on user query.";
    }

    return {
      erdResponse: {
        userInput: userMessage,
        schemaCode,
        aiResponse,
      },
    };
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
