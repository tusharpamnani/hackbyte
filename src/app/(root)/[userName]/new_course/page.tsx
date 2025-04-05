/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AiCall from "../../../../components/new_course/AiCall";

const Page = () => {
  const pathname = usePathname(); // e.g., "/new_course/tushar"
  const segments = pathname.split("/").filter(Boolean); // ["new_course", "tushar"]
  const userName = segments[0]; // "tushar"

  const [outputData, setOutputData] = useState(null);
  const [Metadata, setMetadata] = useState(null);

  return (
    <div className="flex justify-center items-center w-full">
      <AiCall
        onOutputChange={setOutputData}
        onMetadataChange={setMetadata}
        userName={userName}
      />
    </div>
  );
};

export default Page;
