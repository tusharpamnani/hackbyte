import axios from "axios";
import { GithubTokenExtract } from "./GithubBackchodi";

export async function createRepo(id : string, RepoName : string, description : string) {
    const ACCESS_TOKEN = await GithubTokenExtract(id);
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const url = "https://api.github.com/user/repos";
  const data = {
    name: RepoName,
    description: description ?? '',
    private: true,
    is_template: false,
  };
  const response = axios.post(url, data, { headers })
  
  const returns = await response;
  
    return returns.data.name;
}
