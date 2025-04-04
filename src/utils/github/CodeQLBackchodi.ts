/* eslint-disable @typescript-eslint/no-unused-vars */


import axios from "axios";
import { GithubTokenExtract } from "./GithubBackchodi";

class GitHubRepositoryAnalyzer {
  headers: { Authorization?: string };

  constructor(token) {
    this.headers = token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getRepositoryLanguages(owner, repo) {
    /**
     * Retrieves the languages used in a repository.
     */
    const languagesUrl = `https://api.github.com/repos/${owner}/${repo}/languages`;
    const languagesResponse = await axios.get(languagesUrl, {
      headers: this.headers,
    });
    return Object.keys(languagesResponse.data);
  }

  async findDependencyFiles(owner, repo, path = "", depth = 2) {
    /**
     * Recursively finds dependency files in a repository.
     */
    if (depth === 0) {
      return [];
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    try {
      const response = await axios.get(url, { headers: this.headers });
      const contents = response.data;
      let foundFiles = [];

      for (const item of contents) {
        if (item.type === "file") {
          const dependencyFiles = [
            "package.json",
            "pom.xml",
            "build.gradle",
            "requirements.txt",
            "go.mod",
            "Cargo.toml",
            "Gemfile",
            "composer.json",
            "Pipfile",
            "poetry.lock",
            "yarn.lock",
            "package-lock.json",
            "Gemfile.lock",
            "Pipfile.lock",
            "composer.lock",
          ];
          if (dependencyFiles.includes(item.name)) {
            foundFiles.push(item.path);
          }
        } else if (item.type === "dir") {
          const subFiles = await this.findDependencyFiles(
            owner,
            repo,
            item.path,
            depth - 1
          );
          foundFiles = foundFiles.concat(subFiles);
        }
      }

      return foundFiles;
    } catch (error) {
      console.log("error at QL", error);
      return [];
    }
  }

  async detectBuildSystem(owner, repo) {
    /**
     * Detects the build system based on found dependency files.
     */
    const dependencyFiles = await this.findDependencyFiles(owner, repo);
    let buildSystem = "None";
    const fileNames = dependencyFiles.map((file) => file.split("/").pop());

    if (fileNames.includes("pom.xml")) {
      buildSystem = "Maven";
    } else if (fileNames.includes("build.gradle")) {
      buildSystem = "Gradle";
    } else if (
      fileNames.some((file) =>
        ["package.json", "yarn.lock", "package-lock.json"].includes(file)
      )
    ) {
      buildSystem = "npm";
    } else if (
      fileNames.some((file) =>
        ["requirements.txt", "Pipfile", "Pipfile.lock", "poetry.lock"].includes(
          file
        )
      )
    ) {
      buildSystem = "pip";
    } else if (fileNames.includes("go.mod")) {
      buildSystem = "Go Modules";
    } else if (fileNames.includes("Cargo.toml")) {
      buildSystem = "Cargo";
    } else if (
      fileNames.some((file) => ["Gemfile", "Gemfile.lock"].includes(file))
    ) {
      buildSystem = "Bundler";
    } else if (
      fileNames.some((file) =>
        ["composer.json", "composer.lock"].includes(file)
      )
    ) {
      buildSystem = "Composer";
    }

    return { buildSystem, dependencyFiles };
  }

  async getRepositoryData(owner, repo) {
    /**
     * Retrieves general repository data.
     */
    const repoUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoResponse = await axios.get(repoUrl, { headers: this.headers });
    return repoResponse.data;
  }

  async generateCodeqlData(owner, repo) {
    /**
     * Generates CodeQL data for a repository.
     */
    const languages = await this.getRepositoryLanguages(owner, repo);
    const { buildSystem, dependencyFiles } = await this.detectBuildSystem(
      owner,
      repo
    );
    const repoData = await this.getRepositoryData(owner, repo);

    return {
      owner,
      repo,
      languages,
      build_system: buildSystem,
      dependency_files: dependencyFiles,
      default_branch: repoData.default_branch,
      description: repoData.description,
      clone_url: repoData.clone_url,
      html_url: repoData.html_url,
    };
  }
}

class GithubCodeQLGenerate {
  generateCodeQLYml(
    owner,
    repo,
    languages,
    buildSystem,
    dependencyFiles,
    defaultBranch,
    description,
    cloneUrl,
    htmlUrl
  ) {
    const codeqlLanguages = {
      c: "cpp",
      "c++": "cpp",
      cpp: "cpp",
      "objective-c": "cpp",
      "objective-c++": "cpp",
      "c#": "csharp",
      csharp: "csharp",
      go: "go",
      golang: "go",
      java: "java",
      kotlin: "java",
      javascript: "javascript",
      js: "javascript",
      typescript: "javascript",
      ts: "javascript",
      python: "python",
      py: "python",
      ruby: "ruby",
      swift: "swift",
    };

    const normalizedLanguages = languages.map((lang) => lang.toLowerCase());
    const selectedLanguages = [
      ...new Set(
        normalizedLanguages.map((lang) => codeqlLanguages[lang]).filter(Boolean)
      ),
    ];

    if (selectedLanguages.length === 0) {
      throw new Error(
        `No supported languages found for CodeQL analysis. Provided languages: ${languages}`
      );
    }

    let buildSteps = "";
    if (["npm", "yarn", "pnpm"].includes(buildSystem)) {
      const nodeCommand =
        buildSystem === "yarn"
          ? "yarn install --frozen-lockfile"
          : buildSystem === "pnpm"
          ? "pnpm install --frozen-lockfile"
          : "npm ci";
      buildSteps = `\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '18'\n          cache: '${buildSystem}'\n      - name: Install dependencies\n        run: ${nodeCommand}`;
    } else if (buildSystem === "maven") {
      buildSteps = `\n      - name: Set up JDK\n        uses: actions/setup-java@v3\n        with:\n          distribution: 'temurin'\n          java-version: '17'\n          cache: 'maven'\n      - name: Build with Maven\n        run: mvn -B compile`;
    } else if (buildSystem === "gradle") {
      buildSteps = `\n      - name: Set up JDK\n        uses: actions/setup-java@v3\n        with:\n          distribution: 'temurin'\n          java-version: '17'\n          cache: 'gradle'\n      - name: Build with Gradle\n        run: ./gradlew build --no-daemon`;
    } else if (["pip", "poetry"].includes(buildSystem)) {
      const pythonCommand =
        buildSystem === "poetry"
          ? "poetry install --no-interaction"
          : "pip install -r requirements.txt";
      buildSteps = `\n      - name: Set up Python\n        uses: actions/setup-python@v4\n        with:\n          python-version: '3.10'\n          cache: '${buildSystem}'\n      - name: Install dependencies\n        run: ${pythonCommand}`;
    } else if (buildSystem === "go") {
      buildSteps = `\n      - name: Set up Go\n        uses: actions/setup-go@v4\n        with:\n          go-version: '1.21'\n          cache: true\n      - name: Build\n        run: go build ./...`;
    } else if (buildSystem === "bundler") {
      buildSteps = `\n      - name: Set up Ruby\n        uses: ruby/setup-ruby@v1\n        with:\n          bundler-cache: true\n      - name: Install dependencies\n        run: bundle install`;
    }

    return `name: "CodeQL Analysis for ${repo}"

on:
  push:
    branches:
      - ${defaultBranch}
  pull_request:
    branches:
      - ${defaultBranch}
  schedule:
    - cron: '0 1 * * *'  # Run at 1 AM UTC every day
  workflow_dispatch:  # Allow manual triggering

permissions:
  contents: read
  security-events: write
  actions: write

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        language: ${JSON.stringify(selectedLanguages)}
    timeout-minutes: 60
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0${buildSteps}
      
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: \${{ matrix.language }}
          queries: security-extended,security-and-quality
      
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
      
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: \${{ matrix.language }}`;
  }
}

function removeBeforeName(str) {
  const index = str.indexOf("name");
  return index !== -1 ? str.substring(index) : str; 
}

// Usage this function to get the data
export async function CodeQLDataGenerator(owner, repo, userId) {
  console.log("userId", userId);
  const githubToken = await GithubTokenExtract(userId);
  const Owner = owner;
  const Repo = repo;

  const analyzer = new GitHubRepositoryAnalyzer(githubToken);
  const generator = new GithubCodeQLGenerate();
  const repository_data = await analyzer.generateCodeqlData(Owner, Repo);
  const result = generator.generateCodeQLYml(repository_data["owner"], repository_data["repo"], repository_data["languages"], repository_data["build_system"], repository_data["dependency_files"], repository_data["default_branch"], repository_data["description"], repository_data["clone_url"], repository_data["html_url"])
  
  return removeBeforeName(result);
}
