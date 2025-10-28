import fetch from 'node-fetch';

interface DummyJSONQuote {
  id: number;
  quote: string;
  author: string;
}

interface DummyJSONResponse {
  quotes: DummyJSONQuote[];
  total: number;
  skip: number;
  limit: number;
}

class DummyJSONService {
  private readonly baseUrl = 'https://dummyjson.com';

  async getRandomQuote(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes/random`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as DummyJSONQuote;
      return `${data.quote} - ${data.author}`;
    } catch (error) {
      const fallbackQuotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Life is what happens to you while you're busy making other plans. - John Lennon",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "It is during our darkest moments that we must focus to see the light. - Aristotle"
      ];
      
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      return fallbackQuotes[randomIndex]!
    }
  }

  async getQuotes(limit: number = 10): Promise<DummyJSONQuote[]> {
    try {
      const response = await fetch(`${this.baseUrl}/quotes?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as DummyJSONResponse;
      return data.quotes;
    } catch (error) {
      return [];
    }
  }
}

export default new DummyJSONService();