/**
 * Message Store - Data Collection for Cybersecurity Research
 * 
 * This module handles message collection and storage for demonstration purposes.
 * In a real attack scenario, this is where captured data would be processed.
 * 
 * EDUCATIONAL USE ONLY - For security research and awareness training.
 */

import Airtable from 'airtable';

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

// Get configuration from environment variables
const getConfig = () => {
  const apiKey = (import.meta as any).env?.VITE_AIRTABLE_API_KEY;
  const baseId = (import.meta as any).env?.VITE_AIRTABLE_BASE_ID;
  const tableName = (import.meta as any).env?.VITE_AIRTABLE_TABLE_NAME || 'Messages';

  if (!apiKey || !baseId) {
    console.error('Missing Airtable configuration. Please check your .env file.');
    // Return dummy values for development/demo purposes
    return {
      apiKey: 'demo_key',
      baseId: 'demo_base',
      tableName: 'Messages'
    };
  }

  return { apiKey, baseId, tableName };
};

const config = getConfig();

export const messageStore = new MessageStore(
  config.apiKey,
  config.baseId,
  config.tableName
);
