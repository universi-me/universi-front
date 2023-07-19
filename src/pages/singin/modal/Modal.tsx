import "./modal.css";

type isModal = {
  isOpen : boolean
}
export default function Modal({isOpen} : isModal) {


  if(isOpen){
    return (
      <div className="container-modal-popup">
        <div className="text-warn">
          
            <div>
              <span className="material-symbols-outlined alert">warning</span>
            </div>
            <div className="text-warn">
              EMAIL OU SENHA <p className="warn">INVÁLIDOS</p>
            </div>
          
        </div>
      </div>
    );
  }
  return (
    <></>
  )
}
