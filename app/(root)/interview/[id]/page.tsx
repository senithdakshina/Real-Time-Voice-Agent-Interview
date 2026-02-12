import { getInterviewById, getInterviewByUserId } from "@/lib/actions/genaral.action";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/auth.action ";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Agent from "@/components/Agent";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  const interview = await getInterviewByUserId(id);

  if (!interview) redirect("/");

  return (
    <div className="w-full px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top header row */}
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-row gap-4 items-center max-sm:flex-col">
            <div className="flex flex-row gap-4 items-center">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={40}
                height={40}
                className="rounded-full object-cover size-[40px]"
              />
              <h3 className="capitalize">{interview.role} Interview</h3>
            </div>

            <DisplayTechIcons techStack={interview.techstack} />
          </div>

          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
            {interview.type}
          </p>
        </div>

        {/* Title like screenshot */}
        <h2 className="text-white text-lg font-semibold mt-8 mb-5">
          Interview generation
        </h2>

        {/* Agent section (two big cards + call button) */}
        <Agent
          userName={user?.name ?? "User"}
          userId={user?.id ?? ""}
          interviewId={id}
          type="interview"
          questions={interview.questions}
        />
      </div>
    </div>
  );
};

export default page;
 