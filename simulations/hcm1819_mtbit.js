/**
 * FILE MÔ PHỎNG: KÍ TỰ (KITU - HCM 18-19)
 * Tác giả: Gemini
 */

window.kitu_S = "";
window.kitu_A = [];
window.kitu_mode = 'dp';
window.kitu_generator = null;
window.kitu_auto_timer = null;

function init_hcm1819_kitu_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Dãy con tăng dài nhất (LIS)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
                <div style="flex: 2;">
                    <label style="font-size:0.85rem; color:#64748b; font-weight:bold;">Nhập chuỗi S (có cả hoa và thường):</label><br>
                    <input type="text" id="kitu-input" value="aADbCBcdDCEefDEgFh" style="width:100%; padding:8px; border-radius:4px; border:1px solid #cbd5e1; font-family:monospace; font-size:1.1rem; letter-spacing: 2px;">
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">
                    <select id="kitu-mode" style="padding:6px; border-radius:4px; border:1px solid #cbd5e1;">
                        <option value="dp">Cách 2: Quy hoạch động O(N²)</option>
                        <option value="naive">Cách 1: Vét cạn Đệ quy O(2^N)</option>
                    </select>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <button onclick="kitu_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp & Khởi tạo</button>
                <button onclick="kitu_step()" id="btn-kitu-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                <button onclick="kitu_toggle_auto()" id="btn-kitu-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px; overflow-x: auto;">
                <div style="font-size:0.8rem; font-weight:bold; color:#475569; margin-bottom:10px;">BẢNG QUY HOẠCH ĐỘNG (DP)</div>
                <div id="kitu-dp-table" style="display: flex; min-width: max-content; padding-bottom: 10px;">
                    </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                <div id="kitu-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                    > Nhập chuỗi và nhấn Nạp...
                </div>
                
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#166534; margin-bottom: 10px;">KẾT QUẢ DÀI NHẤT (MAX)</div>
                    <div id="kitu-res-total" style="color:#15803d; font-size: 3.5rem; font-weight: 900;">0</div>
                </div>
            </div>
        </div>
    `;
}

function kitu_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('kitu-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function kitu_start() {
    window.kitu_S = document.getElementById('kitu-input').value.trim();
    if (!window.kitu_S) return;
    
    clearInterval(window.kitu_auto_timer);
    document.getElementById('btn-kitu-auto').innerHTML = "▶ Tự động";
    window.kitu_auto_timer = null;
    window.kitu_mode = document.getElementById('kitu-mode').value;

    // Lọc ký tự in hoa
    window.kitu_A = [];
    for (let char of window.kitu_S) {
        if (char >= 'A' && char <= 'Z') {
            window.kitu_A.push(char);
        }
    }

    document.getElementById('kitu-res-total').innerText = "0";
    document.getElementById('kitu-log').innerHTML = "";
    document.getElementById('btn-kitu-step').disabled = false;
    document.getElementById('btn-kitu-auto').disabled = false;
    
    kitu_log(`Chuỗi gốc S: ${window.kitu_S}`);
    kitu_log(`Lọc in hoa mảng A: [${window.kitu_A.join(', ')}]`, "#38bdf8");
    
    if (window.kitu_A.length === 0) {
        kitu_log(`Không có ký tự in hoa nào. Kết quả: 0`, "#ef4444");
        return;
    }

    if (window.kitu_mode === 'dp') {
        kitu_render_table(-1, -1, Array(window.kitu_A.length).fill(1));
        window.kitu_generator = logic_kitu_dp();
    } else {
        kitu_render_table(-1, -1, Array(window.kitu_A.length).fill('-'));
        window.kitu_generator = logic_kitu_naive();
    }
    kitu_step();
}

function kitu_render_table(idx_i, idx_j, dp_arr) {
    const container = document.getElementById('kitu-dp-table');
    let html = `
        <table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 1.2rem;">
            <tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight:bold; color:#64748b;">Chỉ số</td>
    `;
    for(let k=0; k<window.kitu_A.length; k++) {
        html += `<td style="padding: 8px 15px; border: 1px solid #cbd5e1; color:#94a3b8;">${k}</td>`;
    }
    html += `</tr><tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight:bold; color:#1e293b;">S</td>`;
    for(let k=0; k<window.kitu_A.length; k++) {
        let bg = "white";
        if (k === idx_i) bg = "#fef08a"; // Vàng cho i
        if (k === idx_j) bg = "#bae6fd"; // Xanh dương cho j
        html += `<td style="padding: 8px 15px; border: 1px solid #cbd5e1; background:${bg}; font-weight:bold;">${window.kitu_A[k]}</td>`;
    }
    html += `</tr><tr><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight:bold; color:#be185d;">DP</td>`;
    for(let k=0; k<window.kitu_A.length; k++) {
        let bg = "white";
        if (k === idx_i) bg = "#fef08a";
        let fw = (dp_arr[k] !== 1 && dp_arr[k] !== '-') ? "bold" : "normal";
        let color = (dp_arr[k] !== 1 && dp_arr[k] !== '-') ? "#be185d" : "#64748b";
        html += `<td style="padding: 8px 15px; border: 1px solid #cbd5e1; background:${bg}; font-weight:${fw}; color:${color}; transition: all 0.2s;">${dp_arr[k]}</td>`;
    }
    html += `</tr></table>`;
    container.innerHTML = html;
}

