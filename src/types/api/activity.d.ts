namespace Activity {
    type DTO = {
        id: string;
        type: Type;
        location: string;
        workload: number;
        startDate: string;
        endDate: string;
        group: Omit<Group.DTO, "activity">;
        badges: Competence.Type[];
    };

    type Type = {
        id: string;
        name: string;
    };
}

type Activity = Activity.DTO;
type ActivityType = Activity.Type;
