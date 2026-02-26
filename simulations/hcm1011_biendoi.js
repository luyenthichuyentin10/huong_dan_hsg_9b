/**
 * FILE MÔ PHỎNG: BÀI BIẾN ĐỔI (HCM 2010-2011)
 * Tên hàm: initHcm1011BiendoiSimulation
 */

window.biendoi_n = 0;
window.biendoi_step = 0;
window.biendoi_res = 0;
window.biendoi_currentSeq = [1];
window.biendoi_mode = 'vetcan';

function init_hcm1011_biendoi_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Biến đổi dãy số & Quy luật</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;">
                <div class="input-group">
                    <b>Nhập n (tối đa 7 để nhìn rõ):</b> 
                    <input type="number" id="input-biendoi-n" value="5" min="1" max="15" style="width: 60px; margin-left:10px;">
                </div>
                <select id="biendoi-mode" class="toggle-btn" style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1;">
                    <option value="vetcan">Cách 1: Vét cạn (Từng bước)</option>
                    <option value="quyluat">Cách 2: Tìm quy luật (Dòng chảy)</option>
                </select>
                <button onclick="biendoi_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="biendoi_next()" id="btn-step-biendoi" class="toggle-btn" style="background:#29c702; color:white;">⏭ Bước tiếp theo</button>
            </div>

            <div id="biendoi-visual" style="background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 8px; border: 1px solid #334155; min-height: 250px; font-family: 'Consolas', monospace; overflow-x: auto;">
                <div id="biendoi-log" style="line-height: 1.6;">
                    <p style="color: #6a9955;">// Nhấn Bắt đầu để quan sát...</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; background: #f8fafc; padding: 10px; border-radius: 8px;">
                Kết quả hiện tại R(n) = <span id="biendoi-count" style="color:#c70202; font-weight:900; font-size: 1.8rem;">0</span> cặp "0 0"
            </div>
        </div>
    `;
    biendoi_start();
}

function biendoi_start() {
    window.biendoi_n = parseInt(document.getElementById('input-biendoi-n').value) || 0;
    window.biendoi_mode = document.getElementById('biendoi-mode').value;
    window.biendoi_step = 0;
    window.biendoi_res = 0;
    window.biendoi_currentSeq = [1];
    
    document.getElementById('btn-step-biendoi').disabled = false;
    document.getElementById('biendoi-count').innerText = "0";
    
    const log = document.getElementById('biendoi-log');
    log.innerHTML = `<div style="color: #ce9178; margin-bottom:10px;">> Bước 0: Dãy bắt đầu = [1]</div>`;
}

function biendoi_next() {
    if (window.biendoi_step >= window.biendoi_n) return;

    window.biendoi_step++;
    const step = window.biendoi_step;
    const log = document.getElementById('biendoi-log');

    // 1. Thực hiện biến đổi dãy số (Dùng chung cho cả 2 cách để học sinh thấy dãy số)
    let nextSeq = [];
    window.biendoi_currentSeq.forEach(val => {
        if (val === 1) nextSeq.push(0, 1);
        else nextSeq.push(1, 0);
    });
    window.biendoi_currentSeq = nextSeq;

    // 2. Tính toán kết quả
    let oldRes = window.biendoi_res;
    let formulaStr = "";

    if (window.biendoi_mode === 'vetcan') {
        // Cách vét cạn: Đếm trực tiếp
        let count = 0;
        for (let i = 0; i < window.biendoi_currentSeq.length - 1; i++) {
            if (window.biendoi_currentSeq[i] === 0 && window.biendoi_currentSeq[i+1] === 0) count++;
        }
        window.biendoi_res = count;
        formulaStr = `(Đếm trực tiếp trên dãy)`;
        
        // Clear log để chỉ hiện bước hiện tại (đúng ý vét cạn từng bước)
        log.innerHTML = `<div style="color: #ce9178; margin-bottom:10px;">> Đang ở Bước ${step}:</div>`;
    } else {
        // Cách quy luật: Tính theo công thức
        if (step === 1) {
            window.biendoi_res = 0;
            formulaStr = "R(1) = 0";
        } else {
            if ((step - 1) % 2 === 1) {
                window.biendoi_res = oldRes * 2 + 1;
                formulaStr = `R(${step}) = 2 * ${oldRes} + 1 = ${window.biendoi_res}`;
            } else {
                window.biendoi_res = oldRes * 2 - 1;
                formulaStr = `R(${step}) = 2 * ${oldRes} - 1 = ${window.biendoi_res}`;
            }
        }
        // Không xóa log để tạo hiệu ứng các dòng chảy xuống cho học sinh nhìn quy luật
    }

    // 3. Hiển thị dãy số và highlight cặp "0 0"
    let seqHtml = window.biendoi_currentSeq.map((v, idx) => {
        if (v === 0 && window.biendoi_currentSeq[idx+1] === 0) return `<span style="color:#f43f5e; font-weight:bold; text-decoration:underline;">0</span>`;
        if (v === 0 && window.biendoi_currentSeq[idx-1] === 0) return `<span style="color:#f43f5e; font-weight:bold; text-decoration:underline;">0</span>`;
        return `<span style="color:#9cdcfe">${v}</span>`;
    }).join(' ');

    const stepDiv = document.createElement('div');
    stepDiv.style.padding = "8px 0";
    stepDiv.style.borderBottom = "1px solid #334155";
    stepDiv.innerHTML = `
        <div style="color: #4ec9b0; font-size: 0.9rem;">Bước ${step}: <span style="color: #dcdcaa; margin-left:10px;">${formulaStr}</span></div>
        <div style="letter-spacing: 2px; margin-top: 5px;">${seqHtml}</div>
    `;
    log.appendChild(stepDiv);

    // Cuộn xuống cuối
    const visual = document.getElementById('biendoi-visual');
    visual.scrollTop = visual.scrollHeight;

    document.getElementById('biendoi-count').innerText = window.biendoi_res;

    if (window.biendoi_step >= window.biendoi_n) {
        document.getElementById('btn-step-biendoi').disabled = true;
    }
}