function* logic_kitu_dp() {
    let N = window.kitu_A.length;
    let dp = Array(N).fill(1);
    let max_ans = 1;
    document.getElementById('kitu-res-total').innerText = "1";

    kitu_log(`\n--- BẮT ĐẦU QUY HOẠCH ĐỘNG ---`, "#c084fc");
    kitu_log(`Khởi tạo DP[i] = 1 với mọi i.`, "#94a3b8");
    yield;

    for (let i = 1; i < N; i++) {
        kitu_log(`-----------------`);
        kitu_log(`Xét <b>i = ${i}</b> (Ký tự <b>${window.kitu_A[i]}</b>):`, "#f59e0b");
        
        for (let j = 0; j < i; j++) {
            kitu_render_table(i, j, dp);
            
            let char_i = window.kitu_A[i];
            let char_j = window.kitu_A[j];
            
            if (char_j < char_i) {
                kitu_log(`- Ký tự tại j=${j} ('${char_j}') < '${char_i}'. Có thể ghép!`, "#10b981");
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                    kitu_render_table(i, j, dp); // Chớp sáng số DP
                    kitu_log(`  -> Cập nhật: DP[${i}] = DP[${j}] + 1 = <b>${dp[i]}</b>`, "#be185d");
                } else {
                    kitu_log(`  -> Bỏ qua: DP[${j}]+1 không lớn hơn DP[${i}] hiện tại.`);
                }
            } else {
                kitu_log(`- Ký tự tại j=${j} ('${char_j}') ≥ '${char_i}'. Không ghép được.`, "#ef4444");
            }
            yield;
        }
        max_ans = Math.max(max_ans, dp[i]);
        document.getElementById('kitu-res-total').innerText = max_ans;
    }

    kitu_render_table(-1, -1, dp);
    kitu_log(`\nHOÀN THÀNH DP! Độ dài lớn nhất tìm được: ${max_ans}`, "#22c55e");
    document.getElementById('btn-kitu-step').disabled = true;
    document.getElementById('btn-kitu-auto').disabled = true;
    kitu_toggle_auto(true);
}

function* logic_kitu_naive() {
    let N = window.kitu_A.length;
    if (N > 15) {
        kitu_log(`Cảnh báo: N = ${N} quá lớn đối với thuật toán đệ quy O(2^N). Hệ thống chỉ quét 1 phần để tránh treo trình duyệt.`, "#ef4444");
        N = 15; 
    }

    let max_len = 0;
    let stack = [];

    function* backtrack(index, last_char, current_len, path_str) {
        max_len = Math.max(max_len, current_len);
        document.getElementById('kitu-res-total').innerText = max_len;

        if (index >= N) return;

        // Bỏ qua
        yield* backtrack(index + 1, last_char, current_len, path_str);

        // Chọn
        let current_char = window.kitu_A[index];
        if (last_char === '' || current_char > last_char) {
            let new_path = path_str + current_char;
            kitu_log(`Duyệt nhánh: ${new_path} (Độ dài: ${current_len + 1})`);
            kitu_render_table(index, -1, Array(window.kitu_A.length).fill('-'));
            yield; // Dừng 1 nhịp khi tìm ra dãy mới hợp lệ
            yield* backtrack(index + 1, current_char, current_len + 1, new_path);
        }
    }

    kitu_log(`\n--- BẮT ĐẦU VÉT CẠN ĐỆ QUY ---`, "#c084fc");
    yield* backtrack(0, '', 0, '');

    kitu_render_table(-1, -1, Array(window.kitu_A.length).fill('-'));
    kitu_log(`\nHOÀN THÀNH VÉT CẠN! Độ dài lớn nhất: ${max_len}`, "#22c55e");
    document.getElementById('btn-kitu-step').disabled = true;
    document.getElementById('btn-kitu-auto').disabled = true;
    kitu_toggle_auto(true);
}

function kitu_step() {
    if (window.kitu_generator) window.kitu_generator.next();
}

function kitu_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-kitu-auto');
    if (window.kitu_auto_timer || forceStop) {
        clearInterval(window.kitu_auto_timer);
        window.kitu_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        let speed = window.kitu_mode === 'dp' ? 500 : 200; // Đệ quy cho chạy nhanh hơn
        window.kitu_auto_timer = setInterval(() => {
            if(window.kitu_generator) {
                let res = window.kitu_generator.next();
                if(res.done) kitu_toggle_auto(true);
            }
        }, speed);
    }
}