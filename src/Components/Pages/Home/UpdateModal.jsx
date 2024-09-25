import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./style.css";

function UpdateModal({ show, handleCloseModal, currentPost, handleChangedData, handleUpdatePost }) {
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    body: "",
  });

  // Validation logic for title and body
  const validateTitle = (title) => {
    if (title.length < 10) {
      return "Title must be at least 10 characters";
    }
    if (title.length > 150) {
      return "Title must be less than 150 characters";
    }
    return "";
  };

  const validateBody = (body) => {
    if (body.length < 50) {
      return "Body must be at least 50 characters";
    }
    if (body.length > 300) {
      return "Body must be less than 300 characters";
    }
    return "";
  };

  // Update the validation messages when currentPost changes
  useEffect(() => {
    setValidationErrors({
      title: validateTitle(currentPost.title),
      body: validateBody(currentPost.body),
    });
  }, [currentPost.title, currentPost.body]);

  // Button disabled logic
  const isUpdatePostButtonDisabled = () => {
    const titleValid = currentPost.title.length >= 10 && currentPost.title.length <= 150;
    const bodyValid = currentPost.body.length >= 50 && currentPost.body.length <= 300;
    return !(titleValid && bodyValid);
  };

  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentPost.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add-post-form">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Title"
              value={currentPost.title}
              onChange={(e) => {
                handleChangedData({ ...currentPost, title: e.target.value });
                setValidationErrors({
                  ...validationErrors,
                  title: validateTitle(e.target.value),
                });
              }}
            />
            {validationErrors.title && (
              <div className="text-danger mb-2">{validationErrors.title}</div>
            )}
            <textarea
              className="form-control mb-2"
              placeholder="Body"
              rows="4"
              value={currentPost.body}
              onChange={(e) => {
                handleChangedData({ ...currentPost, body: e.target.value });
                setValidationErrors({
                  ...validationErrors,
                  body: validateBody(e.target.value),
                });
              }}
            />
            {validationErrors.body && (
              <div className="text-danger mb-2">{validationErrors.body}</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="modalFooter">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>

          <Button
            variant="primary"
            onClick={handleUpdatePost}
            disabled={isUpdatePostButtonDisabled()}
          >
            Update Post
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateModal;
