namespace Department {
    type DTO = {
        id: string;
        acronym: string;
        name: string;
        creationDate: string;
    };
}

type Department = Department.DTO;
