import React from "react";

import Image from "next/image";

enum CallStatus{
  INACTIVE = 'INACTIVE',
  CONNECTING  = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}
const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.ACTIVE
  const isSpeaking = true;
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            ></Image>
            {isSpeaking && <span className="animate-speak"></span>}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
          <Image
            src="/user-avatar.png"
            alt="user avatar"
            width={540}
            height={540}
            className="rounded-full object-cover size-[120px]"
          ></Image>
          <h3>{userName}</h3>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        {callStatus !== 'ACTIVE' ? ( 
          <button>
            <span>
              {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'call' : '. . .' }
            </span>
          </button>
        ): (
          <button className="btn-disconnect">END</button>
        )}
      </div>
    </>
  );
};

export default Agent;
