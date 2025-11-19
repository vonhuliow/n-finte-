
// Custom Background Upload System
(function() {
    'use strict';
    
    const customBG = {
        current: null,
        uploaded: [],
        
        init() {
            this.createUploadUI();
        },
        
        createUploadUI() {
            const bgUI = document.createElement('div');
            bgUI.id = 'custom-bg-upload';
            bgUI.style.cssText = `
                position: fixed;
                top: 70px;
                left: 10px;
                z-index: 9999;
                background: rgba(0,0,0,0.9);
                padding: 15px;
                border-radius: 10px;
                color: white;
                display: none;
            `;
            
            bgUI.innerHTML = `
                <h3 style="margin: 0 0 10px 0;">Custom Backgrounds</h3>
                <input type="file" id="bg-upload-input" accept="image/*" style="margin-bottom: 10px;">
                <button id="upload-bg-btn" style="width: 100%; padding: 8px; background: #0af; border: none; border-radius: 5px; color: white; cursor: pointer; margin-bottom: 5px;">Upload</button>
                <div id="bg-list" style="max-height: 200px; overflow-y: auto;"></div>
                <button id="close-bg-ui" style="width: 100%; padding: 8px; background: #f44; border: none; border-radius: 5px; color: white; cursor: pointer; margin-top: 5px;">Close</button>
            `;
            
            document.body.appendChild(bgUI);
            
            document.getElementById('upload-bg-btn').addEventListener('click', () => {
                const file = document.getElementById('bg-upload-input').files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.uploaded.push({
                            name: file.name,
                            data: e.target.result
                        });
                        this.updateBGList();
                        this.applyBackground(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            document.getElementById('close-bg-ui').addEventListener('click', () => {
                bgUI.style.display = 'none';
            });
        },
        
        updateBGList() {
            const list = document.getElementById('bg-list');
            list.innerHTML = this.uploaded.map((bg, i) => `
                <div style="padding: 5px; margin: 3px 0; background: rgba(255,255,255,0.1); border-radius: 3px; cursor: pointer;" onclick="customBG.applyBackground('${bg.data}')">
                    ${bg.name}
                </div>
            `).join('');
        },
        
        applyBackground(dataUrl) {
            this.current = dataUrl;
            document.body.style.backgroundImage = `url(${dataUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
        },
        
        openUI() {
            document.getElementById('custom-bg-upload').style.display = 'block';
        }
    };
    
    // Add to settings button
    setTimeout(() => {
        const settingsDetails = document.getElementById('settings-details');
        if(settingsDetails) {
            const bgButton = document.createElement('button');
            bgButton.textContent = '🖼️ Custom Backgrounds';
            bgButton.style.cssText = 'width: 100%; padding: 10px; margin: 10px 0; background: #0af; color: white; border: none; border-radius: 5px; cursor: pointer;';
            bgButton.onclick = () => customBG.openUI();
            settingsDetails.querySelector('.details-div').appendChild(bgButton);
        }
    }, 1000);
    
    window.customBG = customBG;
    customBG.init();
    
    console.log("%c🖼️ Custom Background Upload System loaded!", "color: #0af");
})();
