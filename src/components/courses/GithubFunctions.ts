import axios from "axios";

export async function CreateIssue (
    owner,
    repoName,
    ownerType,
    BatchProjectId,
    projectTitle,
    batchId,
    userId,
    steps
) {
    // Creating a new variable to store title and description along with index
    const stepSummaries = steps.map((step, index) => ({
        index: index,
        title: step.step.stepTitle,
        body: step.step.description,
        issueId: null, // Placeholder for storing issueId
        itemId: null,
    }));

    const repo = await axios.post("/api/ai/github/repo", {
        userId,
        repoName,
        desc: "This is a test repo",
    });

    repoName = repo.data.RepoName

    // Loop through each step and make API request
    for (const step of stepSummaries) {
        try {
            const response = await axios.post("/api/ai/github/projects", {
                owner,
                userId,
                batchId,
                repoName : repoName,
                BatchProjectId,  // Ensure this variable is defined somewhere
                ownerType,
                projectTitle,
                issueLabel: "task", // Set appropriate issue label
                issueTitle: step.title,
                issueBody: step.body
            });

            if (response.data.success) {
                step.issueId = response.data.issueId; // Store issueId in the corresponding step
                step.itemId = response.data.itemId;
                console.log("Github FUnction", step.issueId, step.itemId);
            }
             else {
                console.error(`Failed to create issue for step ${step.index}`);
            }
        } catch (error) {
            console.error(`Error creating issue for step ${step.index}:`, error);
        }
    }

    console.log("stepSummaries", stepSummaries); // Output updated stepSummaries with issueIds
    return stepSummaries;
}
