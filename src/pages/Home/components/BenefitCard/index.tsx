import { ReactNode } from "react";
import './styles.css'


interface BenefitCardProps {
  title: string;
  icon: ReactNode
  
}

export function BenefitCard({ title, icon }: BenefitCardProps) {
  return (
    <div className="benefit-container">
      {icon}
      <span className="benefit-description" >{title}</span>
    </div>
  );
}
