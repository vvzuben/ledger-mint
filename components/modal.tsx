import ReactDOM from 'react-dom';
import { useModal } from '../contexts/modal';

import styles from './modal.module.css';

const Modal = () => {
  const modalContext = useModal();

  const handleCloseClick = () => {
    modalContext.close();
  };

  if (!modalContext.content) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={styles.modal}>
      <div className={styles.content}>
        <h3 className={styles.title}>{modalContext.title}</h3>
        <div>{modalContext.content}</div>
        {modalContext.canClose && (
          <button className={styles.close} onClick={handleCloseClick}>
            X
          </button>
        )}
      </div>
    </div>,
    document.getElementById('modal-root'),
  );
};

export default Modal;
