/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { GithubTokenExtract } from "./GithubBackchodi";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

export async function getOwnerId(
  ownerType: "user" | "organization",
  owner: string,
  githubToken: string
): Promise<string | null> {
  /**
   * Get the node ID for the owner (user or organization)
   *
   * @param {("user" | "organization")} ownerType - Either "user" or "organization"
   * @returns {Promise<string | null>} The node ID or null if an error occurs
   */

  if (!owner) {
    console.error("Owner name is required");
    return null;
  }

  if (!githubToken) {
    console.error("GitHub token is required");
    return null;
  }

  if (!["user", "organization"].includes(ownerType)) {
    console.error(
      `Invalid owner type: ${ownerType}. Must be 'user' or 'organization'`
    );
    return null;
  }

  // GraphQL query to fetch owner ID
  const query = `
    query($login: String!) {
      ${ownerType}(login: $login) {
        id
      }
    }
  `;

  const variables = { login: owner };

  try {
    const response = await axios.post(
      GITHUB_GRAPHQL_URL,
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    if (responseData.errors) {
      console.error("Failed to get owner ID:", responseData.errors);
      return null;
    }

    const ownerId = responseData.data?.[ownerType]?.id;

    if (!ownerId) {
      console.error(`No ID found for ${ownerType} '${owner}'`);
      return null;
    }

    return ownerId;
  } catch (error) {
    handleAxiosError(error, "Error fetching owner ID");
    return null;
  }
}

// Helper function to handle Axios errors
function handleAxiosError(error: unknown, prefix: string = "Error"): void {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(
        `${prefix}: ${axiosError.response.status} - ${JSON.stringify(
          axiosError.response.data
        )}`
      );
    } else if (axiosError.request) {
      console.error(`${prefix}: No response received`, axiosError.request);
    } else {
      console.error(`${prefix}: ${axiosError.message}`);
    }
  } else {
    console.error(`${prefix}:`, error);
  }
}

interface ProjectDetails {
  id: string;
  title: string;
  url: string;
  number: number;
  fields: {
    nodes: Array<{
      id: string;
      name: string;
      dataType: string;
      options?: Array<{ id: string; name: string }>;
    }>;
  };
}

interface IssueData {
  title: string;
  body: string;
  labels?: string[];
}

// interface ApiResult<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

class GithubProject {
  ownerType: "user" | "organization";
  owner: string;
  githubToken: string;
  GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
  GITHUB_REST_API_URL = "https://api.github.com";

  constructor(
    ownerType: "user" | "organization",
    owner: string,
    githubToken: string
  ) {
    if (!owner) throw new Error("Owner name is required");
    if (!githubToken) throw new Error("GitHub token is required");
    if (!["user", "organization"].includes(ownerType)) {
      throw new Error(
        `Invalid owner type: ${ownerType}. Must be 'user' or 'organization'`
      );
    }

    this.ownerType = ownerType;
    this.owner = owner;
    this.githubToken = githubToken;
  }

