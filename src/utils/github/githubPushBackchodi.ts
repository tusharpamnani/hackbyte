import axios from "axios";
import yaml from "js-yaml";
import { GithubTokenExtract } from "./GithubBackchodi";

class GithubRepoPush {
  private owner: string;
  private repoName: string;
  private githubToken: string;
  private store: string;
  private headers: Record<string, string>;

  constructor(
    owner: string,
    repoName: string,
    githubToken: string,
    store: string
  ) {
    if (!owner || !repoName || !githubToken || !store) {
      throw new Error(
        "Missing required parameters: owner, repoName, githubToken, or store."
      );
    }

    this.owner = owner;
    this.repoName = repoName;
    this.githubToken = githubToken;
    this.store = store;

    this.headers = {
      Authorization: `token ${this.githubToken}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  async uploadFile(): Promise<boolean> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repoName}/contents/.github/workflows/codeql.yml`;
    try {
      // Encode YAML content to Base64
      const yamlContent = typeof this.store === "string" ? this.store : yaml.dump(this.store, { lineWidth: -1 });
      const base64Content = Buffer.from(yamlContent, "utf-8").toString("base64");
      
      // Prepare the base payload
      const payload: {
        message: string;
        content: string;
        branch: string;
        sha?: string;
      } = {
        message: "Added CodeQL security scan workflow",
        content: base64Content,
        branch: "main",
      };
      
      let sha = null;
      
      // Try to get the file first to check if it exists
      try {
        const response = await axios.get(url, { headers: this.headers });
        // If successful, file exists - get the SHA for the update
        sha = response.data.sha;
        payload.message = "Updated CodeQL security scan workflow";
        payload.sha = sha;
      } catch (getError) {
        // If 404, file doesn't exist - we'll create it
        // Any other error should be thrown
        if (getError.response?.status !== 404) {
          throw getError;
        }
      }
      
      // Make the PUT request - this works for both create and update
      const putResponse = await axios.put(url, payload, {
        headers: this.headers,
      });
      
      if ([200, 201, 204].includes(putResponse.status)) {
        console.log(`✅ Successfully ${sha ? 'updated' : 'added'} CodeQL to ${this.repoName}`);
        return true;
      } else {
        console.error(
          `❌ Failed to ${sha ? 'update' : 'add'} CodeQL to ${this.repoName}:`,
          putResponse.data
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      return false;
    }
  }

  // --- FUNCTION TO TRIGGER CODEQL WORKFLOW ---
  async triggerWorkflow(retries = 3, delay = 2000): Promise<boolean> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repoName}/actions/workflows/codeql.yml/dispatches`;
    
    // Fix the authorization header format
    const headers = {
      Authorization: `token ${this.githubToken}`, // Changed from Bearer to token
      Accept: "application/vnd.github.v3+json",
    };
    
    const payload = { ref: "main" };
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        // Add a delay before trying again (except for first attempt)
        if (attempt > 0) {
          console.log(`Waiting ${delay/1000} seconds before retry ${attempt+1}/${retries}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        const response = await axios.post(url, payload, { headers });
        
        if (response.status === 204) {
          console.log(`🚀 CodeQL workflow triggered for ${this.repoName}`);
          return true;
        } else {
          console.log(
            `⚠️ Unexpected response when triggering workflow (attempt ${attempt+1}/${retries}):`,
            response.status
          );
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(
            `⚠️ Workflow file not found yet (attempt ${attempt+1}/${retries}). GitHub may still be processing the upload.`
          );
        } else {
          console.error(
            `❌ Error triggering CodeQL workflow (attempt ${attempt+1}/${retries}):`,
            error.response?.data || error.message
          );
        }
        
        // If this is the last attempt, return false
        if (attempt === retries - 1) {
          return false;
        }
        
        // Otherwise, continue to next attempt after delay
      }
    }
    
    return false;
  }
}

// --- FUNCTION TO PUSH AND ACTIVATE CODEQL ---
export const PushAndActivateCodeQL = async (
  owner: string,
  repoName: string,
  id: string,
  store: string
): Promise<boolean> => {
  try {
    const githubToken = await GithubTokenExtract(id);
    if (!githubToken) {
      console.error("❌ Failed to extract GitHub token. Aborting workflow.");
      return false;
    }
    
    const githubRepoPush = new GithubRepoPush(
      owner,
      repoName,
      githubToken,
      store
    );

    console.log(`🚀 Uploading CodeQL workflow to ${owner}/${repoName}...`);
    const fileUploaded = await githubRepoPush.uploadFile();

    if (!fileUploaded) {
      console.error(
        "❌ Failed to upload CodeQL file. Aborting workflow trigger."
      );
      return false;
    }

    console.log(`✅ CodeQL file uploaded successfully. Triggering workflow...`);
    const workflowTriggered = await githubRepoPush.triggerWorkflow();

    if (!workflowTriggered) {
      console.error("⚠️ Failed to trigger CodeQL workflow.");
      return false;
    }

    console.log("🚀 CodeQL workflow triggered successfully.");
    return true;
  } catch (error) {
    console.error(
      "❌ Error in PushAndActivateCodeQL:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
};
