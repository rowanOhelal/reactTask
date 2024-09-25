import { createSlice } from "@reduxjs/toolkit";
import { fetchPosts, addPost, updatePost, deletePost, fetchComments } from "../APIs/postsApis";

export const postsSlice = createSlice({
  name: "postsData",

  initialState: {
    posts: [],
    comments: [],
    setLoading: false,
    setError: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    });

    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      })

    builder.addCase(addPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });

    builder.addCase(updatePost.fulfilled, (state, action) => {
      //get the updated post index 1, 2, 3,3
      const postIndex = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      // mean that the post has already existed in the posts array
      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload;
      }
    });

    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.meta.arg);
    });

    builder.addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.comments = action.payload;
    })
  },
});

export default postsSlice.reducer;
