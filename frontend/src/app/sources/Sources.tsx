import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sources.css';

interface Source {
  id: string;
  title: string;
  category: string;
  content_preview: string;
}

const UPLOAD_KEY = 'myq36N&N99MsO'; // Change this to your desired key
const PAGE_ACCESS_STORAGE_KEY = 'sources_access_granted';

export default function Sources() {
  const navigate = useNavigate();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [authMode, setAuthMode] = useState<'page' | 'upload' | null>(null);
  const [pageAccessGranted, setPageAccessGranted] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hasAccess = localStorage.getItem(PAGE_ACCESS_STORAGE_KEY) === 'true';
    if (hasAccess) {
      setPageAccessGranted(true);
      setShowKeyModal(false);
      setAuthMode(null);
    } else {
      setShowKeyModal(true);
      setAuthMode('page');
    }
  }, []);

  useEffect(() => {
    if (pageAccessGranted) {
      fetchSources();
    }
  }, [pageAccessGranted]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rag/sources`);
      if (!response.ok) throw new Error('Failed to fetch sources');
      
      const data = await response.json();
      setSources(data.sources || []);
    } catch (err) {
      setError('Error loading sources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSource = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this source?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rag/sources/${docId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete source');
      
      // Refresh sources
      fetchSources();
    } catch (err) {
      setError('Error deleting source');
      console.error(err);
    }
  };

  const handleUploadClick = () => {
    setAuthMode('upload');
    setShowKeyModal(true);
    setKeyInput('');
  };

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (keyInput !== UPLOAD_KEY) {
      setError('❌ Incorrect security key');
      setKeyInput('');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setKeyInput('');

    if (authMode === 'page') {
      localStorage.setItem(PAGE_ACCESS_STORAGE_KEY, 'true');
      setPageAccessGranted(true);
      setShowKeyModal(false);
      setAuthMode(null);
      return;
    }

    setShowKeyModal(false);
    fileInputRef.current?.click();
  };

  const handleCancelAuth = () => {
    if (authMode === 'page') {
      navigate('/');
      return;
    }

    setShowKeyModal(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('');
    
    const formData = new FormData();
    
    // Extract title from filename (remove extension)
    const title = file.name.replace(/\.[^/.]+$/, '');
    
    // Determine category from filename
    let category = 'personal_info';
    if (file.name.includes('skill')) category = 'skills';
    if (file.name.includes('experience') || file.name.includes('work')) category = 'experience';
    if (file.name.includes('education')) category = 'education';
    
    // Append form fields
    formData.append('title', title);
    formData.append('category', category);
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rag/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload file');

      setUploadMessage('✅ File uploaded successfully!');
      
      // Refresh sources
      setTimeout(() => {
        fetchSources();
        setUploading(false);
        setUploadMessage('');
      }, 1000);
    } catch (err) {
      setError('Error uploading file');
      setUploading(false);
      console.error(err);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      skills: '#0ea5e9',
      experience: '#8b5cf6',
      personal_info: '#06b6d4',
      education: '#10b981'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="sources-page">
      {pageAccessGranted ? (
        <div className="sources-container">
          <div className="sources-header">
            <div className="header-top">
              <div>
                <h1>Indexed Sources</h1>
                <p>Documents that your AI Assistant is trained on</p>
              </div>
              <button 
                className="upload-btn"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                {uploading ? '⏳ Uploading...' : '📤 Upload Document'}
              </button>
            </div>
          </div>

          {uploadMessage && <div className="success-message">{uploadMessage}</div>}
          {loading && <div className="loading">Loading sources...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && sources.length === 0 && (
            <div className="empty-state">
              <p>No sources indexed yet</p>
              <p>Upload documents to get started</p>
            </div>
          )}

          {!loading && sources.length > 0 && (
            <div className="sources-grid">
              {sources.map((source) => (
                <div key={source.id} className="source-card">
                  <div className="source-header">
                    <h3>{source.title}</h3>
                    <span 
                      className="source-category"
                      style={{ backgroundColor: getCategoryColor(source.category) }}
                    >
                      {source.category}
                    </span>
                  </div>
                  <p className="source-preview">{source.content_preview}</p>
                  <div className="source-actions">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteSource(source.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="sources-blocked">
          <div>
            <h2>Secure Data Source Access</h2>
            <p>Enter your security key to unlock the Data Sources page.</p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept=".md,.txt,.pdf"
      />

      {/* Security Key Modal */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => authMode !== 'page' && setShowKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🔐 Enter Security Key</h2>
            <p>
              {authMode === 'page'
                ? 'Please enter your security key to access the Data Sources page.'
                : 'Please enter your security key to upload documents.'}
            </p>
            <form onSubmit={handleKeySubmit}>
              <input
                type="password"
                placeholder="Enter security key"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                autoFocus
              />
              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="modal-cancel"
                  onClick={handleCancelAuth}
                >
                  {authMode === 'page' ? 'Go Back' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="modal-submit"
                >
                  {authMode === 'page' ? 'Unlock' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
