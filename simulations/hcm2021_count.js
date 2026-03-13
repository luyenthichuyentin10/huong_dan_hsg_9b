/**
 * FILE MÔ PHỎNG: ĐẾM SỐ (COUNT - HCM 20-21)
 * Tác giả: Gemini
 */

window.cnt_N = 0;
window.cnt_X = 0;
window.cnt_Q = 0;
window.cnt_A = [];
window.cnt_Valid = [];
window.cnt_P = [];
window.cnt_Queries = [];
window.cnt_generator = null;
window.cnt_auto_timer = null;

function init_hcm2021_count_simulation() {
    const container = document.getElementById('simulation-area');
    if (!container) return;

    container.innerHTML = `
        <div class="step-card border-purple">
            <div class="step-badge bg-purple">Mô phỏng: Mảng cộng dồn (Prefix Sum)</div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <textarea id="cnt-input" style="width: 200px; height: 160px; padding: 5px; font-family: monospace; font-size: 1rem;" placeholder="Nhập N X Q&#10;Mảng A&#10;Các cặp L R...">9 6 2
8 -1 6 5 -2 7 -3 4 -8
1 6
4 9</textarea>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; flex: 1;">
                    <div style="display: flex; gap: 10px;">
                        <button onclick="cnt_start()" class="toggle-btn" style="background:#0284c7; color:white; flex:1;">🚀 Nạp Dữ Liệu</button>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="cnt_step()" id="btn-cnt-step" class="toggle-btn" style="background:#29c702; color:white; flex:1;" disabled>⏭ Bước tiếp</button>
                        <button onclick="cnt_toggle_auto()" id="btn-cnt-auto" class="toggle-btn" style="background:#8b5cf6; color:white; flex:1;" disabled>▶ Tự động</button>
                    </div>
                    
                    <div style="background: #f8fafc; padding: 10px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-top:5px; text-align:center;">
                        <div style="font-size:0.9rem; font-weight:bold; color:#0f172a;">ĐIỀU KIỆN ĐỒ VẬT HỢP LỆ:</div>
                        <div style="font-size:1.2rem; color:#b45309; font-weight:bold; font-family:monospace;">0 &lt; A[i] &lt; X (<span id="lbl-X">-</span>)</div>
                    </div>
                </div>
            </div>

            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; overflow-x: auto; margin-bottom: 20px;">
                <div id="cnt-arrays" style="display: flex; flex-direction: column; gap: 5px; min-width: max-content;">
                    </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px;">
                <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fde047;">
                    <div style="font-size:0.85rem; font-weight:bold; color:#92400e; margin-bottom: 10px;">TRUY VẤN (QUERIES)</div>
                    <div id="cnt-queries-list" style="display: flex; flex-direction: column; gap: 8px;">
                    </div>
                </div>

                <div id="cnt-log" style="background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 8px; font-family: monospace; height: 180px; overflow-y: auto; font-size: 0.85rem; line-height: 1.5;">
                    > Nhập dữ liệu và nhấn Nạp...
                </div>
            </div>
        </div>
    `;
}

