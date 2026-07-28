import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "table" | "grid";

interface ViewStore {
  studentsView: ViewMode;
  setStudentsView: (view: ViewMode) => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      studentsView: "table",
      setStudentsView: (view) => set({ studentsView: view }),
    }),
    { name: "zenith-view-prefs" },
  ),
);
