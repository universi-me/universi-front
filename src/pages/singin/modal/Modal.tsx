import "./modal.css";

type isModal = {
  isOpen : boolean
}
export default function Modal({isOpen} : isModal) {


  if(isOpen){
    return (
      <div className="container-modal-popup">
        <div className="text-warn-modal">
          
            <div>
              <span className="material-symbols-outlined alert-modal">warning</span>
            </div>
            <div className="text-warn-modal">
              EMAIL OU SENHA <div className="warn">INVÁLIDOS</div>
            </div>
          
        </div>
      </div>
    );
  }
  return (
    <></>
  )
}
