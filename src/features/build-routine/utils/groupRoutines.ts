import { Routine } from "@/types/routine";

const DAY_ABBR_TO_FULL: Record<string, string> = {
  Lun: "Lunes",
  Mar: "Martes",
  Mie: "Miércoles",
  Jue: "Jueves",
  Vie: "Viernes",
  Sab: "Sábado",
  Dom: "Domingo",
};

const DAY_ABBRS = Object.keys(DAY_ABBR_TO_FULL);

const DAY_ORDER: Record<string, number> = {
  Lun: 0,
  Mar: 1,
  Mie: 2,
  Jue: 3,
  Vie: 4,
  Sab: 5,
  Dom: 6,
};

export interface WeeklyPlanGroup {
  groupId: string;
  routines: Routine[];
  days: { day: string; muscle: string }[];
}

export interface GroupedRoutines {
  weeklyPlans: WeeklyPlanGroup[];
  singles: Routine[];
}

function extractAbbrFromName(name: string): string | null {
  for (const abbr of DAY_ABBRS) {
    if (name.endsWith(`- ${abbr}`)) return abbr;
  }
  return null;
}

function extractMuscleFromName(name: string, abbr: string): string {
  return name.replace(` - ${abbr}`, "").trim();
}

export function groupRoutines(routines: Routine[]): GroupedRoutines {
  const planCandidates: Routine[] = [];
  const singles: Routine[] = [];

  for (const r of routines) {
    const abbr = extractAbbrFromName(r.name);
    if (abbr && r.mode === "custom") {
      planCandidates.push(r);
    } else {
      singles.push(r);
    }
  }

  // Agrupar por goal + experience
  const groups: Record<string, Routine[]> = {};
  for (const r of planCandidates) {
    const key = `${r.goal}__${r.experience}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  }

  const weeklyPlans: WeeklyPlanGroup[] = Object.entries(groups).map(
    ([, groupRoutines]) => {
      // Ordenar por día de la semana
      const sorted = [...groupRoutines].sort((a, b) => {
        const abbrA = extractAbbrFromName(a.name) ?? "";
        const abbrB = extractAbbrFromName(b.name) ?? "";
        return (DAY_ORDER[abbrA] ?? 99) - (DAY_ORDER[abbrB] ?? 99);
      });

      const days = sorted.map((r) => {
        const abbr = extractAbbrFromName(r.name) ?? "";
        return {
          day: DAY_ABBR_TO_FULL[abbr] ?? abbr,
          muscle: extractMuscleFromName(r.name, abbr),
        };
      });

      return {
        groupId: sorted.map((r) => r.routineId).join("-"),
        routines: sorted,
        days,
      };
    },
  );

  return { weeklyPlans, singles };
}
