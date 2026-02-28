/**
 * FILE MÔ PHỎNG: BÀI SÔ-CÔ-LA (HCM 2011-2012)
 * Tích hợp 2 cách: Mô phỏng bẻ đôi & Phân tích quy luật toán học.
 */

window.socola_k = 0;
window.socola_l = 1;
window.socola_be = 0;
window.socola_tempK = 0;
window.socola_S = 0;
window.socola_step = 0; 

function init_hcm1112_socola_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng Sô-cô-la: Hai góc nhìn</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
                <b>Số ô cần (K):</b> 
                <input type="number" id="input-socola-k" value="6" min="1" max="1024" style="width: 80px; padding:5px; border:1px solid #cbd5e1; border-radius:4px;">
                <button onclick="socola_init()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="socola_nextStep()" id="btn-step-socola" class="toggle-btn" style="background:#29c702; color:white;" disabled>⏭ Bước tiếp theo</button>
            </div>

            <div class="sim-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="font-weight: bold; margin-bottom: 10px; color: #0c4a6e; text-align: center;">🎨 Cách 1: Mô phỏng bẻ đôi</div>
                    <div id="socola-visual" style="display: flex; justify-content: center; gap: 3px; flex-wrap: wrap; min-height:60px; margin-bottom:15px;"></div>
                    <div id="socola-breaking-info" style="font-size: 0.85rem; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e2e8f0;">
                        Chờ khởi tạo...
                    </div>
                </div>
                
                <div style="background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 8px; font-family: 'Consolas', monospace; font-size: 0.85rem;">
                    <div style="color: #fbbf24; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #333;">📊 Cách 2: Phân tích quy luật</div>
                    <div id="socola-log" style="height: 200px; overflow-y: auto;">
                        > Nhập K để phân tích...
                    </div>
                    <div id="socola-math-result" style="margin-top:10px; padding-top:10px; border-top: 1px dashed #444; color: #5ee727;"></div>
                </div>
            </div>
        </div>
    `;
}

function socola_log(msg, color = "#d4d4d4") {
    const logArea = document.getElementById('socola-log');
    if (logArea) {
        logArea.innerHTML += `<div style="color: ${color}">> ${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
    }
}

function socola_init() {
    window.socola_k = parseInt(document.getElementById('input-socola-k').value) || 1;
    window.socola_l = 1;
    window.socola_be = 0;
    window.socola_step = 1; 
    window.socola_tempK = window.socola_k;
    
    document.getElementById('socola-log').innerHTML = "";
    document.getElementById('socola-math-result').innerHTML = "";
    document.getElementById('btn-step-socola').disabled = false;
    
    socola_log(`Khởi tạo K = ${window.socola_k}`, "#38bdf8");
    if (window.socola_k % 2 !== 0) socola_log("Nhận định: K lẻ, số lần bẻ sẽ bằng số lần mũ 2.", "#f59e0b");
    else socola_log("Nhận định: K chẵn, ta bẻ đến khi đạt đủ tổng.", "#f59e0b");

    socola_render(1);
}

function socola_render(size) {
    const container = document.getElementById('socola-visual');
    container.innerHTML = "";
    const taken = window.socola_k - window.socola_tempK;
    for(let i=0; i<size; i++) {
        const box = document.createElement('div');
        box.style.width = "18px"; box.style.height = "18px"; box.style.border = "1px solid #94a3b8";
        // Màu xanh cho ô đã lấy, màu xám cho ô còn lại
        box.style.backgroundColor = (i < taken) ? "#10b981" : "#cbd5e1";
        container.appendChild(box);
    }
    document.getElementById('socola-breaking-info').innerHTML = `
        <b>Thanh hiện tại:</b> ${size} ô<br>
        <b>Đã lấy:</b> ${taken} ô | <b>Cần thêm:</b> ${window.socola_tempK} ô
    `;
}

function socola_nextStep() {
    // BƯỚC 1: TÌM THANH L
    if (window.socola_step === 1) {
        if (window.socola_l < window.socola_k) {
            window.socola_l *= 2;
            socola_log(`Thanh ${window.socola_l/2} nhỏ hơn K, tăng lên ${window.socola_l}`);
            socola_render(window.socola_l);
        } else {
            socola_log(`Chọn thanh nhỏ nhất L = ${window.socola_l}`, "#10b981");
            if (window.socola_l === window.socola_k) {
                socola_log("L = K: Không cần bẻ.", "#5ee727");
                socola_finish();
            } else {
                window.socola_step = 2;
                window.socola_S = window.socola_l;
                socola_log("Bắt đầu quy trình bẻ đôi tham lam...", "#fbbf24");
            }
        }
    } 
    // BƯỚC 2: BẺ ĐÔI THAM LAM
    else if (window.socola_step === 2) {
        if (window.socola_tempK > 0) {
            window.socola_S /= 2;
            window.socola_be++;
            socola_log(`Bẻ đôi thanh thành 2 phần cỡ ${window.socola_S}`);
            
            if (window.socola_tempK >= window.socola_S) {
                window.socola_tempK -= window.socola_S;
                socola_log(`Lấy ${window.socola_S} ô. Cần thêm: ${window.socola_tempK}`, "#10b981");
            } else {
                socola_log(`Thanh ${window.socola_S} quá lớn so với ${window.socola_tempK} ô đang thiếu.`, "#94a3b8");
            }
            socola_render(window.socola_l);
            if (window.socola_tempK === 0) socola_finish();
        }
    }
}

function socola_finish() {
    document.getElementById('socola-math-result').innerHTML = `<b>KẾT QUẢ CUỐI: ${window.socola_l} ${window.socola_be}</b>`;
    socola_log("--- HOÀN THÀNH ---", "#fbbf24");
    document.getElementById('btn-step-socola').disabled = true;
    window.socola_step = 3;
}