function cnt_log(msg, color = "#d4d4d4") {
    const log = document.getElementById('cnt-log');
    log.innerHTML += `<div style="color:${color}">> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function cnt_start() {
    const lines = document.getElementById('cnt-input').value.trim().split('\n');
    if (lines.length < 3) return;
    
    clearInterval(window.cnt_auto_timer);
    document.getElementById('btn-cnt-auto').innerHTML = "▶ Tự động";
    window.cnt_auto_timer = null;

    try {
        const [N, X, Q] = lines[0].trim().split(/\s+/).map(Number);
        window.cnt_N = N;
        window.cnt_X = X;
        window.cnt_Q = Q;
        
        window.cnt_A = lines[1].trim().split(/\s+/).map(Number);
        window.cnt_Queries = [];
        for (let i = 2; i < 2 + Q; i++) {
            if (lines[i]) {
                let [L, R] = lines[i].trim().split(/\s+/).map(Number);
                window.cnt_Queries.push({L, R});
            }
        }
    } catch(e) {
        alert("Lỗi định dạng. Vui lòng làm theo cấu trúc Ví dụ."); return;
    }

    document.getElementById('lbl-X').innerText = window.cnt_X;
    document.getElementById('cnt-queries-list').innerHTML = "";
    document.getElementById('cnt-log').innerHTML = "";
    
    // Init arrays (1-based index)
    window.cnt_Valid = Array(window.cnt_N + 1).fill('-');
    window.cnt_P = Array(window.cnt_N + 1).fill('-');
    window.cnt_P[0] = 0; // Rào

    document.getElementById('btn-cnt-step').disabled = false;
    document.getElementById('btn-cnt-auto').disabled = false;
    
    cnt_render_arrays(-1, null);
    window.cnt_generator = logic_cnt();
    cnt_log(`Nạp thành công ${window.cnt_N} đồ vật và ${window.cnt_Q} truy vấn.`, "#38bdf8");
}

function cnt_render_arrays(activeIdx, queryHighlight = null) {
    const container = document.getElementById('cnt-arrays');
    let N = window.cnt_N;
    
    let html = `<table style="border-collapse: collapse; text-align: center; font-family: monospace; font-size: 1.1rem;">`;
    
    // Row 1: Index
    html += `<tr><td style="padding: 8px; font-weight:bold; color:#64748b; border:1px solid #cbd5e1;">Index (i)</td>`;
    html += `<td style="padding: 8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold; color:#94a3b8;">0</td>`;
    for(let i=1; i<=N; i++) html += `<td style="padding: 8px; border:1px solid #cbd5e1; font-weight:bold; color:#64748b;">${i}</td>`;
    html += `</tr>`;

    // Row 2: Array A
    html += `<tr><td style="padding: 8px; font-weight:bold; color:#1e293b; border:1px solid #cbd5e1;">Mảng A[i]</td>`;
    html += `<td style="padding: 8px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">-</td>`;
    for(let i=1; i<=N; i++) {
        let bg = i === activeIdx ? "#fef08a" : "white";
        if (queryHighlight && i >= queryHighlight.L && i <= queryHighlight.R) bg = "#e0e7ff"; // Xanh nhạt
        html += `<td style="padding: 8px; border:1px solid #cbd5e1; background:${bg};">${window.cnt_A[i-1]}</td>`;
    }
    html += `</tr>`;

    // Row 3: Valid (0/1)
    html += `<tr><td style="padding: 8px; font-weight:bold; color:#b45309; border:1px solid #cbd5e1;">Hợp lệ (0/1)</td>`;
    html += `<td style="padding: 8px; border:1px solid #cbd5e1; background:#f8fafc; color:#94a3b8;">-</td>`;
    for(let i=1; i<=N; i++) {
        let val = window.cnt_Valid[i];
        let color = val === 1 ? "#10b981" : (val === 0 ? "#ef4444" : "#cbd5e1");
        html += `<td style="padding: 8px; border:1px solid #cbd5e1; color:${color}; font-weight:bold;">${val}</td>`;
    }
    html += `</tr>`;

    // Row 4: Prefix Sum P
    html += `<tr><td style="padding: 8px; font-weight:bold; color:#0284c7; border:1px solid #cbd5e1;">Mảng Cộng dồn P</td>`;
    html += `<td style="padding: 8px; border:1px solid #cbd5e1; background:#e0f2fe; color:#0369a1; font-weight:bold; border-right:2px solid #0284c7;">${window.cnt_P[0]}</td>`;
    for(let i=1; i<=N; i++) {
        let bg = i === activeIdx ? "#bae6fd" : "white";
        let color = window.cnt_P[i] !== '-' ? "#0284c7" : "#cbd5e1";
        let fw = window.cnt_P[i] !== '-' ? "bold" : "normal";
        let border = "1px solid #cbd5e1";
        let scale = "";

        // Query highlight cho công thức P[R] - P[L-1]
        if (queryHighlight && (i === queryHighlight.R || i === queryHighlight.L - 1)) {
            bg = "#fce7f3"; // Hồng
            color = "#be185d";
            border = "2px solid #ec4899";
            scale = "transform: scale(1.1); box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
        }

        html += `<td style="padding: 8px; border:${border}; background:${bg}; color:${color}; font-weight:${fw}; transition:all 0.3s; ${scale}">${window.cnt_P[i]}</td>`;
    }
    html += `</tr></table>`;
    
    container.innerHTML = html;
}

function* logic_cnt() {
    let N = window.cnt_N;
    let X = window.cnt_X;

    cnt_log(`\n--- BƯỚC 1: XÂY DỰNG MẢNG CỘNG DỒN ---`, "#c084fc");
    
    for (let i = 1; i <= N; i++) {
        let val = window.cnt_A[i-1];
        cnt_render_arrays(i, null);
        
        let isValid = (val > 0 && val < X) ? 1 : 0;
        window.cnt_Valid[i] = isValid;
        
        cnt_log(`Xét A[${i}] = ${val}. Điều kiện (0 < ${val} < ${X}) -> ${isValid === 1 ? 'HỢP LỆ (1)' : 'KHÔNG (0)'}`);
        yield;

        window.cnt_P[i] = window.cnt_P[i-1] + isValid;
        cnt_render_arrays(i, null);
        cnt_log(`-> Cộng dồn: P[${i}] = P[${i-1}] + ${isValid} = <b>${window.cnt_P[i]}</b>`, "#0ea5e9");
        yield;
    }

    cnt_log(`\n--- BƯỚC 2: TRẢ LỜI CÁC TRUY VẤN O(1) ---`, "#c084fc");
    
    let qList = document.getElementById('cnt-queries-list');
    
    for (let q = 0; q < window.cnt_Q; q++) {
        let L = window.cnt_Queries[q].L;
        let R = window.cnt_Queries[q].R;
        
        cnt_log(`\nTruy vấn ${q+1}: <b>[L = ${L}, R = ${R}]</b>`, "#f59e0b");
        
        // Render highlight đặc biệt: Khu vực A từ L->R, và P tại R và L-1
        cnt_render_arrays(-1, {L: L, R: R});
        
        let pR = window.cnt_P[R];
        let pL_minus_1 = window.cnt_P[L - 1];
        let ans = pR - pL_minus_1;
        
        cnt_log(`Áp dụng công thức O(1): Tổng = <b>P[R] - P[L-1]</b>`);
        yield;
        
        cnt_log(`-> P[${R}] = ${pR}`);
        cnt_log(`-> P[${L-1}] = ${pL_minus_1}`);
        cnt_log(`=> KẾT QUẢ = ${pR} - ${pL_minus_1} = <b>${ans}</b>`, "#10b981");
        
        qList.innerHTML += `<div style="background:white; padding:8px 12px; border-radius:4px; border:1px solid #cbd5e1;">Q${q+1} [${L}, ${R}]: <span style="font-family:monospace; color:#be185d;">P[${R}] - P[${L-1}]</span> = <b style="color:#15803d; font-size:1.1rem;">${ans}</b></div>`;
        yield;
    }

    cnt_render_arrays(-1, null);
    cnt_log(`\nHOÀN THÀNH TẤT CẢ TRUY VẤN!`, "#fbbf24");
    
    document.getElementById('btn-cnt-step').disabled = true;
    document.getElementById('btn-cnt-auto').disabled = true;
    cnt_toggle_auto(true);
}

function cnt_step() {
    if (window.cnt_generator) window.cnt_generator.next();
}

function cnt_toggle_auto(forceStop = false) {
    const btn = document.getElementById('btn-cnt-auto');
    if (window.cnt_auto_timer || forceStop) {
        clearInterval(window.cnt_auto_timer);
        window.cnt_auto_timer = null;
        if (!forceStop) btn.innerHTML = "▶ Tự động";
    } else {
        btn.innerHTML = "⏸ Tạm dừng";
        window.cnt_auto_timer = setInterval(() => {
            if(window.cnt_generator) {
                let res = window.cnt_generator.next();
                if(res.done) cnt_toggle_auto(true);
            }
        }, 1000); // 1s delay
    }
}