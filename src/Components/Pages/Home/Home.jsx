import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, addPost, updatePost, deletePost } from "../../../APIs/postsApis";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faAdd } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import UpdateModal from "./UpdateModal";
import { Link } from "react-router-dom";

function Home() {
  const allPosts = useSelector((state) => state.postsData.posts);
  const loading = useSelector((state) => state.postsData.loading);
  const dispatch = useDispatch();
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
  });
  const [show, setShow] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    title: "",
    body: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleCloseModal = () => setShow(false);

  // Title validation logic
  const validateTitle = (title) => {
    if (title.length < 10) {
      return "Title must be at least 10 characters";
    }
    if (title.length > 150) {
      return "Title must be less than 150 characters";
    }
    return "";
  };

  // Body validation logic
  const validateBody = (body) => {
    if (body.length < 50) {
      return "Body must be at least 50 characters";
    }
    if (body.length > 300) {
      return "Body must be less than 300 characters";
    }
    return "";
  };

  // Handle title changes and validate title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setNewPost({ ...newPost, title });
    setValidationErrors({ ...validationErrors, title: validateTitle(title) });
  };

  // Handle body changes and validate body
  const handleBodyChange = (e) => {
    const body = e.target.value;
    setNewPost({ ...newPost, body });
    setValidationErrors({ ...validationErrors, body: validateBody(body) });
  };

  // Submit the post after validation
  const handleAddPost = () => {
    const titleError = validateTitle(newPost.title);
    const bodyError = validateBody(newPost.body);

    if (!titleError && !bodyError) {
      setIsSubmitting(true);
      dispatch(addPost(newPost))
        .then(() => {
          setNewPost({ title: "", body: "" });
          setValidationErrors({ title: "", body: "" });
          setIsSubmitting(false);
          toast.success("Your post has been added successfully");
        })
        .catch(() => {
          setIsSubmitting(false);
        });
    } else {
      setValidationErrors({ title: titleError, body: bodyError });
    }
  };

  // Display modal for updating a post
  const handleShowModal = (post) => {
    setShow(true);
    setCurrentPost(post);
  };

  // Update post after validation
  const handleUpdatePost = () => {
    const updatedPostData = { title: currentPost.title, body: currentPost.body };
    const titleError = validateTitle(currentPost.title);
    const bodyError = validateBody(currentPost.body);

    if (!titleError && !bodyError) {
      setIsSubmitting(true);
      dispatch(updatePost({ id: currentPost.id, updatedData: updatedPostData })).finally(() => {
        handleCloseModal();
        setIsSubmitting(false);
        toast.success("Your post has been updated successfully");
      });
    } else {
      setValidationErrors({ title: titleError, body: bodyError });
    }
  };

  // Delete post
  const handleDeletePost = (id) => {
    dispatch(deletePost(id)).then(() => {
      toast.success("The post has been deleted successfully");
    });
  };

  // Button disabled logic
  const isAddPostButtonDisabled = () => {
    const titleValid = newPost.title.length >= 10 && newPost.title.length <= 150;
    const bodyValid = newPost.body.length >= 50 && newPost.body.length <= 300;
    return !(titleValid && bodyValid);
  };

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="posts-container">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                {allPosts.map((post) => (
                  <div className="card post-item" key={post.id}>
                    <div className="card-body">
                      <Link to={`/post/${post.id}`}>
                        <h5>
                          {post.id} - {post.title}
                        </h5>
                      </Link>
                      <p className="card-text">{post.body}</p>
                      <div className="postControlButtons">
                        <button className="btn btn-primary" onClick={() => handleShowModal(post)}>
                          <FontAwesomeIcon icon={faEdit} /> Update
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-lg-4">
                <div className="add-post-form">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={handleTitleChange}
                  />
                  {validationErrors.title && (
                    <div className="text-danger mb-2">{validationErrors.title}</div>
                  )}
                  <textarea
                    className="form-control mb-2"
                    placeholder="Body"
                    rows="4"
                    value={newPost.body}
                    onChange={handleBodyChange}
                  />
                  {validationErrors.body && (
                    <div className="text-danger mb-2">{validationErrors.body}</div>
                  )}
                  <button
                    className="btn btn-success"
                    onClick={handleAddPost}
                    disabled={isSubmitting || isAddPostButtonDisabled()}
                  >
                    <FontAwesomeIcon icon={faAdd} /> Add Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <UpdateModal
        show={show}
        handleCloseModal={handleCloseModal}
        currentPost={currentPost}
        handleChangedData={setCurrentPost}
        handleUpdatePost={handleUpdatePost}
      />
      <ToastContainer />
    </>
  );
}

export default Home;
