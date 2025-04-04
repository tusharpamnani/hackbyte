import { ChevronDown, ChevronRight } from 'lucide-react';
import ProjectCard, { Project } from './ProjectCard';

interface Batch {
  id: string;
  number: string;
  projects?: Project[];
}

interface BatchListProps {
  batches: Batch[];
  expandedBatch: string | null;
  onBatchToggle: (batchId: string) => void;
  onStartProject: (projectId: string) => void;
}

const BatchList: React.FC<BatchListProps> = ({ batches, expandedBatch, onBatchToggle, onStartProject }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-700">Batches</h3>
      {batches.length > 0 ? (
        batches.map(({ id, number, projects }) => (
          <div
            key={id}
            className="border rounded-lg p-4 mb-4 shadow hover:shadow-md transition bg-gray-50"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => onBatchToggle(id)}
              aria-expanded={expandedBatch === id}
            >
              <h4 className="font-semibold text-lg text-gray-800">
                Batch Number: {number}
              </h4>
              {expandedBatch === id ? (
                <ChevronDown className="text-blue-500" />
              ) : (
                <ChevronRight className="text-blue-500" />
              )}
            </div>

            {expandedBatch === id && (
              <div className="mt-3 space-y-3">
                {projects?.length ? (
                  projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={{ ...project, batchId: id }}
                      onStartProject={onStartProject}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No projects found.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No batches found for this course.</p>
      )}
    </div>
  );
};

export default BatchList;
