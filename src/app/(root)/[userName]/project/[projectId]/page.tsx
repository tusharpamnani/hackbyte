import { GetProjectByProjectId } from "../../../../../components/actions/project";
import ProjectPage from "../../../../../components/projects/Projectage";

const Page = async ({ params }: { params: { projectId: string } }) => {

  let project = null;
  const{projectId} = await params

  if (params){
    project = await GetProjectByProjectId(projectId);
  }

  if (!project) {
    return <div className="text-center text-red-500 text-lg">User not found</div>;
  }

  return (
    <div className="">
      <ProjectPage params={project}/>
    </div>
  );
};

export default Page;
