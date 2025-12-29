import React, { useState, useCallback } from 'react';

const BlogEditor = ({ name, posts, onChange }) => {
  const [localPosts, setLocalPosts] = useState(posts || []);

  const handlePostChange = useCallback((index, field, value) => {
    const updatedPosts = [...localPosts];
    updatedPosts[index] = { ...updatedPosts[index], [field]: value };
    setLocalPosts(updatedPosts);
    onChange(name, updatedPosts);
  }, [localPosts, name, onChange]);

  const addPost = useCallback(() => {
    const newPosts = [...localPosts, { id: Date.now(), title: '', content: '', image: '' }];
    setLocalPosts(newPosts);
    onChange(name, newPosts);
  }, [localPosts, name, onChange]);

  const removePost = useCallback((index) => {
    const updatedPosts = localPosts.filter((_, i) => i !== index);
    setLocalPosts(updatedPosts);
    onChange(name, updatedPosts);
  }, [localPosts, name, onChange]);

  return (
    <div>
      {localPosts.map((post, index) => (
        <div key={post.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Title"
            value={post.title}
            onChange={(e) => handlePostChange(index, 'title', e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <textarea
            placeholder="Content"
            value={post.content}
            onChange={(e) => handlePostChange(index, 'content', e.target.value)}
            style={{ width: '100%', minHeight: '80px', marginBottom: '5px' }}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={post.image}
            onChange={(e) => handlePostChange(index, 'image', e.target.value)}
            style={{ width: '100%', marginBottom: '5px' }}
          />
          <button type="button" onClick={() => removePost(index)}>Remove Post</button>
        </div>
      ))}
      <button type="button" onClick={addPost}>Add Post</button>
    </div>
  );
};

export default BlogEditor;
