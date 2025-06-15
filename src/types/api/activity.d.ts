namespace Activity {
    type DTO = {
        id: string;
        name: string;
        description: string;
        author: Profile.DTO;
        type: Type;
        location: string;
        workload: number;
        startDate: string;
        endDate: string;
        group: Group.DTO;
        badges: Competence.Type[];
    };

    type Type = {
        id: string;
        name: string;
    };
}

type Activity = Activity.DTO;
type ActivityType = Activity.Type;