  getHeaders() {
    return {
      Authorization: `Bearer ${this.githubToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.v3+json",
    };
  }

  async getOwnerId(): Promise<string | null> {
    return await getOwnerId(this.ownerType, this.owner, this.githubToken);
  }

  async createIssue(
    title: string,
    body: string,
    label: string,
    repo: string,
    owner: string = this.owner
  ): Promise<any | null> {
    if (!title) {
      console.error("Issue title is required");
      return null;
    }

    if (!body) {
      console.error("Issue body is required");
      return null;
    }

    if (!repo) {
      console.error("Repository name is required");
      return null;
    }

    if (!owner) {
      console.error("Owner name is required");
      return null;
    }

    const url = `${this.GITHUB_REST_API_URL}/repos/${owner}/${repo}/issues`;
    const headers = this.getHeaders();

    const data: IssueData = {
      title: title,
      body: body,
    };

    if (label) {
      data.labels = [label];
    }

    try {
      const response = await axios.post(url, data, { headers });

      if (response.status !== 201) {
        console.error(`Failed to create issue. Status: ${response.status}`);
        return null;
      }

      return response.data;
    } catch (error) {
      handleAxiosError(error, "Error creating issue");
      return null;
    }
  }

  async createProject(title: string): Promise<string | null> {
    if (!title) {
      console.error("Project title is required");
      return null;
    }

    const ownerId = await this.getOwnerId();

    if (!ownerId) {
      console.error("Failed to get owner ID for project creation");
      return null;
    }

    const query = `mutation($ownerId: ID!, $title: String!) {
      createProjectV2(input: {ownerId: $ownerId, title: $title}) {
        projectV2 {
          id
          title
          url
          number
        }
      }
    }`;

    const variables = {
      ownerId: ownerId,
      title: title,
    };

    const requestData = {
      query,
      variables,
    };

    try {
      const response = await axios.post(this.GITHUB_GRAPHQL_URL, requestData, {
        headers: this.getHeaders(),
      });

      const responseData = response.data;

      if (responseData.errors) {
        console.error("Failed to create project:", responseData.errors);
        return null;
      }

      const projectId = responseData.data?.createProjectV2?.projectV2?.id;

      if (!projectId) {
        console.error("Project ID not found in response");
        return null;
      }

      return projectId;
    } catch (error) {
      handleAxiosError(error, "Error creating project");
      return null;
    }
  }

  async getProjectDetails(projectId: string): Promise<ProjectDetails | null> {
    if (!projectId) {
      console.error("Project ID is required");
      return null;
    }

    const query = `
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          id
          title
          url
          number
          fields(first: 20) {
            nodes {
              ... on ProjectV2Field {
                id
                name
                dataType
              }
              ... on ProjectV2IterationField {
                id
                name
                dataType
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                dataType
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
    `;

    const variables = { projectId };
    const requestData = { query, variables };

    try {
      const response = await axios.post(this.GITHUB_GRAPHQL_URL, requestData, {
        headers: this.getHeaders(),
      });

      const responseData = response.data;

      if (responseData.errors) {
        console.error(`Failed to get project details:`, responseData.errors);
        return null;
      }

      if (!responseData.data?.node) {
        console.error("No project data found in response");
        return null;
      }

      return responseData.data.node as ProjectDetails;
    } catch (error) {
      handleAxiosError(error, "Error fetching project details");
      return null;
    }
  }

  async createStatusField(
    projectId: string
  ): Promise<{
    fieldId: string | null;
    options: { id: string; name: string }[] | null;
  }> {
    if (!projectId) {
      console.error("Project ID is required");
      return { fieldId: null, options: null };
    }

    const query = `mutation($projectId: ID!) {
    createProjectV2Field(input: {
      projectId: $projectId,
      dataType: SINGLE_SELECT,
      name: "Status",
      singleSelectOptions: [
        {name: "Todo", color: "BLUE"},
        {name: "In Progress", color: "YELLOW"},
        {name: "Done", color: "GREEN"}
      ]
    }) {
      projectV2Field {
        ... on ProjectV2SingleSelectField {
          id
          name
          options {
            id
            name
          }
        }
      }
    }
  }`;

    const variables = { projectId };
    const requestData = { query, variables };

    try {
      const response = await axios.post(this.GITHUB_GRAPHQL_URL, requestData, {
        headers: this.getHeaders(),
      });

      const responseData = response.data;

      if (responseData.errors) {
        console.error("Failed to create status field:", responseData.errors);
        return { fieldId: null, options: null };
      }

      console.log("Response of fields created", responseData);

      const fieldData = responseData.data?.createProjectV2Field?.projectV2Field;

      if (!fieldData) {
        console.error("Field data not found in response");
        return { fieldId: null, options: null };
      }

      const fieldId = fieldData.id;
      const options =
        fieldData.options?.map((option: any) => ({
          id: option.id,
          name: option.name,
        })) || null;

      return { fieldId, options };
    } catch (error) {
      handleAxiosError(error, "Error creating status field");
      return { fieldId: null, options: null };
    }
  }

  async addIssueToProject(
    issueId: string,
    projectId: string
  ): Promise<string | null> {
    if (!issueId) {
      console.error("Issue ID is required");
      return null;
    }

    if (!projectId) {
      console.error("Project ID is required");
      return null;
    }

    const query = `mutation($projectId: ID!, $contentId: ID!) {
    addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
      item {
        id
      }
    }
  }`;

    const variables = { projectId, contentId: issueId };
    const requestData = { query, variables };

    try {
      const response = await axios.post(this.GITHUB_GRAPHQL_URL, requestData, {
        headers: this.getHeaders(),
      });

      const responseData = response.data;

      if (responseData.errors) {
        console.error("Failed to add issue to project:", responseData.errors);
        return null;
      }

      const itemId = responseData.data?.addProjectV2ItemById?.item?.id;

      if (!itemId) {
        console.error("Item ID not found in response");
        return null;
      }

      // Get or create Status field and Todo option
      const { fieldId: statusFieldId, options } =
        await this.getOrCreateStatusFieldId(projectId);

      const todoOptionId =
        options?.find((option) => option.name === "Todo")?.id || null;

      if (!statusFieldId || !todoOptionId) {
        console.error("Failed to get or create Status field");
        return null;
      }

      // Set status to Todo
      const statusUpdated = await this.setItemStatus(
        projectId,
        itemId,
        statusFieldId,
        todoOptionId
      );

      return statusUpdated ? itemId : null;
    } catch (error) {
      handleAxiosError(error, "Error adding issue to project");
      return null;
    }
  }

  async setItemStatus(
    projectId: string,
    itemId: string,
    fieldId: string,
    optionId: string
  ): Promise<boolean> {
    if (!projectId || !itemId || !fieldId || !optionId) {
      console.error("Missing required parameters for setItemStatus:", {
        projectId: !!projectId,
        itemId: !!itemId,
        fieldId: !!fieldId,
        optionId: !!optionId,
      });
      return false;
    }

    const query = `mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId,
        itemId: $itemId,
        fieldId: $fieldId,
        value: { singleSelectOptionId: $optionId }
      }) {
        projectV2Item {
          id
        }
      }
    }`;

    const variables = { projectId, itemId, fieldId, optionId };
    const requestData = { query, variables };

    try {
      const response = await axios.post(this.GITHUB_GRAPHQL_URL, requestData, {
        headers: this.getHeaders(),
      });

      const responseData = response.data;

      console.log("Response Item issue update", responseData);

      if (responseData.errors) {
        console.error("Failed to update status field:", responseData.errors);
        return false;
      }

      if (
        !responseData.data?.updateProjectV2ItemFieldValue?.projectV2Item?.id
      ) {
        console.error("Updated item ID not found in response");
        return false;
      }

      return true;
    } catch (error) {
      handleAxiosError(error, "Error setting item status");
      return false;
    }
  }

  async getOrCreateStatusFieldId(
    projectId: string
  ): Promise<{
    fieldId: string | null;
    options: { id: string; name: string }[] | null;
  }> {
    if (!projectId) {
      console.error("Project ID is required for getOrCreateStatusFieldId");
      return { fieldId: null, options: null };
    }

    const projectDetails = await this.getProjectDetails(projectId);
    if (!projectDetails) {
      console.error("Failed to get project details");
      return { fieldId: null, options: null };
    }

    const fields = projectDetails.fields.nodes;
    const statusField = fields.find(
      (field) => field.name === "Status" && field.dataType === "SINGLE_SELECT"
    );

    if (statusField) {
      const options =
        statusField.options?.map((option: any) => ({
          id: option.id,
          name: option.name,
        })) || null;

      if (!options || options.length === 0) {
        console.warn("Status field exists but no valid options found");
      }

      return { fieldId: statusField.id, options };
    }

    // If the field doesn't exist, create it
    return await this.createStatusField(projectId);
  }
}

export interface ProjectWithIssueResult {
  success: boolean;
  projectId?: string;
  issueNumber?: number;
  issueId?: string;
  itemId?: string; // Add this line
  error?: string;
}

export interface ProjectWithIssueParams {
  owner: string;
  userId: string;
  repoName: string;
  githubToken?: string;
  ownerType?: "user" | "organization";
  projectId?: string | null;
  projectTitle?: string | null;
  issueTitle?: string | null;
  issueBody?: string;
  issueLabel?: string;
}

/**
 * Example usage of the GitHub Project API
 * @param ownerType - 'user' or 'organization'
 * @param owner - GitHub username or organization name
 * @param githubToken - Personal access token with appropriate permissions
 * @param repoName - Repository name to create issues in
 * @returns {Promise<ProjectWithIssueResult>} - Result of the operation
 */
export async function createProjectWithIssue({
  owner,
  userId,
  repoName,
  ownerType = 'user',
  projectId,
  issueTitle,
  issueBody,
  issueLabel
}: ProjectWithIssueParams): Promise<ProjectWithIssueResult> {
  if (!owner) {
    console.error('Missing required parameter: owner is required');
    return { success: false, error: 'Owner is required' };
  }

  const githubToken = await GithubTokenExtract(userId);

  if (!repoName) {
    console.error('Missing required parameter: repoName is required');
    return { success: false, error: 'Repository name is required' };
  }

  try {
    const githubProject = new GithubProject(ownerType, owner, githubToken);
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const result: ProjectWithIssueResult = { success: false };
    
    // Step 1: Get or create project
    result.projectId = projectId;
    
    // Step 2: Create a new issue
    const actualIssueTitle = issueTitle || `Issue (${timestamp})`;
    console.log(`Creating issue: "${actualIssueTitle}"`);
    
    const issueData = await githubProject.createIssue(
      actualIssueTitle,
      issueBody,
      issueLabel,
      repoName,
      owner
    );
    
    if (!issueData) {
      console.error('Failed to create issue.');
      return { ...result, success: false, error: 'Failed to create issue' };
    }
    
    console.log(`Issue created: #${issueData.number} (${issueData.html_url})`);
    result.issueNumber = issueData.number;
    
    // GitHub REST API returns node_id which we need for the GraphQL API
    const issueNodeId = issueData.node_id;
    
    if (!issueNodeId) {
      console.error('Issue node ID not found in response.');
      return { ...result, success: false, error: 'Issue node ID not found in response' };
    }
    
    result.issueId = issueNodeId;
    
    // Step 3: Add the issue to the project with Todo status
    console.log(`Adding issue to project...`);
    
    const itemId = await githubProject.addIssueToProject(issueNodeId, projectId);
    
    if (itemId) {
      console.log('Operation completed successfully!');
      console.log(`Issue #${issueData.number} added to project ID ${projectId} with item ID ${itemId}`);
      return { ...result, success: true, itemId };
    } else {
      console.error('Failed to add issue to project.');
      return { ...result, success: false, error: 'Failed to add issue to project' };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in createProjectWithIssue:', errorMessage);
    return { 
      success: false, 
      error: `Error in createProjectWithIssue: ${errorMessage}`,
      projectId: projectId || undefined
    };
  }
}
export async function CreateProject(
  owner: string,
  userId: string,
  ownerType: "user" | "organization" = "user",
  projectTitle: string | null = null
) {
  const actualProjectTitle = projectTitle;
  const githubToken = await GithubTokenExtract(userId);
  const githubProject = new GithubProject(ownerType, owner, githubToken);
  const projectId = await githubProject.createProject(actualProjectTitle);
  if (!projectId) {
    console.error("Failed to create project. Exiting.");
    return { success: false, error: "Failed to create project" };
  }
  return projectId;
}

export async function UpdateIssues(
  projectId: string,
  issues: { issueId: string; itemId : string; status: string }[], // Accepts an array of issues with statuses
  userId: string,
  owner: string
) {
  // Fetch GitHub Token
  const githubToken = await GithubTokenExtract(userId);
  const githubProject = new GithubProject("user", owner, githubToken);

  // Get Status Field IDs
  const { fieldId: statusFieldId, options } =
    await githubProject.getOrCreateStatusFieldId(projectId);
  const todoOptionId =
    options?.find((option) => option.name === "Todo")?.id || null;
  const inProgressOptionId =
    options?.find((option) => option.name === "In Progress")?.id || null;
  const doneOptionId =
    options?.find((option) => option.name === "Done")?.id || null;
  console.log(
    "todoOptionId, inProgressOptionId, doneOptionId",
    todoOptionId,
    inProgressOptionId,
    doneOptionId
  );

  if (!statusFieldId) {
    console.error("Status field ID not found");
    return;
  }

  console.log({issues});

  // Iterate over each issue and update its status
  for (const { issueId, status, itemId } of issues) {
    const statusOptionId =
      status === "not started"
        ? todoOptionId
        : status === "in progress"
        ? inProgressOptionId
        : status === "completed"
        ? doneOptionId
        : null;

    if (statusOptionId === null) {
      console.error(`Invalid status provided for issue ${issueId}`);
      continue;
    }

    const updatedStatus = await githubProject.setItemStatus(
      projectId,
      itemId,
      statusFieldId,
      statusOptionId,
    );

    if (!updatedStatus) {
      console.error(`Status not updated for issue ${issueId}`);
    }
  }

  return true;
}

export default GithubProject;
