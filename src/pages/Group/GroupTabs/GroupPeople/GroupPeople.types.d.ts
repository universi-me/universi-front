namespace GroupPeople {
    export namespace ChangeGroupParticipants {
        export type Props = {
            group: Group.DTO;
            options?: Profile.DTO[];
            callback?( confirmed: boolean ): unknown;
        };

        export type Form = import("@/components/UniversiForm").Data<{
            participants: import("@/types/Profile").ProfileClass[];
        }>;
    }
}
