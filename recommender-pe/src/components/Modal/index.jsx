import './modal.css';

const Modal = ({
    titulo,
    texto,
    txtBtn01,
    onClickBtn01,
    txtBtn02,
    onClickBtn02,
    onClickBtnClose
}) => {
    return (
        <div className="modal-overlay">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{titulo}</h5>
                        {onClickBtnClose && 
                            <button 
                                type="button" 
                                className="modal-close-btn" 
                                onClick={onClickBtnClose} 
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        }
                    </div>
                    <div className="modal-body">
                        <p>{texto}</p>
                    </div>
                    <div className="modal-footer">
                        {onClickBtn02 && 
                            <button 
                                type="button" 
                                className="btn btn-secondary-custom" 
                                onClick={onClickBtn02}
                            >
                                {txtBtn02}
                            </button>
                        }
                        {onClickBtn01 && 
                            <button 
                                type="button" 
                                className="btn btn-primary-custom" 
                                onClick={onClickBtn01}
                            >
                                {txtBtn01}
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;