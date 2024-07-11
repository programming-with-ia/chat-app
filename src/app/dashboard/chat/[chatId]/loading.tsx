import { Skeleton } from "@/components/skeleton";
import { cn } from "@/lib/utils";
import { FC } from "react";

const loading: FC<{}> = () => {
  return (
    <div className="flex flex-col h-full items-center relative p-8">
      <Skeleton height={40} width={400} />
      {/* chat messages */}
      <div className="flex-1 flex flex-col gap-6 max-h-full overflow-y-auto w-full mt-9 customScrollBar">
        {Array.from({ length: 6 }, () => Math.random()).map((num, idx) => (
          <ChatLoading key={idx} alignRignt={num < 0.5} />
        ))}
      </div>
      <Skeleton className="w-full fixed bottom-0" height={40} width={400} />
    </div>
  );
};

import React from "react";

function ChatLoading({ alignRignt }: { alignRignt?: boolean }) {
  return (
    <div
      className={cn(
        "flex gap-3 items-center",
        alignRignt && "justify-self-end flex-row-reverse"
      )}
    >
      <Skeleton className="rounded-full" width={40} height={40} />
      <Skeleton width={150} height={20} />
    </div>
  );
}

export default loading;
