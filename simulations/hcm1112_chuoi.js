/**
 * FILE MÔ PHỎNG: BÀI CHUỖI (HCM 2011-2012)
 * Tên hàm: init_hcm1112_chuoi_simulation
 */

window.chuoi_input = "";
window.chuoi_result = "";
window.chuoi_index = 0;
window.chuoi_isDone = false;

function init_hcm1112_chuoi_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng biến đổi chuỗi</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div class="input-group">
                    <b>Nhập chuỗi:</b> 
                    <input type="text" id="input-chuoi-str" value="Codeforces" style="width: 150px; margin-left:10px; padding: 5px; border: 1px solid #cbd5e1; border-radius: 4px;">
                </div>
                <button onclick="chuoi_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="chuoi_nextStep()" id="btn-step-chuoi" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div class="sim-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #0c4a6e;">Chuỗi hiện tại:</div>
                    <div id="chuoi-display" style="font-family: monospace; font-size: 1.5rem; letter-spacing: 5px; margin-bottom: 20px; text-align: center;"></div>
                    
                    <div style="border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                        <p>Ký tự đang xét: <span id="chuoi-curr-char" style="font-weight: bold; color: #f59e0b; font-size: 1.2rem;">-</span></p>
                        <p>Kết quả tạm: <span id="chuoi-curr-res" style="font-weight: bold; color: #10b981; font-size: 1.2rem;">""</span></p>
                    </div>
                </div>
                
                <div id="chuoi-log" style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: 'Consolas', monospace; height: 200px; overflow-y: auto; font-size: 0.9rem;">
                    > Chờ khởi tạo...
                </div>
            </div>
        </div>
    `;
    chuoi_init();
}

function chuoi_log(msg, color = "#d4d4d4") {
    const logArea = document.getElementById('chuoi-log');
    if (logArea) {
        logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function chuoi_init() {
    window.chuoi_input = document.getElementById('input-chuoi-str').value || "";
    window.chuoi_result = "";
    window.chuoi_index = 0;
    window.chuoi_isDone = false;

    const display = document.getElementById('chuoi-display');
    display.innerHTML = window.chuoi_input.split('').map((c, i) => `<span id="char-${i}">${c}</span>`).join('');
    
    document.getElementById('chuoi-curr-char').innerText = "-";
    document.getElementById('chuoi-curr-res').innerText = '""';
    document.getElementById('chuoi-log').innerHTML = "";
    document.getElementById('btn-step-chuoi').disabled = false;

    chuoi_log(`Khởi tạo chuỗi: "${window.chuoi_input}"`, "#f59e0b");
}

function chuoi_nextStep() {
    if (window.chuoi_index >= window.chuoi_input.length) {
        window.chuoi_isDone = true;
        document.getElementById('btn-step-chuoi').disabled = true;
        chuoi_log(`Hoàn thành! Kết quả cuối cùng: ${window.chuoi_result}`, "#10b981");
        return;
    }

    // Reset màu các ký tự trước
    for (let i = 0; i < window.chuoi_input.length; i++) {
        document.getElementById(`char-${i}`).style.color = "black";
        document.getElementById(`char-${i}`).style.backgroundColor = "transparent";
    }

    const char = window.chuoi_input[window.chuoi_index];
    const currEl = document.getElementById(`char-${window.chuoi_index}`);
    currEl.style.color = "white";
    currEl.style.backgroundColor = "#f59e0b";
    
    document.getElementById('chuoi-curr-char').innerText = char;

    const vowels = "aoyeuiAOYEUI";
    if (vowels.includes(char)) {
        chuoi_log(`Ký tự '${char}' là nguyên âm -> Xóa bỏ.`, "#94a3b8");
    } else {
        const lowerChar = char.toLowerCase();
        const added = "." + lowerChar;
        window.chuoi_result += added;
        chuoi_log(`Ký tự '${char}' là phụ âm -> Thêm '${added}'.`, "#5ee727");
        document.getElementById('chuoi-curr-res').innerText = `"${window.chuoi_result}"`;
    }

    window.chuoi_index++;
    if (window.chuoi_index === window.chuoi_input.length) {
        chuoi_log("Nhấn tiếp để kết thúc...", "#38bdf8");
    }
}