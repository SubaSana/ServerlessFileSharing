
const API_BASE_URL = 'https://pye40ej1j6.execute-api.ap-south-1.amazonaws.com/prod';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('idToken');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

const token = checkAuth();
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

// Upload file
document.getElementById('upload-btn')?.addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const uploadMessage = document.getElementById('upload-message');
    const progressBar = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    
    try {
        uploadMessage.textContent = 'Getting upload URL...';
        progressBar.style.display = 'block';
        progressFill.style.width = '30%';
        
        const response = await fetch(`${API_BASE_URL}/files`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get upload URL');
        }
        
        uploadMessage.textContent = 'Uploading file...';
        progressFill.style.width = '60%';
        
        const uploadResponse = await fetch(data.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });
        
        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file to S3');
        }
        
        progressFill.style.width = '100%';
        uploadMessage.textContent = 'File uploaded successfully!';
        uploadMessage.className = 'success';
        
        fileInput.value = '';
        setTimeout(() => {
            progressBar.style.display = 'none';
            uploadMessage.textContent = '';
            loadFiles();
        }, 2000);
        
    } catch (error) {
        console.error('Upload error:', error);
        uploadMessage.textContent = `Error: ${error.message}`;
        uploadMessage.className = 'error';
        progressBar.style.display = 'none';
    }
});
//load files
async function loadFiles() {
    const filesList = document.getElementById('files-list');
    
    if (!filesList) {
        console.error('files-list element not found');
        return;
    }
    
    filesList.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Loading your files...</p>';
    
    try {
        console.log('Loading files from API...');
        
        const response = await fetch(`${API_BASE_URL}/files`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Files API response status:', response.status);
        
        const data = await response.json();
        console.log('Files data:', data);
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load files');
        }
        
        if (!data.files || !Array.isArray(data.files)) {
            throw new Error('Invalid response format');
        }
       
        if (data.files.length === 0) {
            filesList.innerHTML = '<p style="text-align: center; padding: 20px; color: #888;">No files uploaded yet. Upload your first file!</p>';
            return;
        }
        
        let html = '<table><tr><th>File Name</th><th>Size</th><th>Upload Date</th><th>Actions</th></tr>';
        
        data.files.forEach(file => {
            const sizeInMB = (file.fileSize / (1024 * 1024)).toFixed(2);
            const date = new Date(file.uploadDate).toLocaleString();
            const safeFileName = (file.fileName || '').replace(/'/g, "\\'");
            
            html += `
                <tr>
                    <td>${file.fileName}</td>
                    <td>${sizeInMB} MB</td>
                    <td>${date}</td>
                    <td>
                        <button class="btn-small" onclick="downloadFile('${file.fileId}', '${safeFileName}')">Download</button>
                        <button class="btn-small btn-danger" onclick="deleteFile('${file.fileId}')">Delete</button>
                        <button class="btn-small" onclick="shareFile('${file.fileId}')">Share</button>
                    </td>
                </tr>
            `;
        });
        
        html += '</table>';
        filesList.innerHTML = html;
        
        console.log(`Successfully loaded ${data.files.length} files`);
        
    } catch (error) {
        console.error('Load files error:', error);
        filesList.innerHTML = `
            <div style="padding: 20px; background: #fee; border: 1px solid #fcc; border-radius: 5px; color: #c33;">
                <strong>Error:</strong> ${error.message}
                <br><br>
                <button class="btn btn-secondary" onclick="loadFiles()">Try Again</button>
            </div>
        `;
    }
}
// Download file
async function downloadFile(fileId, fileName) {
    try {
        console.log('=== DOWNLOAD DEBUG ===');
        console.log('Downloading:', fileId, fileName);
        
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Download response status:', response.status);
        
        const data = await response.json();
        console.log('Download response data:', data);
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get download URL');
        }
        
        if (!data.downloadUrl) {
            throw new Error('No download URL in response');
        }
        
        console.log('Opening download URL...');
        window.open(data.downloadUrl, '_blank');
        
    } catch (error) {
        console.error('=== DOWNLOAD ERROR ===');
        console.error(error);
        alert(`Error: ${error.message}`);
    }
}

// Delete file
async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }
    
    try {
        console.log('=== DELETE DEBUG ===');
        console.log('Deleting:', fileId);
        
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Delete response status:', response.status);
        
        const data = await response.json();
        console.log('Delete response:', data);
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete file');
        }
        
        alert('File deleted successfully!');
        await loadFiles();
        
    } catch (error) {
        console.error('=== DELETE ERROR ===');
        console.error(error);
        alert(`Error: ${error.message}`);
    }
}
// Share file
async function shareFile(fileId) {
    try {
        console.log('Sharing file:', fileId);
        
        const response = await fetch(`${API_BASE_URL}/files/${fileId}/share`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate share link');
        }
        
        if (data.shareUrl) {
            try {
                await navigator.clipboard.writeText(data.shareUrl);
            } catch (e) {
                console.log('Clipboard copy failed, will show in prompt');
            }
            prompt('Copy this share link:', data.shareUrl);
        }
        
    } catch (error) {
        console.error('Share error:', error);
        alert(`Error: ${error.message}`);
    }
}

document.getElementById('refresh-btn')?.addEventListener('click', () => {
    console.log('Refresh button clicked');
    loadFiles();
});

if (window.location.pathname.includes('dashboard')) {
    console.log('Dashboard page detected');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, loading files...');
            setTimeout(() => {
                loadFiles();
            }, 300);
        });
    } else {
        console.log('DOM already loaded, loading files immediately...');
        setTimeout(() => {
            loadFiles();
        }, 300);
    }
}
