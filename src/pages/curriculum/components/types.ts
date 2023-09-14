export interface ComponentProps {
    id: string;
    title: string;
    description: string;
    startDate: Date; // ou Date, dependendo do formato no back-end
    endDate: Date; // ou Date
    presentDate: Boolean;
  }

export interface ComponentPropsType{
    id: string;
    name: string;
}
  