export function filterByBatches(projects) {
    const batches = {};
  
    projects.forEach((project) => {
      const batchId = project.batch - 1;
      if (!batches[batchId]) {
        batches[batchId] = {
          batchId,
          projects: [],
        };
      }
      batches[batchId].projects.push(project);
    });
  
    return Object.values(batches);
  }
  