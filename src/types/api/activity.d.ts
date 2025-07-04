namespace Activity {
    type DTO = {
        id: string;
        type: Type;
        location: string;
        workload: Nullable<number>;
        startDate: string;
        endDate: string;
        group: Omit<Group.DTO, "activity">;
        badges: Competence.Type[];
        status: Activity.Status;
    };

    type Type = {
        id: string;
        name: string;
    };

    type Status = "NOT_STARTED" | "STARTED" | "ENDED";
}

type Activity = Activity.DTO;
type ActivityType = Activity.Type;
