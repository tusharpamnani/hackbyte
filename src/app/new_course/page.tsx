"use client"

import React, { useState } from "react";
import OutputDisplay from "../../components/new_course/OutputDisplay";
import AiCall from "../../components/new_course/AiCall";

const Page = () => {
  const [outputData, setOutputData] = useState(null);
  const [Metadata, setMetadata] = useState(null)
  return (
    <div className="flex flex-col justify-center items-center">
      <AiCall onOutputChange={setOutputData} onMetadataChange = {setMetadata}/>
      {outputData && <OutputDisplay output={outputData} metadata={Metadata}/>}
    </div>
  );
};

export default Page;
