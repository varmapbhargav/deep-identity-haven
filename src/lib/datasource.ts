import { toast } from 'sonner';

export interface DataSourceConnector {
  name: string;
  verify: (userData: any) => Promise<boolean>;
  getData: (userId: string) => Promise<any>;
}

class GitHubConnector implements DataSourceConnector {
  name = 'github';

  async verify(userData: any): Promise<boolean> {
    try {
      const response = await fetch(`https://api.github.com/users/${userData.username}`);
      if (!response.ok) throw new Error('GitHub verification failed');
      return true;
    } catch (error) {
      console.error("GitHub verification failed:", error);
      return false;
    }
  }

  async getData(userId: string): Promise<any> {
    try {
      const response = await fetch(`https://api.github.com/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch GitHub data');
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch GitHub data:", error);
      throw error;
    }
  }
}

class TwitterConnector implements DataSourceConnector {
  name = 'twitter';

  async verify(userData: any): Promise<boolean> {
    // Twitter API requires OAuth, this is a placeholder
    // In production, you'd implement proper OAuth flow
    toast.error("Twitter verification not implemented");
    return false;
  }

  async getData(userId: string): Promise<any> {
    toast.error("Twitter data fetching not implemented");
    throw new Error("Twitter integration not implemented");
  }
}

export const dataSourceConnectors: Record<string, DataSourceConnector> = {
  github: new GitHubConnector(),
  twitter: new TwitterConnector(),
};