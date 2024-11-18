import Airtable from 'airtable';

interface Message {
  content: string;
}

interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
}

class MessageStore {
  private base: Airtable.Base;
  private tableName: string;
  private retryConfig: RetryConfig;
  private scriptExecuted: boolean = false;
  
  constructor(apiKey: string, baseId: string, tableName: string) {
    if (!apiKey || !baseId || !tableName) {
      throw new Error('Missing required configuration for MessageStore');
    }
    
    this.base = new Airtable({ apiKey }).base(baseId);
    this.tableName = tableName;
    this.retryConfig = {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000
    };
  }

  setScriptExecuted(status: boolean) {
    this.scriptExecuted = status;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    let delayMs = this.retryConfig.initialDelay;

    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Attempt ${attempt} failed:`, error);
        
        if (attempt < this.retryConfig.maxAttempts) {
          await this.delay(delayMs);
          delayMs = Math.min(delayMs * 2, this.retryConfig.maxDelay);
        }
      }
    }

    throw new Error(`Failed after ${this.retryConfig.maxAttempts} attempts. Last error: ${lastError?.message || 'Unknown error'}`);
  }

  async addMessage(content: string): Promise<void> {
    if (!this.scriptExecuted) {
      throw new Error('Cannot send message before script execution');
    }

    if (!content?.trim()) {
      throw new Error('Message content cannot be empty');
    }

    try {
      await this.retryOperation(async () => {
        const result = await this.base(this.tableName).create([
          {
            fields: {
              Content: content.trim()
            }
          }
        ]);

        if (!result?.[0]?.id) {
          throw new Error('Failed to verify message creation');
        }

        return result;
      });

      console.log("Message successfully stored in Airtable");
    } catch (error) {
      console.error("Failed to store message:", error);
      throw error;
    }
  }
}

export const messageStore = new MessageStore(
  "patyJyLhr6RqWRxF8.3f3a8d5f2c62f08e9dfa052c7f3bc86a69ece5d071201249ee5fd9503fc204b5",
  "appcfPr9gkxX9wbty",
  "Table 1"
);
