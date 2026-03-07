/**
 * FILE MÔ PHỎNG: LƯỚI VUÔNG (SQUARE - HCM 13-14)
 */

window.hcm1314_sq_matrix = [];
window.hcm1314_sq_n = 0;
window.hcm1314_sq_generator = null;
window.hcm1314_sq_count = 0;

function init_hcm1314_square_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Đếm số 1 cô độc</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div>Kích thước N: <input type="number" id="sq-n" value="3" min="2" max="10" style="width:50px; padding:5px;"></div>
                <button onclick="sq_generate()" class="toggle-btn" style="background:#64748b; color:white;">🎲 Ngẫu nhiên</button>
                <button onclick="sq_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="sq_step()" id="sq-btn-step" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div class="sim-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div id="sq-grid-container" style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: center;">
                    </div>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div id="sq-log" style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: monospace; height: 200px; overflow-y: auto; font-size: 0.85rem;">
                        > Nhấn "Bắt đầu" để kiểm tra lưới...
                    </div>
                    <div style="background: #f0fdf4; padding: 15px; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center;">
                        <div style="font-weight:bold; color:#166534;">SỐ 1 CÔ ĐỘC TÌM THẤY</div>
                        <div id="sq-res" style="color:#15803d; font-size: 2.5rem; font-weight: 900;">0</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    sq_generate();
}

function sq_generate() {
    const n = parseInt(document.getElementById('sq-n').value);
    window.hcm1314_sq_n = n;
    // Tạo ma trận mẫu giống ví dụ đề bài nếu n=3, ngược lại ngẫu nhiên
    if (n === 3) {
        window.hcm1314_sq_matrix = [[1, 0, 1], [0, 0, 1], [0, 0, 0]];
    } else {
        window.hcm1314_sq_matrix = Array.from({ length: n }, () => 
            Array.from({ length: n }, () => (Math.random() > 0.7 ? 1 : 0))
        );
    }
    sq_render();
    document.getElementById('sq-log').innerHTML = "> Đã tạo lưới " + n + "x" + n;
    document.getElementById('sq-res').innerText = "0";
    document.getElementById('sq-btn-step').disabled = true;
}

function sq_render(activeR = -1, activeC = -1, isLonely = null) {
    let html = `<table style="border-collapse: collapse;">`;
    for (let i = 0; i < window.hcm1314_sq_n; i++) {
        html += `<tr>`;
        for (let j = 0; j < window.hcm1314_sq_n; j++) {
            let val = window.hcm1314_sq_matrix[i][j];
            let style = "width:35px; height:35px; text-align:center; border:1px solid #cbd5e1; font-weight:bold;";
            
            if (val === 1) style += "color: #1e293b; background: #f8fafc;";
            else style += "color: #cbd5e1;";

            // Highlight ô đang xét
            if (i === activeR && j === activeC) {
                if (isLonely === true) style += "background: #dcfce7; border: 2px solid #22c55e; color: #15803d;";
                else if (isLonely === false) style += "background: #fee2e2; border: 2px solid #ef4444; color: #b91c1c;";
                else style += "background: #fef08a; border: 2px solid #f59e0b;";
            }

            html += `<td style="${style}">${val}</td>`;
        }
        html += `</tr>`;
    }
    document.getElementById('sq-grid-container').innerHTML = html + "</table>";
}

function sq_start() {
    window.hcm1314_sq_count = 0;
    document.getElementById('sq-res').innerText = "0";
    window.hcm1314_sq_generator = sq_logic();
    document.getElementById('sq-btn-step').disabled = false;
    sq_step();
}

function* sq_logic() {
    const n = window.hcm1314_sq_n;
    const mat = window.hcm1314_sq_matrix;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (mat[i][j] === 1) {
                sq_render(i, j);
                sq_log(`Đang kiểm tra ô (hàng ${i+1}, cột ${j+1})...`);
                yield;

                let lonely = true;
                // Kiểm tra 4 hướng
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (let [dr, dc] of directions) {
                    let r = i + dr;
                    let c = j + dc;
                    if (r >= 0 && r < n && c >= 0 && c < n) {
                        if (mat[r][c] === 1) {
                            lonely = false;
                            break;
                        }
                    }
                }

                if (lonely) {
                    window.hcm1314_sq_count++;
                    document.getElementById('sq-res').innerText = window.hcm1314_sq_count;
                    sq_render(i, j, true);
                    sq_log(`Ô (${i+1}, ${j+1}) là số 1 CÔ ĐỘC!`, "#10b981");
                } else {
                    sq_render(i, j, false);
                    sq_log(`Ô (${i+1}, ${j+1}) có lân cận là số 1.`, "#f87171");
                }
                yield;
            }
        }
    }
    sq_log("HOÀN THÀNH. Tổng số 1 cô độc: " + window.hcm1314_sq_count, "#fbbf24");
    document.getElementById('sq-btn-step').disabled = true;
}

function sq_step() {
    if (window.hcm1314_sq_generator) {
        window.hcm1314_sq_generator.next();
    }
}

function sq_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('sq-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}