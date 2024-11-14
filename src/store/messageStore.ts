import Airtable from 'airtable';

// Configure Airtable with environment variables
const apiKey = "patyJyLhr6RqWRxF8.3f3a8d5f2c62f08e9dfa052c7f3bc86a69ece5d071201249ee5fd9503fc204b5";
const baseId = "appcfPr9gkxX9wbty";
const base = new Airtable({ apiKey }).base(baseId);

interface Message {
  content: string;
  timestamp: number;
  username: string;
}

class MessageStore {
  private tableName = 'Table 1'; // Replace with your Airtable table name, like 'Messages'

  async addMessage(content: string): Promise<void> {
    try {
      await base(this.tableName).create([
        {
          fields: {
            Content: content  // Ensure this matches your single Airtable field name
          }
        }
      ]);
      console.log("Message successfully sent to Airtable");
    } catch (error) {
      console.error("Error sending message to Airtable:", error);
    }
  }
  
}

export const messageStore = new MessageStore();
