/**
 * FILE MÔ PHỎNG: TỔNG NHỊ PHÂN (HCM 13-14)
 */

window.hcm1314_numbers = [];
window.hcm1314_total_ones = 0;
window.hcm1314_generator = null;

function init_hcm1314_one_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-blue">
            <div class="step-badge bg-blue">Mô phỏng: Đếm số bit 1</div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <input type="text" id="hcm-input" value="13, 7, 10" style="flex:1; padding:8px; border-radius:4px; border:1px solid #ccc;" placeholder="Nhập các số cách nhau bởi dấu phẩy">
                <button onclick="hcm_start()" class="toggle-btn" style="background:#0284c7; color:white;">🚀 Bắt đầu</button>
                <button onclick="hcm_step()" id="hcm-btn-step" class="toggle-btn" style="background:#10b981; color:white;" disabled>⏭ Bước tiếp</button>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div id="hcm-list-area" style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; min-height:150px;">
                    <div style="font-weight:bold; margin-bottom:10px; font-size:0.9rem;">DANH SÁCH SỐ</div>
                    <div id="hcm-numbers-display"></div>
                </div>
                
                <div style="background:#1e1e1e; color:#d4d4d4; padding:15px; border-radius:8px; font-family:monospace; font-size:0.85rem; height:150px; overflow-y:auto;" id="hcm-log">
                    > Nhập số và nhấn Bắt đầu...
                </div>
            </div>

            <div style="margin-top:20px; text-align:center; background:#ecfdf5; padding:15px; border-radius:8px; border:1px solid #a7f3d0;">
                <span style="font-weight:bold; color:#065f46;">TỔNG SỐ CHỮ SỐ 1 TOÀN BỘ: </span>
                <span id="hcm-final-res" style="font-size:2rem; font-weight:900; color:#059669;">0</span>
            </div>
        </div>
    `;
}

function hcm_start() {
    const input = document.getElementById('hcm-input').value;
    window.hcm1314_numbers = input.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    window.hcm1314_total_ones = 0;
    
    if (window.hcm1314_numbers.length === 0) {
        alert("Vui lòng nhập số hợp lệ!");
        return;
    }

    document.getElementById('hcm-final-res').innerText = "0";
    document.getElementById('hcm-log').innerHTML = "> Bắt đầu xử lý từng số...<br>";
    
    hcm_render_list();
    window.hcm1314_generator = hcm_logic();
    document.getElementById('hcm-btn-step').disabled = false;
}

function hcm_render_list(activeIndex = -1) {
    let html = "";
    window.hcm1314_numbers.forEach((num, idx) => {
        let style = "padding:8px; margin-bottom:5px; border-radius:4px; background:white; border:1px solid #cbd5e1; display:flex; justify-content:space-between;";
        if (idx === activeIndex) style += "border:2px solid #3b82f6; background:#eff6ff;";
        html += `<div style="${style}">
                    <span>Số: <b>${num}</b></span>
                    <span id="res-idx-${idx}" style="color:#64748b;">? bit 1</span>
                 </div>`;
    });
    document.getElementById('hcm-numbers-display').innerHTML = html;
}

function* hcm_logic() {
    for (let i = 0; i < window.hcm1314_numbers.length; i++) {
        let n = window.hcm1314_numbers[i];
        let original = n;
        let bits = "";
        let count = 0;

        hcm_render_list(i);
        hcm_log(`Đang xử lý số ${n}...`, "#3b82f6");

        // Mô phỏng quá trình chia nhị phân
        while (n > 0) {
            let bit = n % 2;
            bits = bit + bits;
            if (bit === 1) count++;
            n = Math.floor(n / 2);
            
            hcm_log(`  ${original} / 2 dư ${bit} -> Chuỗi: ${bits}`, "#94a3b8");
            yield;
        }

        if (original === 0) { bits = "0"; count = 0; }

        window.hcm1314_total_ones += count;
        document.getElementById(`res-idx-${i}`).innerHTML = `<b style="color:#2563eb;">${count} bit 1</b> (<code>${bits}</code>)`;
        document.getElementById('hcm-final-res').innerText = window.hcm1314_total_ones;
        hcm_log(`Số ${original} có ${count} chữ số 1.`, "#10b981");
        yield;
    }
    hcm_log("HOÀN THÀNH TẤT CẢ!", "#fbbf24");
    document.getElementById('hcm-btn-step').disabled = true;
}

function hcm_step() {
    if (window.hcm1314_generator) {
        window.hcm1314_generator.next();
    }
}

function hcm_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('hcm-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}