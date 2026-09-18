import axios from 'axios';

const api = axios.create({
  baseURL: 'https://doculens-3ohe.onrender.com/api',
});

export const analyzeDocuments = async (doc1, doc2, threshold) => {
  const formData = new FormData();
  
  if (doc1.type === 'file' && doc1.file) {
    formData.append('doc1_file', doc1.file);
  } else if (doc1.type === 'text' && doc1.text) {
    formData.append('doc1_text', doc1.text);
    formData.append('doc1_name', 'Pasted Text 1');
  }

  if (doc2.type === 'file' && doc2.file) {
    formData.append('doc2_file', doc2.file);
  } else if (doc2.type === 'text' && doc2.text) {
    formData.append('doc2_text', doc2.text);
    formData.append('doc2_name', 'Pasted Text 2');
  }

  formData.append('threshold', threshold);
  
  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
