"use client";

import { useState } from "react";
import { Megaphone, MessageSquare } from "lucide-react";
import { AnnouncementsPanel } from "./announcements-panel";
import { MessagesPanel } from "./messages-panel";
import { Role } from "@prisma/client";

type Announcement = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  audience: Role[];
  createdAt: string;
};

type UserOption = { id: string; name: string; role: Role };

type MessageItem = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

export function CommunicationTabs({
  currentUserId,
  canBroadcast,
  announcements,
  users,
  messages,
}: {
  currentUserId: string;
  canBroadcast: boolean;
  announcements: Announcement[];
  users: UserOption[];
  messages: MessageItem[];
}) {
  const [tab, setTab] = useState<"announcements" | "messages">("announcements");

  return (
    <div>
      <div className="flex gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-1 w-fit">
        <button
          onClick={() => setTab("announcements")}
          className={`flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm transition ${
            tab === "announcements"
              ? "bg-[var(--background)] text-[var(--foreground)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          <Megaphone size={14} /> Avisos
        </button>
        <button
          onClick={() => setTab("messages")}
          className={`flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm transition ${
            tab === "messages"
              ? "bg-[var(--background)] text-[var(--foreground)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          <MessageSquare size={14} /> Mensajes
        </button>
      </div>

      <div className="mt-5">
        {tab === "announcements" ? (
          <AnnouncementsPanel
            canBroadcast={canBroadcast}
            announcements={announcements}
          />
        ) : (
          <MessagesPanel
            currentUserId={currentUserId}
            users={users}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
}
