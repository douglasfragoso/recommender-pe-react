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
        <div className="modal modal-dialog-centered" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{titulo}</h5>
                        { onClickBtnClose && <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClickBtnClose} aria-label="Close"></button>}
                    </div>
                    <div className="modal-body">
                        <p>{texto}</p>
                    </div>
                    <div className="modal-footer">
                        { onClickBtn02 && <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClickBtn02}>{ txtBtn02 }</button>}
                        { onClickBtn01 && <button type="button" className="btn btn-primary" onClick={onClickBtn01}>{ txtBtn01 }</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;
