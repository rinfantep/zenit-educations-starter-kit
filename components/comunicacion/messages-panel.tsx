"use client";

import { useActionState, useState, useMemo } from "react";
import { sendMessageAction } from "@/app/(app)/comunicacion/actions";
import { Role } from "@prisma/client";

type UserOption = { id: string; name: string; role: Role };
type MessageItem = {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

export function MessagesPanel({
  currentUserId,
  users,
  messages,
}: {
  currentUserId: string;
  users: UserOption[];
  messages: MessageItem[];
}) {
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [error, formAction, pending] = useActionState(
    sendMessageAction,
    undefined,
  );

  const thread = useMemo(
    () =>
      messages
        .filter(
          (m) =>
            (m.senderId === currentUserId && m.receiverId === selectedUserId) ||
            (m.senderId === selectedUserId && m.receiverId === currentUserId),
        )
        .reverse(),
    [messages, selectedUserId, currentUserId],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] lg:col-span-1">
        <div className="border-b border-[var(--border-subtle)] px-4 py-3">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Contactos
          </p>
        </div>
        <div className="max-h-96 divide-y divide-[var(--border-subtle)] overflow-y-auto">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUserId(u.id)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition ${
                selectedUserId === u.id
                  ? "bg-[var(--background)]"
                  : "hover:bg-[var(--background)]"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-xs font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <span className="text-[var(--foreground)]">{u.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] lg:col-span-2">
        <div
          className="flex-1 space-y-3 overflow-y-auto p-4"
          style={{ maxHeight: 350 }}
        >
          {thread.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">
              Todavía no hay mensajes con esta persona.
            </p>
          )}
          {thread.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-3.5 py-2 text-sm ${
                  m.senderId === currentUserId
                    ? "bg-[var(--color-ink-900)] text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
                    : "bg-[var(--background)] text-[var(--foreground)]"
                }`}
              >
                {m.content}
                <p className="mt-1 text-[10px] opacity-70">{m.createdAt}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          action={formAction}
          className="flex gap-2 border-t border-[var(--border-subtle)] p-3"
        >
          <input type="hidden" name="receiverId" value={selectedUserId} />
          <input
            name="content"
            placeholder="Escribí un mensaje..."
            required
            className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-[var(--color-ink-900)] px-4 py-2 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            Enviar
          </button>
        </form>
        {error && <p className="px-3 pb-2 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
