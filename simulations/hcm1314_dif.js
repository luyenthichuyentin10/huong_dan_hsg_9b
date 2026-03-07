/**
 * FILE MÔ PHỎNG: SỐ KHÁC NHAU (HCM 13-14)
 * Tên hàm: init_hcm1314_dif_simulation
 */

window.hcm1314_dif_data = [];
window.hcm1314_dif_map = new Map();
window.hcm1314_dif_generator = null;

function init_hcm1314_dif_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Đếm số xuất hiện 1 lần</div>
            
            <div style="margin-bottom: 20px;">
                <p><b>Nhập dãy số:</b> (cách nhau bằng khoảng trắng)</p>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="dif-input" value="3 3 4 5 1 2 1 3 6" style="flex:1; padding:8px; border-radius:4px; border:1px solid #ccc;">
                    <button onclick="dif_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Khởi tạo</button>
                    <button onclick="dif_step()" id="dif-btn-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
                </div>
            </div>

            <div class="sim-layout" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px;">
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #0c4a6e;">Dãy số hiện tại:</div>
                    <div id="dif-array-display" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
                </div>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #cbd5e1;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #0c4a6e; text-align: center;">Bảng tần suất</div>
                    <div id="dif-freq-table" style="max-height: 200px; overflow-y: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                            <thead>
                                <tr style="background: #e2e8f0;">
                                    <th style="border: 1px solid #cbd5e1; padding: 4px;">Số</th>
                                    <th style="border: 1px solid #cbd5e1; padding: 4px;">Lần</th>
                                </tr>
                            </thead>
                            <tbody id="dif-freq-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id="dif-log" style="margin-top:15px; background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 100px; overflow-y: auto; font-size: 0.85rem;">
                > Nhấn "Khởi tạo" để bắt đầu...
            </div>

            <div style="margin-top:15px; display: flex; justify-content: space-around; align-items: center; background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
                <div>Số đang xét: <b id="dif-curr-val" style="color:#0284c7; font-size:1.2rem;">-</b></div>
                <div style="font-weight:bold; color:#166534;">KẾT QUẢ: <span id="dif-result" style="font-size:2rem; color:#15803d;">0</span></div>
            </div>
        </div>
    `;
}

function dif_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('dif-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function dif_render_array(activeIndex = -1) {
    const container = document.getElementById('dif-array-display');
    container.innerHTML = window.hcm1314_dif_data.map((val, idx) => {
        let style = "width:35px; height:35px; display:flex; align-items:center; justify-content:center; border:1px solid #cbd5e1; border-radius:4px; font-weight:bold;";
        if (idx === activeIndex) style += "background:#fef08a; border:2px solid #f59e0b; transform: scale(1.1);";
        return `<div style="${style}">${val}</div>`;
    }).join('');
}

function dif_render_table(finalPhase = false) {
    const tbody = document.getElementById('dif-freq-body');
    let html = "";
    let countResult = 0;
    
    window.hcm1314_dif_map.forEach((count, num) => {
        let rowStyle = "";
        if (finalPhase && count === 1) {
            rowStyle = "background: #dcfce7; font-weight: bold; color: #166534;";
            countResult++;
        }
        html += `<tr style="${rowStyle}">
                    <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${num}</td>
                    <td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center;">${count}</td>
                 </tr>`;
    });
    tbody.innerHTML = html;
    if (finalPhase) document.getElementById('dif-result').innerText = countResult;
}

function dif_start() {
    const input = document.getElementById('dif-input').value;
    window.hcm1314_dif_data = input.split(/\s+/).filter(x => x !== "").map(Number);
    window.hcm1314_dif_map = new Map();
    
    if (window.hcm1314_dif_data.length === 0) return;

    document.getElementById('dif-log').innerHTML = "";
    document.getElementById('dif-result').innerText = "0";
    document.getElementById('dif-curr-val').innerText = "-";
    
    dif_render_array();
    dif_render_table();
    window.hcm1314_dif_generator = dif_logic();
    document.getElementById('dif-btn-step').disabled = false;
    dif_log("Bắt đầu duyệt dãy để đếm tần suất.", "#38bdf8");
}

function* dif_logic() {
    // Bước 1: Đếm
    for (let i = 0; i < window.hcm1314_dif_data.length; i++) {
        let val = window.hcm1314_dif_data[i];
        document.getElementById('dif-curr-val').innerText = val;
        dif_render_array(i);
        
        let count = window.hcm1314_dif_map.get(val) || 0;
        window.hcm1314_dif_map.set(val, count + 1);
        
        dif_render_table();
        dif_log(`Đã thấy số ${val}. Tần suất hiện tại: ${count + 1}`);
        yield;
    }

    // Bước 2: Kết luận
    dif_log("Duyệt xong. Tìm các số có tần suất bằng 1.", "#fbbf24");
    dif_render_array();
    dif_render_table(true);
    
    dif_log(`Hoàn thành! Có ${document.getElementById('dif-result').innerText} số chỉ xuất hiện 1 lần.`, "#10b981");
    document.getElementById('dif-btn-step').disabled = true;
}

function dif_step() {
    if (window.hcm1314_dif_generator) {
        window.hcm1314_dif_generator.next();
    }
}