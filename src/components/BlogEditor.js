import React, { useState, useEffect } from 'react';

const BlogEditor = ({ posts, onChange }) => {
  const [localPosts, setLocalPosts] = useState(posts || []);

  useEffect(() => {
    onChange({ target: { name: 'posts', value: JSON.stringify(localPosts) } });
  }, [localPosts]);

  const handlePostChange = (index, field, value) => {
    const updatedPosts = [...localPosts];
    updatedPosts[index][field] = value;
    setLocalPosts(updatedPosts);
  };

  const addPost = () => {
    setLocalPosts([...localPosts, { id: Date.now(), title: '', content: '', image: '' }]);
  };

  const removePost = (index) => {
    setLocalPosts(localPosts.filter((_, i) => i !== index));
  };

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
